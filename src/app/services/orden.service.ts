import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Global } from './global';

import { CrearPedidoModel } from '../models/crear-pedido.model';
import { CrearOrdenModel } from '../models/crear-orden.model';

@Injectable({
  providedIn: 'root',
})
export class OrdenService {

  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ) { 
    this.apiUrl = Global.baseUrl;
  }

  getExchangeRateCoinBase(simboloCripto, idApp):Observable<any>
  {
    let params = '?currency=' + simboloCripto + '&idApp=' + idApp;
    return this._http.get(this.apiUrl + '/Orden/CriptoGateway/CoinBase' + params);
  }

  getAllPedidosUsuario(idUsuario):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Orden/Pedido/CriptoPago/All/' + idUsuario);
  }

  getPedido(idPedido):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Orden/Pedido/' + idPedido);
  }

  createPedido(pedido: CrearPedidoModel):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Orden/CrearPedido/criptoPago', pedido);
  }

  createOrden(orden: CrearOrdenModel):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Orden/CrearOrden/criptoPago', orden);
  }

  getNotificacionesKPI(idUsuario):Observable<any>
  {
    return this._http.get(this.apiUrl + '/Orden/NotificacionesKPI/' + idUsuario);
  }
  
  deleteNotificacion(idTrx):Observable<any>
  {
    return this._http.delete(this.apiUrl + '/Orden/Trx/' + idTrx);
  }

}