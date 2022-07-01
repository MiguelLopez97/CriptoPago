import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { CriptoService } from './cripto.service';
import { Global } from './global';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public apiUrl: string;
  public url: string; // Propiedad solamente para validar el Token de inicio de sesión
  public userToken: string; //Propiedad para guardar el Token

  constructor(
    private _http: HttpClient,
    private _cripto: CriptoService,
    private _router: Router
  ) { 
    this.apiUrl = Global.baseUrl;
    this.url = Global.url;
    this.leerToken();
    this.estaAutenticado(); //Borrar despues
  }

  login(correo: string, password: string) 
  {
    const datos = 'grant_type=password&username=' + correo + '&password=' + password;
    //const datos = 'grant_type=password&username=' + this._cripto.encrypt(correo) + '&password=' + this._cripto.encrypt(password);
        
    return this._http.post(this.url + '/Token', datos).pipe(map(
      response => {
        this.guardarToken(response['access_token'], response['expires_in']);
        
        localStorage.setItem('fullName', this._cripto.encrypt(response['fullName']));
        localStorage.setItem('idEmpresa', this._cripto.encrypt(response['idEmpresa']));
        localStorage.setItem('idUsuario', this._cripto.encrypt(response['idUsuario']));
        localStorage.setItem('email', this._cripto.encrypt(response['email']));

        return response;
      }
    ));
  }

  logout()
  {
    localStorage.removeItem('token'); //Borra el valor 'token' del localStorage
    localStorage.removeItem('fullName'); //Borra el valor 'fullName' del localStorage
    localStorage.removeItem('idEmpresa'); //Borra el valor 'idEmpresa' del localStorage
    localStorage.removeItem('idUsuario'); //Borra el valor 'idUsuario' del localStorage
    localStorage.removeItem('email'); //Borra el valor 'email' del localStorage
    localStorage.removeItem('expira'); //Borra el valor 'expira' del localStorage
  }

  //Método para guardar Token en el LocalStorage
  private guardarToken(idToken: string, expiraEn)
  {
    this.userToken = idToken; //userToken va a ser igual al parámetro que recibe este método
    localStorage.setItem('token', idToken); //En el localStorage se guarda un valor llamado key y su valor es el idToken

    let hoy = new Date(); //Variable que contiene la fecha actual
    hoy.setSeconds(expiraEn); //Agrega el tiempo de expiración que viene del 'response' a la fecha actual (Esto sería el tiempo de vida del Token)

    localStorage.setItem('expira', hoy.getTime().toString()); //Se agrega el tiempo de expiración al localStorage en formato string
  }

  //Método para leer el Token del LocalStorage
  leerToken() 
  {
    if (localStorage.getItem('token')) //Si el Token existe entonces
    {
      this.userToken = localStorage.getItem('token'); //Lee el valor de token en el localStorage y lo asigna a la propiedad userToken
    }
    else //Si el Token no existe
    {
      this.userToken = ''; //Se inicializa el userToken como vacío
    }
  
    return this.userToken;
  }
  
  //Método para saber si el usuario está autenticado y para retornar en el Guard
  estaAutenticado(): boolean 
  {
    if(this.userToken.length < 2)
    {
      return false;
    }

    const expira = Number(localStorage.getItem('expira')); //Constante que obtiene el valor 'expira' del localStorage y lo convierte a número
    const expiraDate = new Date(); //Constante con la fecha actual
    expiraDate.setTime(expira); //Se agrega la fecha de expiracion a la fecha actual
    const expiraEnUnMinuto = new Date(expiraDate.getTime() - 60000); //Restamos un minuto al tiempo de expiracion antes de que expire el token

    if(expiraDate > new Date()) //Si la fecha de expiracion no ha pasado de la fecha actual
    {
      return true;
    }
    else
    {
      this.logout();
      return false;
    }

    return this.userToken.length > 2; //Si el token es mayor a 2 caracteres
  }

}
