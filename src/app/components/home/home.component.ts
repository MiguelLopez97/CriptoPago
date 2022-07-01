import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductosService } from '../../services/productos.service';
import { UsuarioService } from '../../services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public correoRecomendacionForm: FormGroup;
  public hideForm: boolean = true;

  public categorias: any[] = [];

  /* public categoriasCards = [
    {icon: 'roofing', class: 'bg-teal-md', title: 'Pago de Servicios'},
    {icon: 'phone_android', class: 'bg-indigo-md', title: 'Tiempo Aire'},
    {icon: 'card_giftcard', class: 'bg-deep-purple-md', title: 'Tarjetas de Regalo'}
  ]; */

  public logosServicios = [
    {src: 'assets/img/logo_sky.png'},
    {src: 'assets/img/logo_cfe.jpg'},
    {src: 'assets/img/logo_telmex.png'},
    {src: 'assets/img/logo_telcel.png'},
    {src: 'assets/img/logo_netflix.png'},
    {src: 'assets/img/logo_disney.png'}
  ];

  public iconsSocialNetworks = [
    {
      title: 'Correo electrónico', 
      icon: 'email', 
      class: 'text-danger'
    },
    {
      title: 'WhatsApp', 
      icon: 'whatsapp', 
      class: 'text-success'
    }
  ];

  constructor( 
    private _formBuilder: FormBuilder,
    private _productosService: ProductosService,
    private _usuarioService: UsuarioService
  ) { 
    this.buildForm();
  }

  ngOnInit(): void { 
    this.getCategorias();
  }

  get correoNoValido() {
    return this.correoRecomendacionForm.get('correoElectronico').invalid && this.correoRecomendacionForm.get('correoElectronico').touched && this.correoRecomendacionForm.get('correoElectronico').hasError('required');
  }

  get formatoCorreoNoValido() {
    return !this.correoRecomendacionForm.get('correoElectronico').hasError('required') && this.correoRecomendacionForm.get('correoElectronico').hasError('pattern');
  }

  buildForm()
  {
    this.correoRecomendacionForm = this._formBuilder.group({
      //correoElectronico: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    });
  }

  getCategorias()
  {
    this._productosService.getCategoriasByTienda(141).subscribe(
      response => {
        console.log(response);
        this.categorias = response.data;
        
        //Ordena las categorías en base al 'idCategoria'
        //this.categorias = this.categorias.sort((a, b) => a - b);
        this.categorias = this.categorias.reverse();
      },
      error => {
        console.log(error);
      }
    );
  }

  actionButtonRecomendacion(medio)
  {
    if (medio == 'email') 
    {
      this.hideForm = false;
    }
    else if (medio == 'whatsapp')
    {
      window.open('https://wa.me/?text=%C2%A1Un+amigo+te+recomienda+visitar+criptoPago%21%0D%0AAhora+puedes+utilizar+tus+criptomonedas+para+pagar+tus+servicios%2C+recargas+de+tel%C3%A9fono%2C+tarjetas+de+regalo+y+%C2%A1mucho+m%C3%A1s%21+Usar+tus+criptomonedas+nunca+fue+tan+f%C3%A1cil+y+seguro.+Te+invitamos+a+que+visites+nuestro+sitio+web.+%0D%0Ahttp%3A%2F%2Fcriptopago.net', '_blank');
    }
  }

  sendCorreoRecomendacion()
  {
    if (this.correoRecomendacionForm.invalid) {
      Object.values(this.correoRecomendacionForm.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Enviando correo electrónico',
      text: 'Un momento por favor'
    });
    Swal.showLoading();

    const emailEncode = encodeURIComponent(this.correoRecomendacionForm.value.correoElectronico);
    this._usuarioService.sendCorreoDeRecomendacion(emailEncode).subscribe(
      response => {
        console.log(response);
        this.hideForm = true;
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado a ' + this.correoRecomendacionForm.value.correoElectronico,
          text: 'Agradecemos que nos recomiendes con tus conocidos',
          confirmButtonText: 'Aceptar'
        });
        this.correoRecomendacionForm.reset();
      },
      error => {
        console.log(error);
        this.hideForm = true;
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar el correo',
          text: error.error.message,
          confirmButtonText: 'Aceptar'
        });
        this.correoRecomendacionForm.reset();
      }
    );
  }

}
