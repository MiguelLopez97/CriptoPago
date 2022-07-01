import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  public categorias: any[] = [];
  public categoriaSelected: any[] = [];
  public titleCategoriaSelected: string;
  public idCategoriaSelected: number;
  public publicaciones: any[] = [];
  public loading: boolean = true;
  public loadingInicial: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _productosService: ProductosService
  ) { 
    /* this._route.params.subscribe(params => {
      //Asignamos el idCategoria inicial tomado de la URL
      this.idCategoriaSelected = Number(params['idCategoria']);
    }); */
  }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias()
  {
    //Obtiene el idCategoria del parámetro de la URL
    this._route.params.subscribe(params => {
      //Asignamos el idCategoria inicial tomado de la URL
      this.idCategoriaSelected = Number(params['idCategoria']);

      //Obtiene las categorías del idTienda 141
      this._productosService.getCategoriasByTienda(141).subscribe(
        response => {
          console.log(response);
          this.categorias = response.data;

          //Filtra los registros en base al idCategoria que viene de la URL
          this.categoriaSelected = this.categorias.filter(result => result.idCategoria == params['idCategoria']);

          //El título seleccionado de la categoría será en base al registro filtrado
          this.titleCategoriaSelected = this.categoriaSelected[0].nombreMenu;

          //Obtiene las publicaciones por el idCategoría
          this.getPublicacionesPorCategorias(params['idCategoria']); 
        },
        error => {
          console.log(error);
        }
      );   
    });
  }

  getPublicacionesPorCategorias(pIdCategoria)
  {
    this.loading = true;

    this._productosService.getPublicacionesByEmpresaByCategoria(141, pIdCategoria).subscribe(
      response => {
        this.publicaciones = response.data;
        this.loading = false;
        this.loadingInicial = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        this.loadingInicial = false;
      }
    );
  }

  onChangeCategoria(event)
  {
    //let idCategoria = event[0]._value;
    let idCategoria = event;

    //Consulta las publicaciones en base al idCategoria seleccionado
    this.getPublicacionesPorCategorias(idCategoria);
    
    //Filtra los registros en base al idCategoria seleccionado
    this.categoriaSelected = this.categorias.filter((category) => category.idCategoria == idCategoria);
    
    //Obtiene el nombre de la categoría filtrada
    this.titleCategoriaSelected = this.categoriaSelected[0].nombreMenu;
  }

}
