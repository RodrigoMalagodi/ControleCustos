import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { DashboardsService } from 'src/app/services/dashboards.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Dashboard } from 'src/app/models/identity/Dashboard';
import { Conta } from 'src/app/models/identity/Conta';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss'],
})
export class PeriodoComponent implements OnInit {
  dashboard = {} as Dashboard;

  conta = {} as Conta;
  contas = [] as Conta[];
  labelSeriesChart = [];
  valueSeriesChart = [];
  form!: FormGroup;
  retornoMes: string = '';

  dataInicio: string;
  dataFim: string;

  visibleBar = 'none';
  visibleLine = 'none';
  visibleDonut = 'none';

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

  public gerarDados(typeChart: string): void {
    //this.barCharType(typeChart);
    this.spinner.show();
    setTimeout(() => {
      this.getDadosDashBoardPeriodo(typeChart);
    }, 3000);
  }

  getDadosDashBoardPeriodo(typeChart: string): void {
    this.dashboard = { ...this.form.value };

    this.dataInicio = this.formatDate(this.dashboard.dataInicio);
    this.dataFim = this.formatDate(this.dashboard.dataFim);

    this.dashBoardsService
      .getDadosDashBoardPeriodo(this.dataInicio, this.dataFim)
      .subscribe({
        next: (conta: Conta[]) => {
          this.contas = { ...conta };
          this.criarSeriesLabel(this.contas);
          this.criarSeriesValue(this.contas);
          this.showChart(typeChart);
        },
        error: (error: any) => {
          console.log(error), this.spinner.hide();
          this.toastr.error('Erro ao carregar os dados.', 'Erro');
        },
      })
      .add(() => this.spinner.hide());
  }

  showChart(typeChart: string) {
    switch (typeChart) {
      case 'bar':
        this.updateBarChart();
        this.visibleBar = 'block';
        this.visibleLine = 'none';
        this.visibleDonut = 'none';
        break;
      case 'line':
        this.updateLineChart();
        this.visibleBar = 'none';
        this.visibleLine = 'block';
        this.visibleDonut = 'none';
        break;
      case 'doughnut':
        this.updateDonutChart();
        this.visibleBar = 'none';
        this.visibleLine = 'none';
        this.visibleDonut = 'block';
        break;
    }
  }


  criarSeriesLabel(contas: Conta[]): any {
    Object.entries(contas).forEach(([key, value], index) => {
      this.labelSeriesChart = [];
      for (let key in this.contas) {
        let conta = this.contas[key];
        this.labelSeriesChart.push(this.nomeAnoMes(conta.anoMes));
      }
    });
  }

  criarSeriesValue(contas: Conta[]): any {
    Object.entries(contas).forEach(([key, value], index) => {
      this.valueSeriesChart = [];
      for (let key in this.contas) {
        let conta = this.contas[key];
        this.valueSeriesChart.push(conta.valor);
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

  //#region bar
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    color: '#000',
    scales: {
      x: {
        grid: {
          lineWidth: 0,
        },
        ticks: {
          color: '#000',
        },
      },
      y: {
        min: 10,
        grid: {
          lineWidth: 0,
        },
        ticks: {
          color: '#000',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            weight: 'bold',
          },
          color: '#000',
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#000',
        font: {
          weight: 'bold',
        },
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'R$', backgroundColor: ['#005580'] }],
  };

  public updateBarChart(): void {
    (this.barChartData.labels = this.labelSeriesChart),
      (this.barChartData.datasets = [
        {
          data: this.valueSeriesChart,
          label: 'R$',
          backgroundColor: ['#005580'],
          hoverBackgroundColor: ['#0099e6'],
        },
      ]);

    this.chart?.update();
  }
  //#endregion

  //#region line

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {
        grid: {
          lineWidth: 0,
        },
        ticks: {
          color: '#000',
        },
      },
      y: {

      }
    },

    plugins: {
      legend: { display: true },
    }
  }

  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [DataLabelsPlugin];

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ data: [], label: 'R$', backgroundColor: ['#005580'] }],
  };

  updateLineChart() {
    (this.lineChartData.labels = this.labelSeriesChart),
      (this.lineChartData.datasets = [
        {
          data: this.valueSeriesChart,
          label: 'R$',
          backgroundColor: '#005580',
          borderColor: '#005580',
          pointStyle: '#005580',
          pointBorderColor:'#005580',
          pointBackgroundColor:'#005580',
          datalabels:{
            color: '#000',
            font: {
              weight: 'bold',
            },
            anchor: 'start',
            align: 'top'
          },

          fill: true,
        },
      ]);

    this.chart?.update();
  }

  //#endregion

  //#region donut

  public doughnutChartLabels: string[] = this.labelSeriesChart;
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
         data: []
      }
    ]
  };

  public doughnutChartType: ChartType = 'doughnut';
  updateDonutChart() {

    (this.doughnutChartData.labels = this.labelSeriesChart),
    (this.doughnutChartData.datasets = [
      {
        data: this.valueSeriesChart,
        hoverOffset: 4,
        backgroundColor: ["#0886c9", "#0affc1", "#05838b", "#0eddcb", "#0c78a5", "#09fa97", "#0bd60d", "#014f44", "#068ee0", "#06cf01", "#07fdd8", "#0684e7"],
        hoverBackgroundColor: ["#0886c9", "#0affc1", "#05838b", "#0eddcb", "#0c78a5", "#09fa97", "#0bd60d", "#014f44", "#068ee0", "#06cf01", "#07fdd8", "#0684e7"],
        hoverBorderColor: ["#0886c9", "#0affc1", "#05838b", "#0eddcb", "#0c78a5", "#09fa97", "#0bd60d", "#014f44", "#068ee0", "#06cf01", "#07fdd8", "#0684e7"],
        offset: 4,
        datalabels:{
          color: '#000',
          font: {
            weight: 'bold',
          },
        },
      },
    ]);

    this.chart?.update();
  }

  //#endregion


  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {}

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {}

  barCharType(typeChart: string): void {
    this.barChartType =
      typeChart === 'bar' ? 'bar' : typeChart == 'line' ? 'line' : 'doughnut';
  }

  nomeAnoMes(anoMes: number): string {
    switch (anoMes.toString().substring(anoMes.toString().length - 2)) {
      case '01':
        this.retornoMes = 'Jan';
        break;
      case '02':
        this.retornoMes = 'Fev';
        break;
      case '03':
        this.retornoMes = 'Mar';
        break;
      case '04':
        this.retornoMes = 'Abr';
        break;
      case '05':
        this.retornoMes = 'Mai';
        break;
      case '06':
        this.retornoMes = 'Jun';
        break;
      case '07':
        this.retornoMes = 'Jul';
        break;
      case '08':
        this.retornoMes = 'Ago';
        break;
      case '09':
        this.retornoMes = 'Set';
        break;
      case '10':
        this.retornoMes = 'Out';
        break;
      case '11':
        this.retornoMes = 'Nov';
        break;
      case '12':
        this.retornoMes = 'Dez';
        break;
      default:
        break;
    }

    return this.retornoMes;
  }
}
