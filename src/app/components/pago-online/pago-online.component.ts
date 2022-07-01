import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { CriptoService } from '../../services/cripto.service';
import { ProductosService } from '../../services/productos.service';
import { OrdenService } from '../../services/orden.service';
import { UsuarioService } from '../../services/usuario.service';
import { ProductoModel } from '../../models/producto.model';
import { ProductoAtributosModel } from '../../models/producto-atributos.model';
import { CrearPedidoModel } from '../../models/crear-pedido.model';
import { CrearOrdenModel } from '../../models/crear-orden.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-online',
  templateUrl: './pago-online.component.html',
  styleUrls: ['./pago-online.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class PagoOnlineComponent implements OnInit {

  public correoForm: FormGroup;
  public metodoPagoForm: FormGroup;

  public producto = new ProductoModel();
  public precioProducto: number;
  public productoAtributos: ProductoAtributosModel[] = [];

  public tipoDeCambioCoinBase: number;

  //Propiedad para determinar si el monto a pagar es mayor a $2,000 pesos
  public isMontoMayorDosMil: boolean;

  //Propiedades para el Pedido y Orden de Compra
  public pedido = new CrearPedidoModel();
  public ordenDeCompra = new CrearOrdenModel();

  //Propiedad para almacenar los atributos de un producto
  public addenda: any[] = [];

  //Arreglo temporal para almacenar los 'idTrx' que se generen después de crear el pedido
  public arrayIdTrxs = [];

  public idPedidoGenerado: string;

  public idUsuarioDesencriptado: string;

  public loading: boolean = true;

  //Steps Angular Material
  @ViewChild('stepper') stepper: MatStepper;  
  public isLinear = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private cripto: CriptoService,
    private _productosService: ProductosService,
    private _ordenService: OrdenService,
    private _usuarioService: UsuarioService
  ) { 
    this.buildForms();

    //Si el usuario tiene iniciada sesión, busca en el localStorage el campo 'idUsuario'
    if (localStorage.getItem('idUsuario') != undefined && localStorage.getItem('idUsuario'))
    {
      //Obtiene el idUsuario del localStorage y lo desencripta
      this.idUsuarioDesencriptado = this.cripto.decrypt(localStorage.getItem('idUsuario'));
    }

    //Si el usuario tiene iniciada sesión, busca en el localStorage el campo 'email'
    if (localStorage.getItem('email') != undefined && localStorage.getItem('email'))
    {
      this.correoForm.patchValue({
        correoElectronico: this.cripto.decrypt(localStorage.getItem('email'))
      });
    }
  }

  ngOnInit(): void {
    this.productoAtributos = JSON.parse(localStorage.getItem('datosProducto'));

    //Recorre y almacena en un arreglo los atributos que se recuperan del localStorage
    for (let item of this.productoAtributos)
    {
      let atributo = {atributo: item.atributo, valor: item.valor};
      this.addenda.push(atributo);


      if (item.idMascara == 6 && item.valor >= 2000)
      {
        this.isMontoMayorDosMil = true;
      }
      else
      {
        this.isMontoMayorDosMil = false;
      }
    }

    this.getProducto();
  }

  buildForms()
  {
    //Formulario 1 - Dirección de correo electrónico
    this.correoForm = this._formBuilder.group({
      correoElectronico: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      terminos: ['', Validators.required]
    });

    //Formulario 2 - Método de Pago
    this.metodoPagoForm = this._formBuilder.group({
      criptoMoneda: ['USDT', Validators.required]
    });
  }

  async getProducto()
  {
    this._route.params.subscribe(async params => {
      let idProducto = params['idProducto'];
      let idPrecio: number = Number(localStorage.getItem('idProductoPrecio'));

      //1. Obtiene información del producto
      await this._productosService.getProducto(idProducto).toPromise()
      .then(
        response => {
          this.producto = response.data;
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      );

      //2. Obtiene el precio seleccionado del producto
      //Si el idPrecio es un número (consulta al endpoint 'getProductoPrecio')
      if (!isNaN(idPrecio))
      {
        await this._productosService.getProductoPrecio(localStorage.getItem('idProductoPrecio')).toPromise()
        .then(
          response => {
            //Asignamos el precio que venga de la respuesta del endpoint 'getProductoPrecio'
            this.precioProducto = response.data.precio;
          }
        )
        .catch(
          error => {
            console.log(error);
          }
        );
      }
    
      //3. Consulta el Tipo de Cambio y realiza el cálculo del 'montoTotal' en MXN y Cripto
      this.getTipoDeCambioCoinBase();

      //4. Determina si el monto a pagar es mayor a $2,000 pesos
      this.validaMontoMayorDosMil();

      this.loading = false;
    });
  }

  getTipoDeCambioCoinBase()
  {
    this._ordenService.getExchangeRateCoinBase('USDT', 2).subscribe(
      response => {
        console.log(response);
        this.tipoDeCambioCoinBase = response.data;

        //Llamamos al método para calcular el monto total en MXN y Cripto
        this.calculateMontoTotal();
      },
      error => {
        console.log(error);
      }
    );
  }

  validaMontoMayorDosMil()
  {
    //Recorremos todos los atributos del producto
    for (let item of this.productoAtributos)
    {
      //Si el precio del producto o el valor del idMascara 6 sea igual o mayor a $2,000 Y no haya sesión iniciada
      if ((this.precioProducto >= 2000 || (item.idMascara == 6 && item.valor >= 2000)) && this.idUsuarioDesencriptado == undefined)
      {
        this.isMontoMayorDosMil = true;
      }
      else
      {
        this.isMontoMayorDosMil = false;
      }
    }
  }

  calculateMontoTotal()
  {
    //Si el precioProducto existe o no está vacío
    if (!isNaN(this.precioProducto))
    {
      //El precio será el que se haya elegido previo al formulario de Pago
      this.pedido.montoTotalMX = this.precioProducto;
      this.ordenDeCompra.montoMX = this.precioProducto;

      //Calculamos el montoTotalCripto dividiendo tipoDeCambio entre precioProducto (MXN)
      let montoTotalCripto = this.precioProducto / this.tipoDeCambioCoinBase;
      this.pedido.montoTotalCripto = Number(montoTotalCripto.toFixed(2)); //Limita a dos decimales
      this.ordenDeCompra.precioCripto = Number(montoTotalCripto.toFixed(2));
      this.ordenDeCompra.montoCripto = Number(montoTotalCripto.toFixed(2));
    }
    else
    {
      //Recorremos los atributos del producto
      for (let item of this.productoAtributos)
      {
        //Si el 'idMascara' es igual a 6 (Monto Moneda)
        if (item.idMascara == 6)
        {
          //Asignamos el valor que se haya ingresado en 'Monto Personalizado'
          this.pedido.montoTotalMX = item.valor;
          this.ordenDeCompra.montoMX = item.valor;

          //Calculamos el montoTotalCripto dividiendo 'tipoDeCambio' entre el valor ingresado en 'Monto Personalizado' (MXN)
          let montoTotalCripto = item.valor / this.tipoDeCambioCoinBase;
          this.pedido.montoTotalCripto = Number(montoTotalCripto.toFixed(2)); //Limita a dos decimales
          this.ordenDeCompra.precioCripto = Number(montoTotalCripto.toFixed(2));
          this.ordenDeCompra.montoCripto = Number(montoTotalCripto.toFixed(2));
        }
      }
    }
  }

  get correoNoValido() {
    return this.correoForm.get('correoElectronico').invalid && this.correoForm.get('correoElectronico').touched && this.correoForm.get('correoElectronico').hasError('required');
  }

  get formatoCorreoNoValido() {
    return !this.correoForm.get('correoElectronico').hasError('required') && this.correoForm.get('correoElectronico').hasError('pattern');
  }

  get terminosNoValido() {
    return this.correoForm.get('terminos').invalid && this.correoForm.get('terminos').touched;
  }

  validateCorreo()
  {
    if(this.correoForm.invalid) {
      Object.values(this.correoForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    //Continua al siguiente paso de Angular Stepper
    this.stepper.next();
  }

  validateMetodoPago()
  {
    if(this.metodoPagoForm.invalid) {
      Object.values(this.metodoPagoForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    //Continua al siguiente paso de Angular Stepper
    this.stepper.next();
  }

  async generatePedidoOrden()
  {
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Generando orden de compra',
      text: 'Un momento por favor'
    });
    Swal.showLoading();
 
    //Si el 'idUsuarioDesencriptado' es null o undefined (o no hay idUsuario en el localStorage)
    if (this.idUsuarioDesencriptado == undefined)
    {
      //Asigna por defecto el idComprador '391'
      this.pedido.idComprador = 391;
      this.ordenDeCompra.idComprador = 391;

      //Crea el arreglo 'idTrx' para almacenar los 'idTrx' que se generen al crear el Pedido para el control de mostrar las notificaciones
      if (localStorage.getItem('idTrx') == undefined)
      {
        localStorage.setItem('idTrx', JSON.stringify(this.arrayIdTrxs));
      }
      
    }
    else //Si hay 'idUsuarioDesencriptado'
    {
      //Asigna el 'idUsuarioDesencriptado' al 'idComprador'
      this.pedido.idComprador = Number(this.idUsuarioDesencriptado);
      this.ordenDeCompra.idComprador = Number(this.idUsuarioDesencriptado);
    }

    //Datos a enviar para crear el Pedido 
    this.pedido.idDomicilioEnvio = 0;
    this.pedido.idMonedaBase = 1;
    this.pedido.idMonedaDestino = 2;
    this.pedido.correoInvitado = this.correoForm.get('correoElectronico').value;

    //Datos a enviar para crear la Orden
    this.ordenDeCompra.idEmpresa = 141;
    this.ordenDeCompra.idVendedor = 388;
    this.ordenDeCompra.idDomicilioEnvio = 0;
    this.ordenDeCompra.idMonedaBase = 1;
    this.ordenDeCompra.monedaBase = 'MX';
    this.ordenDeCompra.idMonedaDestino = 2;
    this.ordenDeCompra.monedaDestino = 'USDT';
    this.ordenDeCompra.tipoDeCambio = this.tipoDeCambioCoinBase;
    this.ordenDeCompra.cantidad = 1;
    this.ordenDeCompra.idProducto = this.producto.idProducto;
    this.ordenDeCompra.producto = this.producto.nombreProducto;
    this.ordenDeCompra.costoDeEnvio = 0;
    this.ordenDeCompra.porcentajeComision = 0;
    this.ordenDeCompra.addenda = JSON.stringify(this.addenda);


    //1. Crea el Pedido
    await this._ordenService.createPedido(this.pedido).toPromise()
    .then(
      response => {
        console.log(response);
        //Asignamos el idPedido resultante al objeto 'ordenDeCompra'
        this.ordenDeCompra.idPedido = response.data.idPedido;

        if (this.idUsuarioDesencriptado == undefined)
        {
          //Obtenemos el arreglo 'idTrx' del localStorage y lo parseamos
          this.arrayIdTrxs = JSON.parse(localStorage.getItem('idTrx'));
          
          //Agregamos el 'idTrx' que devuelva el 'response.data' al arreglo 'arrayIdTrxs'
          this.arrayIdTrxs.push(response.data.idTrx);

          //Volvemos a almacenar el arreglo 'arrayIdTrxs' en el localStorage
          localStorage.setItem('idTrx', JSON.stringify(this.arrayIdTrxs));
        }

        //Encriptamos el idPedido que devuelva el 'response' para mandarlo por URL a la siguiente pantalla
        this.idPedidoGenerado = this.cripto.encrypt(response.data.idPedido);
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    );

    //2. Crea la Orden de Compra
    await this._ordenService.createOrden(this.ordenDeCompra).toPromise()
    .then(
      response => {
        console.log(response);
        if (response.success == true)
        {
          Swal.fire({
            icon: 'success',
            title: 'Orden de compra generada correctamente',
            confirmButtonText: 'Aceptar'
          });

          this._router.navigate(['/orden-compra-generada', this.producto.idProducto, this.idPedidoGenerado]);
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al generar el pedido',
            text: 'Intenta más tarde',
            confirmButtonText: 'Aceptar'
          });
        }
      }
    )
    .catch(
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al generar el pedido',
          text: 'Intente más tarde',
          confirmButtonText: 'Aceptar'
        });

      }
    );
  }

  ngOnDestroy(): void 
  {
    //Eliminamos los datos del localStorage cuando el usuario cambie de pantalla
    localStorage.removeItem('datosProducto');
    localStorage.removeItem('idProductoPrecio');
  }

}
