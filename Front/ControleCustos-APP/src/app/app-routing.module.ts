import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContasDetalheComponent } from './components/contas/contas-detalhe/contas-detalhe.component';
import { ContasListaComponent } from './components/contas/contas-lista/contas-lista.component';
import { ContasComponent } from './components/contas/contas.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FornecedoresDetalhesComponent } from './components/fornecedores/fornecedores-detalhes/fornecedores-detalhes.component';
import { FornecedoresListaComponent } from './components/fornecedores/fornecedores-lista/fornecedores-lista.component';
import { FornecedoresComponent } from './components/fornecedores/fornecedores.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/user/login/login.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'user/login', pathMatch: 'full' },
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
    ],
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'user/perfil', component: PerfilComponent },
      { path: 'contas', component: ContasComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'contas', redirectTo: 'contas/lista' },
      {
        path: 'contas',
        component: ContasComponent,
        children: [
          { path: 'detalhe/:id', component: ContasDetalheComponent },
          { path: 'detalhe', component: ContasDetalheComponent },
          { path: 'lista', component: ContasListaComponent },
        ],
      },
      { path: 'fornecedores', redirectTo: 'fornecedores/lista' },
      {
        path: 'fornecedores',
        component: FornecedoresComponent,
        children: [
          { path: 'detalhe/:id', component: FornecedoresDetalhesComponent },
          { path: 'detalhe', component: FornecedoresDetalhesComponent },
          { path: 'lista', component: FornecedoresListaComponent },
        ],
      },
      { path: 'home', component: HomeComponent },
    ],
  },

  { path: '**', redirectTo: 'user/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
