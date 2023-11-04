

export interface Producto {
    nombre: string;
    precioNormal: number | null;
    foto: string;
    id: string;
    fecha: Date;
}

export interface Cliente {
    uid: string;
    nombre: string;
    email: string;
    edad: number | null;  
    celular: string;
    foto: string;
}