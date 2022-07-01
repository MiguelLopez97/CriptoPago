export class ProductoAtributosModel {
  public idProductoAtributo: number;
  public idProducto: number;
  public idMascara: number;
  public longitud: number;
  public atributo: string;
  public descripcion: string;
  public valor: any; //Propiedad sólo para mantener el valor de un atributo
  public pattern: any; //Propiedad para almacenar validaciones en expresiones regulares
  public inputType: any; //Propiedad para determinar el tipo de Input
  public titleValidation: any; //Propiedad para mostrar los mensajes de error cuando no se cumpla con el 'pattern'
  
  constructor() { }
}

    