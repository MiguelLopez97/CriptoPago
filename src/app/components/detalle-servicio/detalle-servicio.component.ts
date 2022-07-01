import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ProductosService } from '../../services/productos.service';
import { ProductoModel } from '../../models/producto.model';
import { ProductoAtributosModel } from '../../models/producto-atributos.model';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.scss']
})
export class DetalleServicioComponent implements OnInit {

  public producto = new ProductoModel();
  public productoPrecios: ProductoModel[] = [];
  public productoAtributos: ProductoAtributosModel[] = [];
  public permiteMontoPersonalizado: boolean;
  public isANumberPhone: boolean; //Determina si el atributo es 'Teléfono' para mostrar dos veces el campo Teléfono
  public loading: boolean = true;

  public idProductoPrecio: string; //Propiedad para almacenar el idProductoPrecio y mantenerlo en el localStorage
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private dialog: MatDialog,
    private _productosService: ProductosService
  ) { }

  ngOnInit(): void {
    this.getProducto();
  }

  async getProducto()
  {
    this._route.params.subscribe(async params => {
      let idProducto = params['idProducto'];
      
      //1. Obtiene información del producto
      await this._productosService.getProducto(idProducto).toPromise()
      .then(
        response => {
          console.log(response);
          this.producto = response.data;
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      );

      //2. Obtiene los precios asociados al producto
      await this._productosService.getProductoPrecioAll(idProducto).toPromise()
      .then(
        response => {
          console.log(response);
          this.productoPrecios = response.data;
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      );

      //3. Obtiene los atributos para el producto (Teléfono, Correo, Monto Moneda, etc.)
      await this._productosService.getProductoAtributosAll(idProducto).toPromise()
      .then(
        response => {
          console.log(response);
          this.productoAtributos = response.data;

          //Verifica si en los atributos viene el idMascara = 2 (Teléfono) para mostrar/ocultar el segundo input del Teléfono
          const verificarAtributoTelefono = this.productoAtributos.find(element => element.idMascara == 2);

          if (verificarAtributoTelefono == undefined)
          {
            this.isANumberPhone = false;
          }
          else
          {
            this.isANumberPhone = true;
            const repetirTelefono = {
              idProductoAtributo: 11,
              idProducto: Number(idProducto),
              idMascara: 2,
              longitud: 10,
              atributo: "Repetir número telefónico",
              descripcion: "Número de teléfono para la recarga",
              valor: "",
              pattern: "",
              inputType: "tel",
              titleValidation: "Los números de teléfono deben coincidir"
            };
            this.productoAtributos.unshift(repetirTelefono);
          }

          //Verifica si en los atributos del producto viene algun campo llamado 'Monto Personalizado'
          for (let producto of this.productoAtributos)
          {
            if (producto.atributo == 'Monto Personalizado' || producto.atributo == 'Monto personalizado')
            {
              this.permiteMontoPersonalizado = true;
              producto.valor = '0';
            }
            else
            {
              this.permiteMontoPersonalizado = false;
            }
            
            //Asignamos el input type y el pattern para cada tipo de idMascara
            switch(producto.idMascara) 
            { 
              case 1: {
                producto.pattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
                producto.inputType = 'email';
                producto.titleValidation = "El correo debe de contener este formato: ejemplo@ejemplo.com";
                break;
              }
              case 2: { 
                producto.pattern = "^[0-9]+";
                producto.inputType = 'tel';
                producto.titleValidation = "No es un número de teléfono válido"
                break;
              }
              case 3: { 
                producto.pattern = "";
                producto.inputType = 'text';
                producto.titleValidation = "Sólo se permite números y letras"
                break;
              }
              case 4: { 
                producto.pattern = "^[0-9]+";
                producto.inputType = 'tel';
                producto.titleValidation = "Sólo se permite números sin decimales";
                break;
              }
              case 5: { 
                producto.pattern = "^[+-]?([0-9]*[.])?[0-9]+$";
                producto.inputType = 'tel';
                producto.titleValidation = "No es un número válido";
                break;
              }
              case 6: { 
                //producto.pattern = "^[0-9]+(.[0-9]+)?$";
                producto.inputType = 'tel';
                producto.titleValidation = "Campo requerido";
                break;
              }
              case 7: { 
                producto.pattern = '';
                producto.inputType = 'text';
                producto.titleValidation = "No es un valor válido";
                break;
              }
              default: { 
                producto.pattern = '';
                producto.inputType = 'text';
                break; 
              } 
            } 
          }
          this.loading = false;
        }
      )
      .catch(
        error => {
          console.log(error);
          this.loading = false;
        }
      );
    });
  }

  //Abre el modal que contiene los campos adicionales al producto
  openDialogAtributos(templateRef)
  {
    if (this.productoAtributos.length > 0)
    {
      let dialogRef = this.dialog.open(templateRef, {
        width: '450px' 
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  //Valida los caracteres que se ingresen en los inputs de 'Atributos de un Producto'
  validaCaracteres(event, idMascara)
  {
    //idMascara 2 = Teléfono; idMascara 4 = Númerico Entero; idMascara 4 = Monto Moneda (NÚMEROS SIN DECIMALES)
    if (idMascara == 2 || idMascara == 4)
    {
      if (event.charCode >= 48 && event.charCode <= 57)
      {
        return true;
      }
      return false;
    }
    else if (idMascara == 5 || idMascara == 6)
    {
      if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46)
      {
        return true;
      }
      return false;
    }
  }

  //Cierra el modal que contiene los campos adicionales al producto
  closeDialog(templateRef)
  {
    let dialogRef = this.dialog.closeAll();
  }

  goToPago(form: NgForm)
  {
    console.log(form);
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    //Cierra el modal que contiene los campos adicionales al producto
    this.dialog.closeAll();

    //Almacenamos en el localStorage los atributos del producto y el idProductoPrecio
    localStorage.setItem('datosProducto', JSON.stringify(this.productoAtributos));
    localStorage.setItem('idProductoPrecio', JSON.stringify(this.idProductoPrecio));

    this._router.navigate(['/productos/pago-online', this.producto.idProducto]);
  }

}
