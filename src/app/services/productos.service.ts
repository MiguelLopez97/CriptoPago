import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Global } from './global';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {

  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ) { 
    this.apiUrl = Global.baseUrl;
  }

  getCategoriasByTienda(idEmpresa):Observable<any>
  {
    return this._http.get(this.apiUrl + '/productos/Categorias/' + idEmpresa);
  }

  getPublicacionesByEmpresaByCategoria(idEmpresa, idCategoria):Observable<any>
  {
    return this._http.get(this.apiUrl + '/productos/Publicaciones/' + idEmpresa + '/' + idCategoria);
  }

  getProducto(idProducto):Observable<any>
  {
    return this._http.get(this.apiUrl + '/productos/' + idProducto);
  }

  getProductoPrecioAll(idProducto):Observable<any>
  {
    return this._http.get(this.apiUrl + '/productos/ProductoPrecio/All/' + idProducto);
  }

  getProductoPrecio(idPrecio):Observable<any>
  {
    return this._http.get(this.apiUrl + '/productos/ProductoPrecio/' + idPrecio);
  }

  getProductoAtributosAll(idProducto):Observable<any>
  {
    return this._http.get(this.apiUrl + '/productos/ProductoAtributos/All/' + idProducto);
  }

}