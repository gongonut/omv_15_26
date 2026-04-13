import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ItemListComponent } from './pages/item-list/item-list.component';

export const routes: Routes = [
  {
    path: 'itemdeta',
    loadChildren: () => import('./pages/item-detail/item-detail.component').then(m => m.ItemDetailComponent),
    // canLoad: [AllowNavGuard]    
  },
  { path: 'itemlist', component: ItemListComponent },
  { path: 'home', component: HomeComponent },
  { path: '404', component: HomeComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
