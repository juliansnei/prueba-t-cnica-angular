import { computed, inject, Injectable, signal } from "@angular/core";
import { StateEntidad } from "./interfaces/state-entidad";
import { EntidadesService } from "./services/entidades.service";
import { Entidad } from "./interfaces/entidad";

@Injectable({providedIn:'root'})

//clase para gestionar la logica se comunica con el service y el componente 
export class EntidadManager {

  private entidadService = inject(EntidadesService)

    readonly   #state = signal<StateEntidad>({
        loading: true,
        entidades: []
      })

    entidades = computed(() => this.#state().entidades);
    loading = computed(() => this.#state().loading);

        /**Metodo para traer la data de las entidades
         * 
         */
  loadEntidades(){
        this.#state.set({ loading: false, entidades: [] }) 
        this.entidadService.getAll().subscribe({
          next: (resp) => {
            const entidades = resp.data;
            if (!entidades) return ;
              this.#state.set({
                loading: false,
                entidades: entidades,
              });
            },error:(err) => {
              console.error("error al traer entidades",err);
            }
          })      
  }
        /**MEtodo para guardar una entidad
         * @param entidad
         */
  public save(entidad:Entidad){
    this.#state.update(state => ({
      ...state,
      loading:true
    }))
    this.entidadService.save(entidad).subscribe({
      next: (resp) => {
        console.log("guardaando entidad")
        this.#state.update(state => ({
          ...state,
          loading:false,
          entidades: [...state.entidades,resp.data]
        }))
      }, error: (err) => {
        console.error("Error al crear entidad");
        this.#state.update(state => ({
          ...state,
          loading:false
        }))
      }
    })
  }
/**
 * Metodo que interactua con el servicio
 * para manejar logica de borrado de entidad
 * guarda nuevo estado en el signal
 * @param entidadId
*/
  public delete(entidadId:number){
    this.#state.update(state => ({
      ...state,
      loading:true
    }))
    this.entidadService.deleteEntidad(entidadId).subscribe({
      next: (resp) => {
        this.#state.update(state => ({
          ...state,
          loading:false,
          entidades:[...state.entidades.filter(ent => ent.id !== resp.data.id)]
        }))

      }, error: (err) => {
        console.error("Error al eliminar una entidad",err);
        this.#state.update(state => ({
          ...state,
          loading:false
        }))
      }
    })
  }
/**
 * Metodo que interactua con el servicio
 * para manejar logica de borrado de entidades
 * guarda nuevo estado en el signal
 * @param ids
 */
  deletes(ids:number[]){
        this.#state.update(state => ({
      ...state,
      loading:true
    }))
    console.log("ids recibidos",ids)
    this.entidadService.deletes(ids).subscribe({
      next: (resp) => {
        const idsDeletes = resp.data.ids_delete
        this.#state.update(state => ({
          ...state,
          loading:false,
          entidades:state.entidades.filter(ent =>  !idsDeletes.includes(ent.id))
        }))

      }, error: (err) => {
        console.error("Error al eliminar  entidades",err);
        this.#state.update(state => ({
          ...state,
          loading:false
        }))
      }
    })
  }

  /**
   * MEtodo para actualizar una entidad
   * @param ids
   * @param request
   */

  public update(id:number,request:any)
  {
    this.#state.update(state => ({
      ...state,
      loading:true
    }))
    this.entidadService.update(id,request).subscribe({
     next:(resp) => {
       const updated = resp.data
       console.log("actualizado", updated);
       this.#state.update(state => ({
        ...state,
        loading:false,
         entidades: state.entidades.map(ent =>
        ent.id === updated.id ? updated : ent
  )
       }))
     }, error: (err) => {
       this.#state.update(state => ({
        ...state,
        loading:false
       }))
     }
    })

  }

}