import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RegistroExitosoComponent } from './components/registro/registro-exitoso/registro-exitoso.component';
import { RecuperarContraseniaComponent } from './components/recuperar-contrasenia/recuperar-contrasenia.component';
import { HomeComponent } from './components/home/home.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { DetalleServicioComponent } from './components/detalle-servicio/detalle-servicio.component';
import { PagoOnlineComponent } from './components/pago-online/pago-online.component';
import { OrdenCompraGeneradaComponent } from './components/pago-online/orden-compra-generada/orden-compra-generada.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { PedidosComponent } from './components/usuario/pedidos/pedidos.component';
import { DetallePedidoComponent } from './components/usuario/pedidos/detalle-pedido/detalle-pedido.component';
import { CalificarServicioComponent } from './components/calificar-servicio/calificar-servicio.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { PoliticasPrivacidadComponent } from './components/politicas-privacidad/politicas-privacidad.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'registro-exitoso/:email', component: RegistroExitosoComponent },
  { path: 'recuperar-password', component: RecuperarContraseniaComponent },
  { path: 'inicio', component: HomeComponent },
  { path: 'categoria/:idCategoria', component: CategoriasComponent },
  { path: 'productos/detalle/:idProducto', component: DetalleServicioComponent },
  { path: 'productos/pago-online/:idProducto', component: PagoOnlineComponent },
  { path: 'orden-compra-generada/:idProducto/:idPedido', component: OrdenCompraGeneradaComponent },
  { path: 'mi-perfil', component: PerfilComponent },
  { path: 'mis-pedidos', component: PedidosComponent },
  { path: 'mis-pedidos/detalle/:idPedido', component: DetallePedidoComponent },
  { path: 'calificar-servicio', component: CalificarServicioComponent },
  { path: 'faq', component: PreguntasFrecuentesComponent },
  { path: 'politicas-de-privacidad', component: PoliticasPrivacidadComponent },
  { path: 'terminos-y-condiciones', component: TerminosCondicionesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
