import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";
import { ConctactoResponse, Contacto } from "../interface/contacto.model";

@Injectable({ providedIn: 'root' })

export class ContactoService {

   private http = inject(HttpClient)
   private URL = `${environment.apiurl}/contactos`


   public getAll(): Observable<ConctactoResponse> {
      return this.http.get<ConctactoResponse>(`${this.URL}`)
   }

   crreteateConcatos(data: Contacto): Observable<any> {
      return this.http.post<any>(`${this.URL}`, data);
   }

   updateContacto(id: number, data: Contacto): Observable<any> {
      return this.http.put<any>(`${this.URL}/${id}`, data);
   }

   deletes(ids: number[]): Observable<any> {
      return this.http.post(`${this.URL}/delete`, { ids });
   }

   deleteContacto(id: number): Observable<any> {
      return this.http.delete(`${this.URL}/${id}`);
   }
}