import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'labirins', loadChildren: () => import('./labirins/labirins.module').then(m => m.LabirinsModule)
  },
  {
    path: '',
    redirectTo: '/labirins',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/labirins',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
