import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cripto-servicios';
  public urlActual: string;
  public hideNavbar: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    //Escucha los eventos del Router
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // si el evento es una instancia de NavigationEnd, obtiene la ruta actual 
        this.urlActual = event.urlAfterRedirects;

        //Oculta el navbar cuando la pantalla sea Login, Registro, Recuperar Contraseña o Registro Exitoso
        if (this.urlActual == '/registro' || this.urlActual == '/login' || this.urlActual == '/recuperar-password' || this.urlActual.startsWith('/registro-exitoso'))
        {
          this.hideNavbar = true;
        }
        else
        {
          this.hideNavbar = false;
        }
      }
    })
  }
}
