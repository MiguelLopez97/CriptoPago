export class PedidoModel {
  public idPedido: number;
  public idComprador: number;
  public fechaInicio: string;
  public idTrx: number;
  public isTrxConfirmed: boolean;
  public montoTotalMx: number;
  public montoTotalCripto: number;
  public idMonedaBase: number;
  public monedaBase: string;
  public idMonedaDestino: number;
  public monedaDestino: string;
  public address: string;
  public addressQR: string;
  public idDomicilioEnvio: number;
  public isPedidoCompleto: boolean;
  public correoInvitado: string;
  public ordenes: Ordenes[];

  /* public idOrden: number;
  public idEmpresa: number;
  public idVendedor: number;
  public cuentaUsuarioVendedor: string;
  public correoVendedor: string;
  public nombreVendedor: string;
  public apellidoPatVendedor: string;
  public apellidoMatVendedor: string;
  public idComprador: number;
  public cuentaUsuarioComprador: string;
  public correoComprador: string;
  public nombreComprador: string;
  public apellidoPatComprador: string;
  public apellidoMatComprador: string;
  public idDomicilioEnvio: number;
  public idDomicilioOrigen: number;
  public idProducto: number;
  public nombreProducto: string;
  public cantidad: number;
  public idMonedaBase: number;
  public monedaBase: string;
  public idMonedaDestino: number;
  public monedaDestino: string;
  public idTrx: number;
  public isTrxConfirmed: boolean;
  public address: string;
  public idEstatusOrden: number;
  public montoMx: number;
  public montoCripto: number;
  public descuento: number;
  public fechaInicio: string;
  public fechaFin: string;
  public precioUnitario: number;
  public descuentoUnitario: number;
  public addenda: string; */

  constructor() { }
  
}

export interface Ordenes {
  idOrden: number;
  idEmpresa: number;
  idVendedor: number;
  cuentaUsuarioVendedor: string;
  correoVendedor: string;
  nombreVendedor: string;
  apellidoPatVendedor: string;
  apellidoMatVendedor: string;
  idComprador: number;
  cuentaUsuarioComprador: string;
  correoComprador: string;
  nombreComprador: string;
  apellidoPatComprador: string;
  apellidoMatComprador: string,
  idDomicilioEnvio: number;
  idDomicilioOrigen: number;
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  idMonedaBase: number;
  monedaBase: string;
  idMonedaDestino: number,
  monedaDestino: string;
  idTrx: number;
  isTrxConfirmed: boolean;
  address: string;
  idEstatusOrden: number;
  montoMx: number;
  montoCripto: number;
  descuento: number;
  fechaInicio: string,
  fechaFin: any,
  precioUnitario: number;
  descuentoUnitario: number;
  addenda: string;
  uriImagen: string;
}