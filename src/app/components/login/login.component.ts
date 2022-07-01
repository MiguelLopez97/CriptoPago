import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //Formulario reactivo para iniciar sesión
  public loginForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
  }

  get correoNoValido() {
    return this.loginForm.get('correoElectronico').hasError('required');
  }

  get contraseniaNoValida() {
    return this.loginForm.get('contrasenia').hasError('required');
  }

  buildForm()
  {
    this.loginForm = this._formBuilder.group({
      correoElectronico: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });
  }

  login()
  {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }
    
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Iniciando sesión',
      text: 'Un momento por favor'
    });
    Swal.showLoading();

    this._authService.login(this.loginForm.value.correoElectronico, this.loginForm.value.contrasenia).subscribe(
      response => {
        console.log(response);           
        Swal.close();
        this._router.navigate(['/inicio']);
      },
      error => {
        console.log(error);
        if (error.status == 500 || error.status == 400)
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: 'Correo electrónico y/o contraseña no válidos',
            confirmButtonText: 'Aceptar'
          });
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: error.statusText,
            confirmButtonText: 'Aceptar'
          });
        }        
      }
    );
  }

}
