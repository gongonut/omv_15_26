import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'itemdeta',
    loadComponent: () => import('./pages/item-detail/item-detail.component').then(m => m.ItemDetailComponent),
    // canLoad: [AllowNavGuard]    
  },
  { path: 'itemlist', loadComponent: () => import('./pages/item-list/item-list.component').then(m => m.ItemListComponent) },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: '404', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
