import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GithubReposComponent} from './github-repos/github-repos.component';


const routes: Routes = [
  {
    path: '',
    component: GithubReposComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
