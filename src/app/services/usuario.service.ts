import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Global } from './global';

import { UsuarioModel } from '../models/usuario.model';
import { AvatarUsuarioModel } from '../models/avatar-usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  public apiUrl: string;

  constructor(
    private _http: HttpClient
  ) { 
    this.apiUrl = Global.baseUrl;
  }

  getUsuario(idUsuario):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.get(this.apiUrl + '/Usuario/' + idUsuario, { headers: headers });
  }

  createUsuarioComprador(usuario: UsuarioModel):Observable<any>
  {
    return this._http.post(this.apiUrl + '/Usuario/CompradorPagos', usuario);
  }

  updateUsuario(usuario: UsuarioModel):Observable<any>
  {
    const body = {
      ...usuario
    }
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.put(this.apiUrl + '/Usuario/Comprador', body, { headers: headers });
  }

  updateContrasenia(idUsuario, password, newPassword):Observable<any>
  {
    const body = {
      idUsuario: idUsuario,
      contrasenia: password,
      nuevaContrasenia: newPassword
    }
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.post(this.apiUrl + '/Usuario/ActualizarContrasenia', body, { headers: headers });
  }

  saveAvatar(file: AvatarUsuarioModel):Observable<any>
  {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this._http.post(this.apiUrl + '/Usuario/SaveAvatar', file, { headers: headers })
  }

  resendCorreo(email):Observable<any>
  {
    let params = '?cuenta=' + email;
    return this._http.get(this.apiUrl + '/Usuario/ReenviarCorreo/Pagos' + params);
  }

  resendCredenciales(email):Observable<any>
  {
    let params = '?cuenta=' + email;
    return this._http.get(this.apiUrl + '/Usuario/ReenviarCredenciales/Pagos' + params);
  }

  sendCorreoDeRecomendacion(emailDestino):Observable<any>
  {
    let param = emailDestino;
    return this._http.post(this.apiUrl + '/Usuario/EnviarCorreoDeRecomendacion?EmailDestino=' + param, null);
  }

  sendCorreoFAQ(correoContacto, mensaje):Observable<any>
  {
    let params = {
      correoContacto: correoContacto,
      texto: mensaje
    };

    return this._http.post(this.apiUrl + '/Usuario/EnviarCorreoFAQ', params);
  }

}
