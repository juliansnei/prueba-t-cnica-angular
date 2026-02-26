import { Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ContactoManager } from './contacto-manager';
import { FormContactosComponent } from '../components/form-contactos/form-contactos.component';
import { EntidadManager } from '../../entidades/entidad-manager';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { Contacto } from '../interface/contacto.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 




@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [TableModule, ButtonModule, ToolbarModule, AvatarModule, TagModule, TooltipModule, FormContactosComponent, ToastModule, ToolbarModule, CardModule, ConfirmDialogModule],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css'
})
export class ContactosComponent implements OnInit {



  private managerContactos = inject(ContactoManager)
  private managerEntidades = inject(EntidadManager)
  private confirmationService = inject(ConfirmationService);
  textFilter = signal<string>('');

  contactos = this.managerContactos.contactosFull;
  entidades = this.managerEntidades.entidades
  selectedContactos: Contacto[] = []

  entidadesOpciones = computed(() => {
    return this.entidades()
      .filter(cont => cont.id !== undefined)
      .map(cont => ({
        label: cont.nombre,
        value: cont.id as number
      }));
  });

  loading = this.managerContactos.loading
  formRef = viewChild(FormContactosComponent);
  selectedContacto: any = null;
  mode = signal<'create' | 'edit'>('create');


  contactosFiltrados = computed(() => {
    const term = this.textFilter()
    if (!term) return this.contactos()
    const contactos = this.contactos()

    return contactos
  })
  ngOnInit(): void {
    this.managerContactos.loadContactos()
    this.managerEntidades.loadEntidades()
  }
  saveContact(event: any) {

    if (event.action === 'create') {

      this.managerContactos.createConcatos(event.values);

    } else if (event.action === 'edit') {

      if (!this.selectedContacto?.id) return;

      this.managerContactos.updateContacto(
        this.selectedContacto.id,
        event.values
      );

      this.selectedContacto = null;
    }
  }

  filteredContactos = computed(() => {

  const term = this.textFilter().toLowerCase().trim();
  const contactos = this.contactos(); 
  // 👆 asumiendo que en el manager tienes un signal contactos()

  if (!term) return contactos;

  return contactos.filter(contacto => 
    contacto.nombre?.toLowerCase().includes(term) ||
    contacto.email?.toLowerCase().includes(term) ||
    contacto.telefono?.toLowerCase().includes(term)
  );

});

  onSearch(value: any) {

  }

  eliminar(contacto: Contacto) {
     this.confirmationService.confirm({
    message: `¿Eliminar el contacto ${contacto.nombre}?`,
    header: 'Eliminar Contacto',
    icon: 'pi pi-exclamation-triangle',
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-text',

    accept: () => {
      this.managerContactos.deleteOne(contacto.id);
    }
  });
  }
  abrirCrear() {
    this.mode.set('create')
    this.selectedContacto = null;
    this.formRef()?.open();
  }
  openEdit(contacto: any) {
    this.mode.set('edit')
    this.selectedContacto = contacto
    this.formRef()?.open();
  }


  deleteContactos(selected: Contacto[]) {
    console.log("entra a la funcion", selected)
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar los ${selected.length} contactos seleccionados?`,
      header: 'Eliminar Contactos',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        const ids = selected
          .map(contacto => contacto.id)
          .filter((id): id is number => id !== undefined);

        this.managerContactos.deletes(ids);
        this.selectedContactos = [];
      }
    });

  }


}
