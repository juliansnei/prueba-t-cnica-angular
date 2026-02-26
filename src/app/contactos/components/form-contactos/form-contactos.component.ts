import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormModel } from '../../../shared/interfaces/form.model';

@Component({
  selector: 'app-form-contactos',
  standalone: true,
  imports: [DialogModule, CalendarModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './form-contactos.component.html',
  styleUrl: './form-contactos.component.css'
})
export class FormContactosComponent {
  private fb = inject(FormBuilder);

  mode = input<'create' | 'edit'>('create');
  item = input<any | null>(null);
  entidades = input<{ label: string; value: number }[]>([]);
  fields = input<FormModel[]>([])

  sendingData = output<{ values: any; action: 'create' | 'edit' }>();
  onClose = output<void>();

  visible = signal(false);

  open() { this.visible.set(true); }

  close() {
    this.visible.set(false);
    this.form.reset();
    this.onClose.emit();
  }


  header = computed(() => this.mode() === 'create' ? 'Nuevo Contacto' : 'Editar Contacto');
  buttonLabel = computed(() => this.mode() === 'create' ? 'Guardar' : 'Actualizar');

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.email]],
    telefono: [''],
    direccion: [''],
    notas: [''],
    entidad_id: [null as number | null],
    fecha_nacimiento: [null as Date | null],
  });


  constructor() {
    effect(() => {
      const entity = this.item();
      if (this.mode() === 'edit' && entity) {
        this.form.patchValue({
          ...entity,
          fecha_nacimiento: entity.fecha_nacimiento
            ? new Date(entity.fecha_nacimiento)
            : null,
        });
      }
      if (this.mode() === 'create') {
        this.form.reset();
      }
    }, { allowSignalWrites: true });
  }

   private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.value;

    const formattedValue = {
      ...rawValue,
      fecha_nacimiento: rawValue.fecha_nacimiento
        ? this.formatDate(rawValue.fecha_nacimiento)
        : null
    };
    this.sendingData.emit({
      values: formattedValue,
      action: this.mode(),
    });
    this.close();
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.invalid || !control.touched) return '';
    if (control.hasError('required')) return 'Campo obligatorio';
    if (control.hasError('email')) return 'Email no válido';
    if (control.hasError('maxlength')) return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    return 'Campo inválido';
  }

}
