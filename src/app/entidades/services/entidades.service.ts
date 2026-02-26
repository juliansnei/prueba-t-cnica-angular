import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StateEntidad } from '../interfaces/state-entidad';
import { Entidad, EntidadResponse } from '../interfaces/entidad';
import { delay, Observable, ObservedValueOf } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http = inject(HttpClient)


  url: string = `${environment.apiurl}/entidades`


  constructor() {
  }
  /**
   * metodo para retonar todas las entidades
   * @returns 
   */
  getAll():Observable<EntidadResponse>
  {
      return this.http.get<EntidadResponse>(`${this.url}`);
  }

/**
 * Metodo para eliminar una entidad
 * @param entidadId 
 * @returns 
 */
  deleteEntidad(entidadId:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/${entidadId}`)
  }
/**
 * Metodo para guardar una entidad
 * @param entidad 
 * @returns 
 */
  save(entidad: Entidad): Observable<any> {
    return this.http.post<any>(`${this.url}`,entidad);
  }

/**
 * Metodo para borra varias entidades
 * @param ids 
 * @returns 
 */
  deletes(ids:number[]):Observable<any>{
    return this.http.post<any>(`${this.url}/borrar`,{ids:ids})
  }

  /**
   * Metodo para editar una entidad
   * @param id
   * @param request
   *
   */
  public update(id:number,request:any):Observable<any>
  {
      return this.http.put<any>(`${this.url}/${id}`,request);

  }
}
