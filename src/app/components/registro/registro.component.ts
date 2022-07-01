import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { UsuarioService } from '../../services/usuario.service';
import { CriptoService } from '../../services/cripto.service';
import { PaisesService } from '../../services/paises.service';
import { UsuarioModel } from '../../models/usuario.model';
import { ValidatorPais as ValidatorPais } from './validatorPais';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  //Formulario reactivo para registrarse
  public registerForm: FormGroup;

  public usuarioComprador = new UsuarioModel();

  public paises: any[] = [];

  public filteredOptions: Observable<any[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private cripto: CriptoService,
    private _paisesService: PaisesService
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
    this.getAllPaises();
  }  

  get nombreNoValido() {
    return this.registerForm.get('nombre').hasError('required');
  }

  get apPaternoNoValido() {
    return this.registerForm.get('apPaterno').hasError('required');
  }

  get correoNoValido() {
    return this.registerForm.get('correoElectronico').hasError('required');
  }

  get telefonoNoValido() {
    return this.registerForm.get('celular').hasError('required');
  }

  get ciudadNoValido() {
    return this.registerForm.get('ciudad').hasError('required');
  }

  get paisNoValido() {
    return this.registerForm.get('pais').hasError('required');
  }

  get paisNoSeleccionado() {
    return this.registerForm.get('pais').hasError('incorrect') && !this.registerForm.get('pais').hasError('required');
  }

  get terminosNoValido() {
    return this.registerForm.get('terminos').invalid && this.registerForm.get('terminos').touched;
  }

  buildForm()
  {
    this.registerForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      apPaterno: ['', Validators.required],
      apMaterno: ['',],
      correoElectronico: ['', Validators.required],
      celular: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', [Validators.required, ValidatorPais]],
      terminos: ['', Validators.required]
    });
  }

  getAllPaises()
  {
    this._paisesService.getAllPaises().subscribe(
      response => {
        console.log(response);
        this.paises = response;

        //Asigna los datos iniciales de todos los países a la propiedad 'filteredOptions'
        this.filteredOptions = this.registerForm.get('pais').valueChanges.pipe(
          startWith(''),
          map(value => typeof(value) == 'object' ? this._filter(value.name) : this._filter(value))
        );
      },
      error => {
        console.log(error);
      }
    );
  }

  //Método para filtrar un país
  private _filter(value){
    const filterValue = value.toLowerCase();

    return this.paises.filter(option =>  option.name.toLowerCase().includes(filterValue));
  }

  //Muestra el pais seleccionado en el input
  displayWith(pais?: any): string | undefined 
  {
    return pais ? pais.name : undefined;
  }

  registerUser()
  {
    if (this.registerForm.invalid) {
      Object.values(this.registerForm.controls).forEach( control => {
        control.markAsTouched();
      });
      console.log(this.registerForm);
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Creando registro',
    });
    Swal.showLoading();

    //Datos a enviar a la API
    this.usuarioComprador.cuentaDeUsuario = this.registerForm.get('correoElectronico').value;
    this.usuarioComprador.nombre =  this.registerForm.get('nombre').value;
    this.usuarioComprador.apellidoPat = this.registerForm.get('apPaterno').value;
    this.usuarioComprador.apellidoMat = this.registerForm.get('apMaterno').value;
    this.usuarioComprador.correoElectronico = this.registerForm.get('correoElectronico').value;
    this.usuarioComprador.ciudad = this.registerForm.get('ciudad').value;
    this.usuarioComprador.pais = this.registerForm.get('pais').value['name'];
    this.usuarioComprador.celular = this.registerForm.get('celular').value;

    this._usuarioService.createUsuarioComprador(this.usuarioComprador).subscribe(
      response => {
        console.log(response);
        if (response.success == true)
        {
          Swal.close();
          //Mandamos como parámetro el email encriptado que hayan puesto en el formulario
          //(Para consultarlo en la siguiente pantalla si es que desean reenviar correo)
          this._router.navigate(['/registro-exitoso', this.cripto.encrypt(this.usuarioComprador.correoElectronico)]);
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar el usuario',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar el usuario',
          text: error.error.message,
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }

}
