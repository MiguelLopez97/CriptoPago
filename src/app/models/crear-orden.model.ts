export class CrearOrdenModel {
  public idPedido: number;
  public idEmpresa: number;
  public idComprador: number;
  public idVendedor: number;
  public idDomicilioEnvio: number;
  public idMonedaBase: number;
  public monedaBase: string;
  public idMonedaDestino: number;
  public monedaDestino: string;
  public tipoDeCambio: number;
  public cantidad: number;
  public idProducto: number;
  public producto: string;
  public montoMX: number;
  public montoCripto: number;
  public precioCripto: number;
  public costoDeEnvio: number;
  public porcentajeComision: number;
  public vendedor: string;
  public comprador: string;
  public addenda: string;
  
  constructor() { }
}