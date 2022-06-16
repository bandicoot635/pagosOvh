import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


//Rutas
import { AppRoutingModule } from './app-routing.module';

//componentes
import { AppComponent } from './app.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { FormulariosComponent } from './components/formularios/formularios.component';

//Servicios
import { ApiService } from '../app/service/api.service';
import { FiltroPipe } from './pipes/filtro.pipe';
import { RecuperarComponent } from './components/recuperar/recuperar.component';



@NgModule({
  declarations: [
    AppComponent,
    PagosComponent,
    FormulariosComponent,
    FiltroPipe,
    RecuperarComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
