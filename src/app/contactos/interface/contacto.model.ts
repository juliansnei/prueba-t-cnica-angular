export interface Contacto {
    id:number,
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  notas?: string;
  entidad_id: number;
  fecha_nacimiento?: string;
  creado_por?: number;
}

export interface ConctactoResponse {
    status?:string,
    message?:string,
    data: Contacto[]
}

export interface StateConcatos {
    loading: boolean,
    contactos:Contacto[]
}