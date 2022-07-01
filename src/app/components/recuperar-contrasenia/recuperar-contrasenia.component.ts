import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../../services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.scss']
})
export class RecuperarContraseniaComponent implements OnInit {

  public recoverPassForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
  }

  get correoNoValido() {
    return this.recoverPassForm.get('correoElectronico').hasError('required');
  }

  buildForm()
  {
    this.recoverPassForm = this._formBuilder.group({
      correoElectronico: ['', Validators.required]
    });
  }

  resendCredenciales()
  {
    if (this.recoverPassForm.invalid) {
      Object.values(this.recoverPassForm.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Restableciendo contraseña',
    });
    Swal.showLoading();

    this._usuarioService.resendCredenciales(this.recoverPassForm.value.correoElectronico).subscribe(
      response => {
        console.log(response);
        if (response.success == true)
        {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña restablecida correctamente',
            text: 'En breve te haremos llegar la nueva contraseña al correo electrónico proporcionado',
            confirmButtonText: 'Aceptar',
          });
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al reestablecer la contraseña',
            confirmButtonText: 'Aceptar',
          });
        }        
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al reestablecer la contraseña',
          text: error.error.message,
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }
}
