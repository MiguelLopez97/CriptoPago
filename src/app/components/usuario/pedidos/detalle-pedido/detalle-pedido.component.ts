import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OrdenService } from '../../../../services/orden.service';
import { PedidoModel } from '../../../../models/pedido.model';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss']
})
export class DetallePedidoComponent implements OnInit {

  public pedido = new PedidoModel();

  public loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _ordenService: OrdenService
  ) { }

  ngOnInit(): void {
    this.getPedido();
  }

  getPedido()
  {
    this._route.params.subscribe(params => {
      let idPedido = params['idPedido'];

      this._ordenService.getPedido(idPedido).subscribe(
        response => {
          console.log(response);
          this.pedido = response.data;
          this.loading = false;
        },
        error => {
          console.log(error);
          this.loading = false;
        }
      );

    });
  }
}
