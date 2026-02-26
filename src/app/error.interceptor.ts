import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
 const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'Ha ocurrido un error inesperado';
      console.log('INTERCEPTOR ATRAPÓ ERROR:', error); 
      
      if (error.status === 422) {
        const validationErrors = error.error.data;
        errorMsg = Object.values(validationErrors).flat().join(' | ');
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      }
      

      messageService.add({
        severity: 'error',
        summary: `Error ${error.status}`,
        detail: errorMsg,
        life: 1000
      });

      return throwError(() => error);
    })
  );
};
