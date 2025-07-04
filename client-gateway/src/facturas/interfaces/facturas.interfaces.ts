export interface Factura {
  id: string;
  numero: number;
  fecha: string;
  total: number;
  cliente: string; // ID de usuario
  items: any[];
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

export interface FacturaConUsuario extends Factura {
  usuario: Usuario;
}