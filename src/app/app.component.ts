import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'prueba';

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Mensaje de prueba al arrancar
    this.messageService.add({
      severity: 'success',
      summary: 'Test',
      detail: 'Toast funcionando',
      life: 3000
    });
  }
}
