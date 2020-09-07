export interface Usuario {
  id: number,
  fl_admin: number,
  nome: string;
  email: string;
  password?: string;
  fl_vendedor?: number;
  fl_usuario?: number;
  fl_ativo?: number;
}
