import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'entidades',
        loadComponent: ()=>import("./entidades/entidades.component"),
    },
       {
        path: 'contactos',
        loadComponent: ()=>import("./contactos/contactos/contactos.component").then(m => m.ContactosComponent),
    }
];
