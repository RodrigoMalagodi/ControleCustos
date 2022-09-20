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
import { ContasService } from 'src/app/services/contas.service';
import { DashboardsService } from 'src/app/services/dashboards.service';
import { Dashboard } from 'src/app/models/identity/Dashboard';

import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BuildArrayChart } from 'src/app/models/identity/BuildArrayChart';

@Component({
  selector: 'app-tipo-custo',
  templateUrl: './tipo-custo.component.html',
  styleUrls: ['./tipo-custo.component.scss'],
})
export class TipoCustoComponent implements OnInit {
  dashboard = {} as Dashboard;

  conta = {} as BuildArrayChart;
  contas = [] as BuildArrayChart[];
  labelShortSeriesChart = [];
  labelFromResult = [];
  valueSeriesChart = [];
  dataSet = [];
  dataSet2 = [];
  form!: FormGroup;

  dataInicio: string;
  dataFim: string;
  retornoMes: string = '';
  qtdeMeses: number = 1;
  anoMesInicio : number = 0;
  anoMesFim : number = 0;
  anoMesArray : string = "";
  visible = 'none';

  constructor(
    private fb: FormBuilder,
    private dashBoardsService: DashboardsService,
    private contaService: ContasService,
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
    this.spinner.show();
    setTimeout(() => {
      this.getDadosDashBoardTipoCusto();
    }, 3000);
  }

  formatDate(date: Date): string {
    date = new Date(date);

    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    return year + '-' + month + '-' + day;
  }

  formataAnoMes(date: Date): number {
    var data = new Date(date);

    var month = ('0' + (data.getMonth() + 1)).slice(-2);
    var year = data.getFullYear();

    return parseInt(year + month);
  }

  verificaAnoMesArray(anoMes: string): boolean{
    if(this.labelFromResult.find(x => x === anoMes))
    {
      return true;
    }
    return false;
  }

  getDadosDashBoardTipoCusto(): void {
    this.dashboard = { ...this.form.value };

    this.dataInicio = this.formatDate(this.dashboard.dataInicio);
    this.dataFim = this.formatDate(this.dashboard.dataFim);

    this.dashBoardsService
      .getDadosDashBoardTipoCusto(this.dataInicio, this.dataFim)
      .subscribe({
        next: (conta: BuildArrayChart[]) => {
          this.contas = { ...conta };
          console.log(this.contas);
          this.criarSeriesLabel(this.dashboard.dataInicio, this.dashboard.dataFim);
          this.criarSeriesLabelFromResult(this.contas);
          this.criarSeriesValue(this.contas);
          this.updateChart();
          this.visible = 'block';
        },
        error: (error: any) => {
          console.log(error), this.spinner.hide();
          this.toastr.error('Erro ao carregar os dados.', 'Erro');
        },
      })
      .add(() => this.spinner.hide());
  }

  criarSeriesLabelFromResult(contas: BuildArrayChart[]): any {
    Object.entries(contas).forEach(([key, value], index) => {
      this.labelFromResult = [];
      for (let index = 0; index < this.contas['dados'].length; index++) {
        for (let i = 0; i < this.contas['dados'][index].dataPoints.length; i++) {
          let anoMes = this.contas['dados'][index].dataPoints[i].description;
          this.labelFromResult.push(anoMes);
        }
      }
    });
    //Remove duplicates
    this.labelFromResult = this.labelFromResult.filter((v, i, a) => a.indexOf(v) === i);
    //Sort array
    this.labelFromResult.sort();
    console.log(this.labelFromResult);
  }

  criarSeriesLabel(dataInicio: Date, dataFim: Date): any {
    this.labelShortSeriesChart = [];
    this.qtdeMeses = 1;
    this.anoMesInicio = this.formataAnoMes(dataInicio);
    this.anoMesFim = this.formataAnoMes(dataFim);
    this.qtdeMeses += this.anoMesFim - this.anoMesInicio;
    for (let index = 1; index <= this.qtdeMeses; index++) {
      var anoMes = new Date(dataInicio);
      this.anoMesArray = anoMes.getFullYear() + ('0' + (index).toString().slice(-2));
      this.labelShortSeriesChart.push(this.anoMesArray);
    }
    //Remove duplicates
    this.labelShortSeriesChart = this.labelShortSeriesChart.filter((v, i, a) => a.indexOf(v) === i);
    //Sort array
    this.labelShortSeriesChart.sort();
    console.log(this.labelShortSeriesChart);
  }

  criarSeriesValue(contas: BuildArrayChart[]): any {
    Object.entries(contas).forEach(([key, value], index) => {
      this.dataSet = [];
      this.dataSet2 = [];
      let valor = 0;

      // for (let index = 0; index < this.labelShortSeriesChart.length; index++) {
      //   anoMes = this.labelShortSeriesChart[index];
      // }

      for (let i = 0; i < this.contas['dados'].length; i++) {
        for (let j = 0; j < this.contas['dados'][i]['dataPoints'].length; j++) {
          let anoMes = this.labelShortSeriesChart[i];
          if(this.verificaAnoMesArray(anoMes))
          {
            valor = this.contas['dados'][i]['dataPoints'][j]['value'];
          }
          if (i == 0) {
            this.dataSet.push(valor);
          } else {
            this.dataSet2.push(valor);
          }
          valor = 0;
        }
      }

      this.dataSet = this.dataSet.filter((v, i, a) => a.indexOf(v) === i);
      this.dataSet2 = this.dataSet2.filter((v, i, a) => a.indexOf(v) === i);

      console.log(this.dataSet);
      console.log(this.dataSet2);
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

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
    datasets: [
      { data: [], label: 'Fixo', backgroundColor: '#005580' },
      { data: [], label: 'Variável', backgroundColor: '#009999' },
    ],
  };

  public updateChart(): void {
    (this.barChartData.labels = this.labelShortSeriesChart),
      (this.barChartData.datasets = [
        {
          data: this.dataSet,
          label: 'R$ Fixo',
          backgroundColor: '#005580',
          hoverBackgroundColor: '#0099e6',
        },
        {
          data: this.dataSet2,
          label: 'R$ Variável',
          backgroundColor: '#009999',
          hoverBackgroundColor: '#00e6e6',
        },
      ]);

    this.chart?.update();
  }

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
