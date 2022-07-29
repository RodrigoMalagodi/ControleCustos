import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxCurrencyModule } from 'ngx-currency';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';

import { ContasComponent } from './components/contas/contas.component';
import { ContasDetalheComponent } from './components/contas/contas-detalhe/contas-detalhe.component';
import { ContasListaComponent } from './components/contas/contas-lista/contas-lista.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { FornecedoresComponent } from './components/fornecedores/fornecedores.component';
import { FornecedoresDetalhesComponent } from './components/fornecedores/fornecedores-detalhes/fornecedores-detalhes.component';
import { FornecedoresListaComponent } from './components/fornecedores/fornecedores-lista/fornecedores-lista.component';
import { NavComponent } from './shared/nav/nav.component';
import { TituloComponent } from './shared/titulo/titulo.component';
import { AccountService } from './services/account.service';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { PerfilDetalheComponent } from './components/user/perfil/perfil-detalhe/perfil-detalhe.component';

defineLocale('pt-br', ptBrLocale);

@NgModule({
  declarations: [
    AppComponent,
    ContasComponent,
    ContasDetalheComponent,
    ContasListaComponent,
    DashboardComponent,
    DateTimeFormatPipe,
    HomeComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    PerfilComponent,
    FornecedoresComponent,
    FornecedoresDetalhesComponent,
    FornecedoresListaComponent,
    NavComponent,
    TituloComponent,
    PerfilComponent,
    PerfilDetalheComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    NgxSpinnerModule,
    NgxCurrencyModule,
    TabsModule.forRoot()
  ],
  providers: [
    AccountService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
