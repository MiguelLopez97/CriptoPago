import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../../services/usuario.service';
import { CriptoService } from '../../../services/cripto.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { AvatarUsuarioModel } from '../../../models/avatar-usuario.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef; //Propiedad para acceder al Input File

  public idUsuarioDesencriptado: string;
  public usuario = new UsuarioModel();
  public imgUri: string;
  public avatarUsuario = new AvatarUsuarioModel();
  public archivoExtraidoDeInput: File;

  public userForm: FormGroup;
  public changePassForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private cripto: CriptoService
  ) { 
    this.buildForms();
    this.idUsuarioDesencriptado = this.cripto.decrypt(localStorage.getItem('idUsuario'))
  }

  ngOnInit(): void {
    this.getUsuario();
  }

  get nombreNoValido() {
    return this.userForm.get('nombre').hasError('required');
  }

  get apPaternoNoValido() {
    return this.userForm.get('apPaterno').hasError('required');
  }

  get correoNoValido() {
    return this.userForm.get('correoElectronico').hasError('required');
  }

  buildForms()
  {
    this.userForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      apPaterno: ['', Validators.required],
      apMaterno: ['',],
      correoElectronico: ['', Validators.required]
    });

    this.changePassForm = this._formBuilder.group({
      nuevaPass1: ['', Validators.required],
      nuevaPass2: ['', Validators.required]
    }, 
    {
      validators: [this.passwordIguales('nuevaPass1', 'nuevaPass2')]
    });
  }

  getUsuario()
  {
    this._usuarioService.getUsuario(this.idUsuarioDesencriptado).subscribe(
      response => {
        console.log(response);
        this.usuario = response.data;
        this.usuario.nombre = response.data.nombreUsuario;
        this.cargarDataAlFormulario();
      },
      error => {
        console.log(error);
      }
    );
  }

  cargarDataAlFormulario() 
  {
    this.userForm.patchValue({
      nombre: this.usuario.nombre,
      apPaterno: this.usuario.apellidoPat,
      apMaterno: this.usuario.apellidoMat,
      correoElectronico: this.usuario.correoElectronico
    });
  }

  //Muestra una previsualizacion de la imagen seleccionada localmente del input file
  onChangeFile(event)
  {
    if (event.target.files && event.target.files[0])
    {
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.imgUri = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }

    this.archivoExtraidoDeInput = this.fileInput.nativeElement.files[0];
  }

  uploadAvatarUsuario()
  {
    let file;

    //Constante de tipo FileReader para leer la información de los archivos seleccionados
    const reader = new FileReader();

    //Separa el nombre del archivo y la extensión y los almacena en un arreglo
    const split = this.archivoExtraidoDeInput.name.split('.');

    //Obtiene la extensión de un archivo de la constante 'split'
    const ext = split[split.length - 1];

    //Obtiene el nombre de un archivo sin la extensión
    const simpleName = this.archivoExtraidoDeInput.name.substr(0, this.archivoExtraidoDeInput.name.length - (ext.length + 1));

    //Se iguala la variable 'file' al archivo que se haya seleccionado desde el componente
    file = this.archivoExtraidoDeInput;

    //Lee la información de la variable 'file'
    reader.readAsDataURL(file);

    reader.onload = () => {
      //Asigna los valores a enviar a la API
      this.avatarUsuario.idUsuario = Number(this.idUsuarioDesencriptado);
      this.avatarUsuario.fileContentBase64 = reader.result.toString().split(',')[1];
      this.avatarUsuario.fileName = simpleName;
      this.avatarUsuario.fileExt = ext;

      Swal.fire({
        allowOutsideClick: false,
        icon:'info',
        title: 'Espere',
        text: 'Guardando archivo'
      });
      Swal.showLoading();

      this._usuarioService.saveAvatar(this.avatarUsuario).subscribe(
        response => {
          console.log(response);
          if (response.success == true)
          {
            Swal.fire({
              icon: 'success',
              title: 'Archivo cargado correctamente',
              confirmButtonText: 'Aceptar',
            });
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: 'Error al cargar el archivo',
              text: response.errors[0].message,
              confirmButtonText: 'Aceptar',
            });
          }
        },
        error => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error al cargar el archivo',
            text: error.error.message,
            confirmButtonText: 'Aceptar',
          });
        }
      );
    };
  }

  updateUsuario()
  {
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Guardando información',
    });
    Swal.showLoading();

    //Datos a enviar a la API
    this.usuario.cuentaDeUsuario = this.userForm.get('correoElectronico').value;
    this.usuario.nombre =  this.userForm.get('nombre').value;
    this.usuario.aPaterno = this.userForm.get('apPaterno').value;
    this.usuario.aMaterno = this.userForm.get('apMaterno').value;
    this.usuario.correoElectronico = this.userForm.get('correoElectronico').value;

    this._usuarioService.updateUsuario(this.usuario).subscribe(
      response => {
        console.log(response);
        if (response.success == true)
        {
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados correctamente',
            confirmButtonText: 'Aceptar',
          });
          localStorage.setItem('fullName', this.cripto.encrypt(response.data.nombreCompleto));
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: error.error.message,
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }

  changePassword()
  {
    if (this.changePassForm.invalid) {
      Object.values(this.changePassForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Actualizando contraseña'
    });
    Swal.showLoading();

    this._usuarioService.updateContrasenia(this.idUsuarioDesencriptado, this.changePassForm.value.nuevaPass1, this.changePassForm.value.nuevaPass2).subscribe(
      response => {
        console.log(response);
        if (response.success == true)
        {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada correctamente',
            confirmButtonText: 'Aceptar',
          });
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la contraseña',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar la contraseña',
          text: error.error.message,
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }

  //Validaciones para el formulario de 'Cambiar Contraseña'
  get pass1NoValido() 
  {
    return this.changePassForm.get('nuevaPass1').invalid && this.changePassForm.get('nuevaPass1').touched;
  }

  get pass2NoValido() 
  {
    return this.changePassForm.get('nuevaPass2').invalid && this.changePassForm.get('nuevaPass2').touched;
  }  

  get pass2NoCoincide() 
  {
    const pass1 = this.changePassForm.get('nuevaPass1').value;
    const pass2 = this.changePassForm.get('nuevaPass2').value;
    return ( pass2 === pass1 ) ? false : true;
  }

  //Valida que la nueva contraseña y la contraseña que se repite son iguales
  passwordIguales(pass1Name, pass2Name)
  {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];
      
      if(pass1Control.value == pass2Control.value)
      {
        pass2Control.setErrors(null);
      }
      else
      {
        pass2Control.setErrors({noEsIgual: true});
      }  
    }
  }
}
