export interface Entidad {
    id:         number;
    nombre:     string;
    nit:        string;
    direccion:  string;
    telefono:   string;
    email:      string;
    updated_at?: Date;
    created_at?: Date;
}

export interface EntidadResponse {
    status?: string,
    message?:string,
    data?:Entidad[]
}


