import { Component, computed, effect, EventEmitter, inject, input, Input, output, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-entidades-form',
  standalone: true,
  imports: [ButtonModule,DialogModule,ReactiveFormsModule],
  templateUrl: './entidades-form.component.html',
  styleUrl: './entidades-form.component.css'
})
export class EntidadesFormComponent 
{

  public constructor(){
    this.changeEffect()
  }
    mode = input<'create' | 'edit'>('create');
   item = input<any| null>(null)
   visible = input<boolean>(false);

   onClose = output<boolean>();
  sendingData = output<any>()



  onVisibleChange(value:boolean){

    this.onClose.emit(value);
  }

  private fb = inject(FormBuilder);

 buttonLabel = computed(() =>
  this.mode() === 'create' ? 'Crear' : 'Actualizar'
);


  entidadesForm = this.fb.group({
    nombre:['', [Validators.required, Validators.maxLength(15)]],
    nit:['', [Validators.required, Validators.minLength(2)]],
    telefono:[''],
    direccion:['']
  })
  initForm(){
    const fields : Record<string,any> = {};
    
  }
//emitir datos del formlario
  onSubmit(){
    if(this.entidadesForm.invalid){
     
      this.entidadesForm.markAllAsTouched()
      return;
    }
     const values = this.entidadesForm.value;
      this.sendingData.emit({
        values:values,
        action:this.mode()
      });
      this.entidadesForm.reset()
      
  }
  
  /** Effect para que se efecuta cada ves que cambie el item
   * 
   */
  changeEffect(){
    effect(() =>
    {
      const entity = this.item();
    
     if (this.mode() === 'edit' && entity) {
    this.entidadesForm.patchValue(entity);
  }

  if (this.mode() === 'create') {
    this.entidadesForm.reset();
  }
    })
  }
/**Metodo para devolver erroes */
  getError(field: string): string {
  const control = this.entidadesForm.get(field);
  if (!control || !control.invalid || !control.touched) return '';

  if (control.hasError('required')) return 'Este campo es obligatorio';
  if (control.hasError('maxlength')) return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
  if (control.hasError('minlength')) return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;

  return 'Campo inválido';
}


}
