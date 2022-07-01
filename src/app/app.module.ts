import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import localeMX from '@angular/common/locales/es-MX'; //Importa el local para cambiar la fecha a Español-México
registerLocaleData(localeMX, 'es-Mx'); //Registra el local con el nombre a utilizar a la hora de proveer, (es-Mx)

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { NgxCurrencyModule } from "ngx-currency";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Components
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { DetalleServicioComponent } from './components/detalle-servicio/detalle-servicio.component';
import { PagoOnlineComponent } from './components/pago-online/pago-online.component';
import { RecuperarContraseniaComponent } from './components/recuperar-contrasenia/recuperar-contrasenia.component';
import { RegistroExitosoComponent } from './components/registro/registro-exitoso/registro-exitoso.component';
import { OrdenCompraGeneradaComponent } from './components/pago-online/orden-compra-generada/orden-compra-generada.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { PedidosComponent } from './components/usuario/pedidos/pedidos.component';
import { DetallePedidoComponent } from './components/usuario/pedidos/detalle-pedido/detalle-pedido.component';
import { CalificarServicioComponent } from './components/calificar-servicio/calificar-servicio.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { PoliticasPrivacidadComponent } from './components/politicas-privacidad/politicas-privacidad.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    RegistroComponent,
    PerfilComponent,
    DetalleServicioComponent,
    PagoOnlineComponent,
    RecuperarContraseniaComponent,
    RegistroExitosoComponent,
    OrdenCompraGeneradaComponent,
    CategoriasComponent,
    PedidosComponent,
    DetallePedidoComponent,
    CalificarServicioComponent,
    PreguntasFrecuentesComponent,
    PoliticasPrivacidadComponent,
    TerminosCondicionesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxCurrencyModule,
    NgbModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Mx' }, //Para cambiar la fecha a Español-México
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
