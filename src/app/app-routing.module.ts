import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormulariosComponent } from './components/formularios/formularios.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';

const routes: Routes = [
 
  { path: 'pagos', component: PagosComponent},
  { path: 'formularios', component: FormulariosComponent },
  { path: 'recuperar', component: RecuperarComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'pagos'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
