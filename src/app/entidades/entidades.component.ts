import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { EntidadesService } from './services/entidades.service';
import { Entidad } from './interfaces/entidad';
import { ConfirmationService } from 'primeng/api';
import { EntidadManager } from './entidad-manager';
import { EntidadesFormComponent } from './components/entidades-form/entidades-form.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,EntidadesFormComponent,ConfirmDialogModule],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: []
})
export default class EntidadesComponent implements OnInit {
  public entidadesService = inject(EntidadesService);

  private entidadManager = inject(EntidadManager);
  private confirmationService = inject(ConfirmationService);

    entidades = this.entidadManager.entidades
    loading = this.entidadManager.loading


  total = computed(() => this.entidades().length);
  selectedEntidades: Entidad[]=[];
  selectedEntidad:Entidad| null = null
  showModal = signal<boolean>(false)
  mode: 'create' | 'edit' = 'create';

  filterText = signal<string>('')

  
  constructor(){
  }
  ngOnInit(): void {
    this.entidadManager.loadEntidades()
  }

  /** MEtodo para guardar una entidad
   * @param entidad
   */
   openNewCreate() {
    this.mode = 'create';
    this.selectedEntidad = null;
    this.showModal.set(true)
  }
//abrir modal actualizar
  openUpdate(entidad: Entidad) {
    this.mode = 'edit';
    this.selectedEntidad = entidad;
    this.showModal.set(true)
  }
    cerrarModal(event:boolean){
    this.showModal.set(false)
  }
  /**Guardar entidad */
  saveEntitie(event:any){
    if(event.action === 'create'){
    this.entidadManager.save(event.values)
    this.showModal.set(false)
    } else{
      const entidad = this.selectedEntidad
      if(!entidad?.id) return 
      this.entidadManager.update(entidad.id,event.values)
    this.showModal.set(false)
    }
    
  }
/**Borrar con confirmacion
 * @param entidadId
 */
 delete(entidadId: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta entidad?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.entidadManager.delete(entidadId);
      }
    });
  }

  /**Borrar con confirmacion
 * @param selected
 */
 deleteEntidades(selected: any[]) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar las ${selected.length} entidades seleccionadas?`,
      header: 'Eliminar Múltiples',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        const ids = selected.map(entidad => entidad.id);
        this.entidadManager.deletes(ids);
        this.selectedEntidades = [];
      }
    });
  }


 
  edit(entidad:Entidad){
    console.log("recibido del hijo", entidad);
  }

  filtered = computed(() =>{
    const term = this.filterText().toLowerCase();
    const entidades = this.entidades()
    
    if(!term) return entidades;
    
    return entidades.filter(ent => 
      ent.nombre.toLowerCase().includes(term)
    )
  })
  /**metodo para filtrar */
  onSearch(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this.filterText.set(value);
}


}
