import { computed, inject, Injectable, signal } from "@angular/core";
import { ContactoService } from "../services/contacto.service";
import { Contacto, StateConcatos } from "../interface/contacto.model";
import { Observable } from "rxjs";

@Injectable({providedIn:'root'})

export class ContactoManager {

    private conctactoService = inject(ContactoService);
    
    private state  = signal<StateConcatos>({loading:false,contactos:[]})


    contactosFull = computed(() => {
        return this.state().contactos
    })
    loading = computed(() =>{
        return this.state().loading
    } )


    loadContactos (){
        this.state.set({
            loading:true,
            contactos:[]
        })
        this.conctactoService.getAll().subscribe({
            next:(resp) =>{
                const newD = resp.data
                this.state.set({
                    loading:false,
                    contactos:newD
                })
            },error:(err) => {
                console.error("Error al cargar contactos",err);
                this.state.set({
                    loading:false
                    ,contactos:[]
                })
            }
        })
    }
    createConcatos(data:Contacto){
        this.state.update(state => ({
            ...state,
            loading:true
        }))

        this.conctactoService.crreteateConcatos(data).subscribe({
            next:(resp) => {

                this.state.update(state => ({
                    ...state,
                    loading:false,
                    contactos:[...state.contactos,resp.data]
                }));

            }, error:(err) => {
                console.error("error al crear contacto",err);
                this.state.update(state => ({
            ...state,
            loading:false
        }))
            }
        })
    }

    updateContacto(id: number, data: Contacto) {

  this.state.update(state => ({
    ...state,
    loading: true
  }));

  this.conctactoService.updateContacto(id, data).subscribe({

    next: (resp) => {

      const updatedContacto = resp.data;

      this.state.update(state => ({
        ...state,
        loading: false,
        contactos: state.contactos.map(contacto =>
          contacto.id === id ? updatedContacto : contacto
        )
      }));

    },

    error: (err) => {
      console.error("Error al actualizar contacto", err);

      this.state.update(state => ({
        ...state,
        loading: false
      }));
    }

  });

}

deletes(ids: number[]) {

  this.state.update(state => ({
    ...state,
    loading: true
  }));

  this.conctactoService.deletes(ids).subscribe({

    next: (resp) => {

      const idsDeletes = resp.data.ids_delete;

      this.state.update(state => ({
        ...state,
        loading: false,
        contactos: state.contactos.filter(c => !idsDeletes.includes(c.id))
      }));

    },

    error: (err) => {
      console.error("Error al eliminar contactos", err);

      this.state.update(state => ({
        ...state,
        loading: false
      }));
    }

  });
}

deleteOne(id: number){

  this.state.update(state => ({
    ...state,
    loading: true
  }));

  this.conctactoService.deleteContacto(id).subscribe({

    next: () => {

      this.state.update(state => ({
        ...state,
        loading: false,
        contactos: state.contactos.filter(c => c.id !== id)
      }));

    },

    error: (err) => {
      console.error("Error al eliminar contacto", err);

      this.state.update(state => ({
        ...state,
        loading: false
      }));
    }

  });
}
}