import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CriptoService } from '../../../services/cripto.service';
import { UsuarioService } from '../../../services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-exitoso',
  templateUrl: './registro-exitoso.component.html',
  styleUrls: ['./registro-exitoso.component.scss']
})
export class RegistroExitosoComponent implements OnInit {

  public correoElectronico: string;

  constructor(
    private _route: ActivatedRoute,
    private _usuarioService: UsuarioService,
    private cripto: CriptoService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      //Recibe el correo que llega de parámetro en la URL y lo desencripta
      this.correoElectronico = this.cripto.decrypt(params.email);
    });
  }

  resendCorreo()
  {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Reenviando correo',
    });
    Swal.showLoading();

    this._usuarioService.resendCorreo(this.correoElectronico).subscribe(
      response => {
        console.log(response);
        if (response.success == true)
        {
          Swal.fire({
            icon: 'success',
            title: 'Nuevo correo reenviado correctamente',
            text: 'Verifica en tu bandeja de entrada, en la carpeta Spam o Correo no deseado',
            confirmButtonText: 'Aceptar',
          });
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al reenviar correo',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al reenviar correo',
          text: error.error.message,
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }


}
