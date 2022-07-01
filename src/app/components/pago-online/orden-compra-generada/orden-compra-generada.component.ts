import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CriptoService } from '../../../services/cripto.service';
import { OrdenService } from '../../../services/orden.service';
import { ProductoModel } from '../../../models/producto.model';
import { PedidoModel } from '../../../models/pedido.model';

@Component({
  selector: 'app-orden-compra-generada',
  templateUrl: './orden-compra-generada.component.html',
  styleUrls: ['./orden-compra-generada.component.scss']
})
export class OrdenCompraGeneradaComponent implements OnInit {
  // Inputs donde se muestra la address y el monto a pagar
  @ViewChild('address', { static: false }) addressCopy: ElementRef;
  @ViewChild('amount', { static: false }) amountCopy: ElementRef;

  public producto = new ProductoModel();

  public pedido = new PedidoModel();

  public loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private cripto: CriptoService,
    private _ordenService: OrdenService
  ) { }

  ngOnInit(): void {
    this.getPedido();
  }

  getPedido()
  {
    this._route.params.subscribe(params => {
      //Desencriptamos el idPedido que viene de la URL para consultar los datos del Pedido
      let idPedido = this.cripto.decrypt(params['idPedido']);

      //Obtiene los datos del Pedido y sus órdenes correspondientes
      this._ordenService.getPedido(idPedido).subscribe(
        response => {
          console.log(response);
          this.pedido = response.data;
          this.pedido.ordenes[0].addenda = JSON.parse(this.pedido.ordenes[0].addenda);
          this.loading = false;
        },
        error => {
          console.log(error);
          this.loading = false;
        }
      );
    });
  }

  copyAmount()
  {
    // Copia el valor que se encuentre en el input al portapapeles
    this.amountCopy.nativeElement.select();
    document.execCommand('copy');

    this._snackBar.open('Cantidad copiada', 'Aceptar', {
      duration: 3000,
    });
  }

  copyAddress()
  {
    // Copia el valor que se encuentre en el input al portapapeles
    this.addressCopy.nativeElement.select();
    document.execCommand('copy');
    
    this._snackBar.open('Address copiada', 'Aceptar', {
      duration: 3000,
    });
  }

}
