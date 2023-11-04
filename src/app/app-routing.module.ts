import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SetProductosComponent } from './backend/set-productos/set-productos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'set-productos', component: SetProductosComponent},
  { path: 'perfil', component: PerfilComponent},
  /* Ruta vacia */
  {
    path: '',
    component: HomeComponent
  },
  /* Rut por Defecto */
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
