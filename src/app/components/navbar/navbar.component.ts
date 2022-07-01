import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../services/auth.service';
import { CriptoService } from '../../services/cripto.service';
import { ProductosService } from '../../services/productos.service';
import { OrdenService } from '../../services/orden.service';
import { PedidoModel } from '../../models/pedido.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public categorias: any[] = [];

  public usuarioLogueado: boolean;
  public fullNameUser: string;

  public datosPedido: any;
  public notificaciones: any[] = [];
  public notificacionesTemp: any[] = [];
  public idTrxs: any[] = [];
  public lengthNotificaciones: number = 0;

  //Inicializamos el contador de notificaciones en 0 para validar que el 'Aviso' no aparezca cada vez que se consulte el endpoint
  public contadorNotificaciones: number = 0;

  public loadingDataPedido: boolean;
  public pedido = new PedidoModel();

  constructor(
    private _router: Router,
    private toastr: ToastrService,
    private _authService: AuthService,
    private dialog: MatDialog,
    private _cripto: CriptoService,
    private _productosService: ProductosService,
    private _ordenService: OrdenService
  ) { }

  ngOnInit(): void {
    //Obtiene los datos del Pedido del localStorage
    this.datosPedido = JSON.parse(localStorage.getItem('datosPedido'));

    this.getCategorias();
    this.verifyLoggedUser();

    this.getNotificaciones();

    setInterval(() => {
      this.getNotificaciones(); 
    }, 18000);
  }

  getCategorias()
  {
    this._productosService.getCategoriasByTienda(141).subscribe(
      response => {
        this.categorias = response.data;
      },
      error => {
        console.log(error);
      }
    );
  }

  //Verifica si el usuario se ha logueado y si sus datos están en el localStorage
  verifyLoggedUser()
  {
    if (localStorage.getItem('fullName') !== undefined && localStorage.getItem('fullName'))
    {
      this.usuarioLogueado = true;
      this.fullNameUser = this._cripto.decrypt(localStorage.getItem('fullName'));
    }
    else
    {
      this.usuarioLogueado = false;
    }
  }

  getNotificaciones()
  {
    let idUsuario;

    //Si no hay usuario logueado
    if (!this.usuarioLogueado)
    {
      idUsuario = 391;
    }
    else //Si hay usuario logueado
    {
      //Desencripta el idUsuario del localStorage y consulta las notificaciones de ese Usuario
      idUsuario = this._cripto.decrypt(localStorage.getItem('idUsuario'));
    }    

    //Asignamos el número de elementos que tenga el arreglo 'this.notificaciones'
    this.lengthNotificaciones = this.notificaciones.length;
    //console.log("Longitud de las notificaciones -> ", this.lengthNotificaciones);

    this._ordenService.getNotificacionesKPI(idUsuario).subscribe(
      response => {
        //console.log(response);
        this.notificacionesTemp = response.data.notificacionesDePago;

        //console.log("NotificacionesTemp.length ->" , this.notificacionesTemp.length);

        //Si 'lengthNotificaciones' es igual al número de elementos del arreglo 'this.notificaciones'
        if (this.notificacionesTemp.length == this.lengthNotificaciones)
        {
          //No hacemos nada y retornamos
          return;
        }
        else //Si 'lengthNotificaciones' es diferente al número de elementos del arreglo 'this.notificaciones'
        {
          //console.log("Arreglo notificaciones (entra al else si no son iguales notifTemp y lengthNotif)  ->", this.notificaciones);

          if (!this.usuarioLogueado)
          {
            //Parseamos el arreglo de idTrxs del localStorage
            this.idTrxs = JSON.parse(localStorage.getItem('idTrx'));
            
            //Recorre todos los elementos que haya en el arreglo 'notificacionesTemp'
            for (let notificacion of this.notificacionesTemp)
            {
              //Igual recorremos el arreglo de 'idTrxs' obtenido del localStorage
              for (let idTrx of this.idTrxs)
              {
                //Si el idTrx almacenado en el localStorage es igual al idTrx que se encuentre en el arreglo 'notificacion'
                if (notificacion.idTrx == idTrx)
                {
                  //Incrementa el contador de las notificaciones
                  this.contadorNotificaciones++;

                  //Agregamos el elemento con el mismo 'idTrx' al arreglo 'notificaciones' para mostrarlo en el listado de notificaciones
                  this.notificaciones.push(this.notificacionesTemp.find(notif => notif.idTrx == idTrx));

                  //Muestra la alerta del pago del pedido
                  //let message = 'Pedido #' + this.notificacionesTemp[this.notificacionesTemp.length - 1].idPedido;
                  let message = 'Pedido #' + this.notificacionesTemp.find(notif => notif.idTrx == idTrx).idPedido;
                  this.toastr.success(message, '¡Tu pago fue aprobado!');

                  //Eliminamos el idTrx del localStorage para que no vuelva a mostrar el mensaje de 'Pago Aprobado'
                  var indexIdTrx;
                  indexIdTrx = this.idTrxs.findIndex(idx => idx == idTrx);
                  
                  this.idTrxs.splice(indexIdTrx, 1);

                  //Seteamos el nuevo valor del arreglo 'idTrxs' en el localStorage
                  localStorage.setItem('idTrx', JSON.stringify(this.idTrxs));
                }
              }
            }
          }
          else 
          {
            this.notificaciones = this.notificacionesTemp;

            if (this.notificacionesTemp.length != this.notificaciones.length)
            {
              //No hacemos nada y retornamos
              return;
            }
            else
            {
              //Incrementamos el valor del 'contadorNotificaciones' para mostrar la cantidad de notificaciones que hay disponibles
              this.contadorNotificaciones++;

              //Muestra la alerta del pago del pedido
              let message = 'Pedido #' + this.notificacionesTemp[this.notificacionesTemp.length - 1].idPedido;
              this.toastr.success(message, '¡Tu pago fue aprobado!');
            }
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //Verifica si hay algún cambio en el Navbar
  ngDoCheck(): void 
  {
    this.verifyLoggedUser();

    //Verifica si el token no ha pasado de la fecha de expiración, si pasa de la fecha actual borra los datos del LocalStorage
    this._authService.estaAutenticado();
  }

  //Abre el modal de los detalles de una notificación
  openDialogNotification(templateRef, idPedido, idTrx)
  {
    //Elimina la notificación inmediatamente que se abre el modal
    this._ordenService.deleteNotificacion(idTrx).subscribe(
      response => {
        //console.log(response);
        
        //Restamos 1 al 'lengthNotificaciones' para que cuando consulte las notificaciones, sea igual al número de elementos que devuelva la API
        this.lengthNotificaciones = this.lengthNotificaciones - 1;

        //Asignamos el 'lengthNotificaciones' a la longitud del arreglo 'notificaciones' para que el número de longitud coincidan entre ambos
        //this.notificaciones.length = this.lengthNotificaciones;
        this.notificacionesTemp.length = this.lengthNotificaciones;
        this.notificaciones.length = this.lengthNotificaciones;
      },
      error => {
        console.log(error);
      }
    );

    if (this.usuarioLogueado)
    {
      this._router.navigate(['/mis-pedidos/detalle', idPedido]);
    }
    else
    {
      this.loadingDataPedido = true;

      let dialogRef = this.dialog.open(templateRef, {
        width: '450px' 
      });

      //Obtiene el Pedido
      this._ordenService.getPedido(idPedido).subscribe(
        response => {
          console.log(response);
          this.pedido = response.data;
          this.pedido.ordenes[0].addenda = JSON.parse(this.pedido.ordenes[0].addenda);
          this.loadingDataPedido = false;
        },
        error => {
          this.loadingDataPedido = false;
        }
      );

      //Método después de cerrar el modal
      //dialogRef.afterClosed().subscribe(result => { });
    }
  }

  //Llamamos a este método para eliminar y reiniciar el número en el icono de notificaciones (badge)
  resetContadorNotificaciones()
  {
    this.contadorNotificaciones = 0;
  }
  
  logout()
  {
    this._authService.logout();
    this._router.navigate(['/inicio']);

    //Muestra la alerta de que la sesión ha sido finalizada
    let message = 'La sesión ha sido cerrada';
    this.toastr.info(message, 'Aviso');

    this.resetContadorNotificaciones();
    this.notificaciones = [];
  }

}
