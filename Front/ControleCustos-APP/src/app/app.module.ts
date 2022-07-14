import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContasComponent } from './components/contas/contas.component';
import { ContasDetalheComponent } from './components/contas/contas-detalhe/contas-detalhe.component';
import { ContasListaComponent } from './components/contas/contas-lista/contas-lista.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { FornecedoresComponent } from './components/fornecedores/fornecedores.component';
import { DetalhesComponent } from './components/fornecedores/detalhes/detalhes.component';
import { FornecedoresDetalhesComponent } from './components/fornecedores/fornecedores-detalhes/fornecedores-detalhes.component';
import { FornecedoresListaComponent } from './components/fornecedores/fornecedores-lista/fornecedores-lista.component';
import { NavComponent } from './shared/nav/nav.component';
import { TituloComponent } from './shared/titulo/titulo.component';

@NgModule({
  declarations: [
    AppComponent,
    ContasComponent,
    ContasDetalheComponent,
    ContasListaComponent,
    DashboardComponent,
    HomeComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    PerfilComponent,
    FornecedoresComponent,
    DetalhesComponent,
    FornecedoresDetalhesComponent,
    FornecedoresListaComponent,
    NavComponent,
    TituloComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
