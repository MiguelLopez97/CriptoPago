import { Component, OnInit } from '@angular/core';

import { OrdenService } from '../../../services/orden.service';
import { CriptoService } from '../../../services/cripto.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  public idUsuarioDesencriptado: string;
  public loading: boolean = true;

  public pedidos: any[] = [];

  constructor(
    private _cripto: CriptoService,
    private _ordenService: OrdenService
  ) { 
    this.idUsuarioDesencriptado = this._cripto.decrypt(localStorage.getItem('idUsuario'));
  }

  ngOnInit(): void {
    this.getAllPedidosUsuario();
  }

  getAllPedidosUsuario()
  {
    this._ordenService.getAllPedidosUsuario(this.idUsuarioDesencriptado).subscribe(
      response => {
        this.pedidos = response.data;
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

}
