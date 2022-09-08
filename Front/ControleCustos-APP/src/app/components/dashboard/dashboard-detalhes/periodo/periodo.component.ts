import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastInjector, ToastrService } from 'ngx-toastr';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { DashboardsService } from 'src/app/services/dashboards.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Dashboard } from 'src/app/models/identity/Dashboard';
import { Conta } from 'src/app/models/identity/Conta';


@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent implements OnInit {

  dashboard = {} as Dashboard;
  dashboards = [] as Dashboard[];

  conta = {} as Conta;
  contas = [] as Conta[];
  labelSeriesChart = [];
  valueSeriesChart = [];
  form!: FormGroup;

  dataInicio : string;
  dataFim : string;

  constructor(
    private fb: FormBuilder,
    private dashBoardsService: DashboardsService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.localeService.use('pt-br');
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  ngOnInit(): void {
    this.validationForm();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  public get f(): any {
    return this.form.controls;
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {
      'is-invalid': campoForm.errors && (campoForm.dirty || campoForm.touched),
    };
  }

  public validationForm(): void {
    this.form = this.fb.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    });
  }

  public gerarDados(): void {
    this.getDadosDashBoardPeriodo();
  }

  getDadosDashBoardPeriodo(): void {
    this.dashboard = { ...this.form.value };

    this.dataInicio = this.formatDate(this.dashboard.dataInicio);
    this.dataFim = this.formatDate(this.dashboard.dataFim);

    console.log(this.dashboards);
    this.spinner.show();
    this.dashBoardsService
    .getDadosDashBoardPeriodo(this.dataInicio , this.dataFim)
    .subscribe({
        next: (conta: Conta[]) => {
          this.contas = { ... conta};
          console.log(this.contas);
          this.criarSeriesLabel(this.contas);
          this.criarSeriesValue(this.contas);
          this.updateChart();
        },
        error: (error: any) => {
          console.log(error), this.spinner.hide();
          this.toastr.error('Erro ao carregar os dados.', 'Erro');
        },
      })
      .add(() => this.spinner.hide());
  }

  criarSeriesLabel(contas: Conta[]): any {
    Object.entries(contas).forEach(([key, value], index) => {
      this.labelSeriesChart = [];
      for (let key in this.contas) {
        let conta = this.contas[key];
        this.labelSeriesChart.push([
          conta.anoMes
        ]
        );
      }
    });
    console.log(this.labelSeriesChart);
  }

  criarSeriesValue(contas: Conta[]): any {
    Object.entries(contas).forEach(([key, value], index) => {
      this.valueSeriesChart = [];
      for (let key in this.contas) {
        let conta = this.contas[key];
        this.valueSeriesChart.push([
          conta.valor
        ]);
      }
    });
    console.log(this.valueSeriesChart);
  }

  formatDate(date: Date): string {
      date = new Date(date);

      var day = ('0' + date.getDate()).slice(-2);
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var year = date.getFullYear();

      return year + '-' + month + '-' + day;
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [ ], label: 'R$ - Ano/Mês' }
    ],

  };

  public updateChart(): void {
    this.barChartData.labels = this.labelSeriesChart,
    this.barChartData.datasets = [
      { data: this.valueSeriesChart, label: 'R$ - Ano/Mês' }
    ];

    this.chart?.update();
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  }
}
