import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../../services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.scss']
})
export class PreguntasFrecuentesComponent implements OnInit {

  public panelOpenState = false;

  public faqForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
  }

  get correoContactoNoValido() {
    return this.faqForm.get('correoContacto').hasError('required');
  }

  get mensajeNoValido() {
    return this.faqForm.get('mensaje').hasError('required');
  }

  buildForm()
  {
    this.faqForm = this._formBuilder.group({
      correoContacto: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  sendCorreoFAQ()
  {
    if (this.faqForm.invalid) {
      Object.values(this.faqForm.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }
    
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Enviando pregunta',
      text: 'Un momento por favor'
    });
    Swal.showLoading();

    this._usuarioService.sendCorreoFAQ(this.faqForm.value.correoContacto, this.faqForm.value.mensaje).subscribe(
      response => {
        console.log(response);
        if (response.success == true)
        {
          Swal.fire({
            icon: 'success',
            title: 'Pregunta enviada correctamente',
            text: 'Le daremos atención a tu pregunta lo más pronto posible',
            confirmButtonText: 'Aceptar'
          });
          this.faqForm.reset();
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar la pregunta',
            text: 'Por favor, intente más tarde',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar la pregunta',
          text: 'Por favor, intente más tarde',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

}
