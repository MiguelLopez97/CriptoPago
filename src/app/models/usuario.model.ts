export class UsuarioModel {
  public idUsuario: number;
  public cuentaDeUsuario: string;
  public nombre: string;
  public apellidoPat: string;
  public aPaterno: string;
  public apellidoMat: string;
  public aMaterno: string;
  public correoElectronico: string;
  public ciudad: string;
  public pais: string;
  public celular: string;
  public contrasenia: string;
  public idRol: number;
  public token: string;
  
  constructor() { }
}

export interface RolDeUsuario {
  idRol: number;
  descripcion: string;
}