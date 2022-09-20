import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, TitleStrategy } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { DashboardsService } from 'src/app/services/dashboards.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Dashboard } from 'src/app/models/identity/Dashboard';
import { Conta } from 'src/app/models/identity/Conta';
import writeXlsxFile from 'write-excel-file';
import { ValidatorField } from 'src/app/helpers/ValidatorField';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss'],
})
export class PeriodoComponent implements OnInit {
  public sumValues: number = 0;

  dashboard = {} as Dashboard;
  conta = {} as Conta;
  contas = [] as Conta[];
  labelSeriesChart = [];
  valueSeriesChart = [];
  headerExcel = [];
  rowExcel = [];
  form!: FormGroup;
  retornoMes: string = '';
  dataInicio: string;
  dataFim: string;

  visibleBar = 'none';
  visibleLine = 'none';
  visibleDonut = 'none';
  dataSet = [];

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

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.DateValid('dataInicio', 'dataFim'),
    };

    this.form = this.fb.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required]
    },
    formOptions
    );
  }

  public gerarDados(typeChart: string): void {
    this.spinner.show();
    setTimeout(() => {
      this.getDadosDashBoardPeriodo(typeChart, false);
    }, 3000);
  }

  public gerarExcel(): void {
    this.spinner.show();
    setTimeout(() => {
      this.getDadosDashBoardPeriodo('', true);
    }, 3000);
  }

  getDadosDashBoardPeriodo(typeChart: string, exportData: boolean): void {
    this.dashboard = { ...this.form.value };

    this.dataInicio = ValidatorField.formatDate(this.dashboard.dataInicio);
    this.dataFim = ValidatorField.formatDate(this.dashboard.dataFim);

    this.dashBoardsService
      .getDadosDashBoardPeriodo(this.dataInicio, this.dataFim)
      .subscribe({
        next: (conta: Conta[]) => {
          this.contas = { ...conta };
          console.log(this.contas);
          if (Object.entries(this.contas).length === 0)
          {
            this.toastr.info("Não existem dados para serem exibidos no período solicitado", "Informação");
            this.spinner.hide()
            return;
          }
          this.criarSeriesLabel(this.contas);
          this.criarSeriesValue(this.contas);
          if (exportData) {
            this.exportarDadosExcel(this.contas);
          } else {
            this.showChart(typeChart);
          }
        },
        error: (error: any) => {
          console.log(error), this.spinner.hide();
          this.toastr.error('Erro ao carregar os dados.', 'Erro');
        },
      })
      .add(() => this.spinner.hide());
  }

  exportarDadosExcel(contas: Conta[]): any {
    try {
      this.labelSeriesChart = [];
      for (let key in this.contas) {
        let conta = this.contas[key];
        this.headerExcel.push({
          value: this.nomeAnoMes(conta.anoMes),
          fontWeight: 'bold',
        });

        this.rowExcel.push({
          type: Number,
          value: conta.valor,
        });
      }

      this.headerExcel.push({
        value: 'Total R$',
        fontWeight: 'bold',
      });

      this.rowExcel.push({
        type: Number,
        value: this.sumValues,
      });

      this.dataSet = [this.headerExcel, this.rowExcel];

      this.downloadBlob(
        this.dataSet,
        `ControleCustos_${this.dataInicio.replace(
          '-',
          '_'
        )}_${this.dataFim.replace('-', '_')}`
      );
      this.toastr.success(
        'Dados exportados para Excel com sucesso.',
        'Sucesso'
      );
    } catch (error) {
      this.toastr.error('Falha ao tentar exportar dados para o Excel.', 'Erro');
    }
  }

  downloadBlob(data: any, filename: string) {
    writeXlsxFile(data, {
      headerStyle: {
        backgroundColor: '#eeeeee',
        fontWeight: 'bold',
        align: 'center',
      },

      fileName: filename,
    });
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
      this.sumValues = 0;
      for (let key in contas) {
        let conta = contas[key];
        this.valueSeriesChart.push(conta.valor);
        this.sumValues = this.sumValues + conta.valor;
      }
    });
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
    responsive: true,
    elements: {
      line: {
        tension: 0,
      },
    },
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
      legend: { display: true },
    },
  };

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
          pointBorderColor: '#005580',
          pointBackgroundColor: '#005580',
          datalabels: {
            color: '#000',
            font: {
              weight: 'bold',
            },
            anchor: 'start',
            align: 'top',
          },

          fill: true,
        },
      ]);

    this.chart?.update();
  }

  //#endregion

  //#region donut

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: {
        display: true,
        position: 'left',
        labels: {
          font: {
            weight: 'bold',
          },
          color: '#000',
        },
      },
    },
  };

  public doughnutChartLabels: string[] = this.labelSeriesChart;
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [],
      },
    ],
  };

  public doughnutChartType: ChartType = 'doughnut';
  updateDonutChart() {
    (this.doughnutChartData.labels = this.labelSeriesChart),
      (this.doughnutChartData.datasets = [
        {
          data: this.valueSeriesChart,
          hoverOffset: 4,
          backgroundColor: ["#04601a", "#01ab84", "#040479", "#028c71", "#02355e", "#03742e", "#06a962", "#031da0", "#05f769", "#01535e", "#05d185", "#01b38e", "#0307fc", "#005a03", "#02b3aa", "#044251", "#0453c4", "#02c509", "#040a40", "#043ef6"],
          hoverBackgroundColor: ["#04601a", "#01ab84", "#040479", "#028c71", "#02355e", "#03742e", "#06a962", "#031da0", "#05f769", "#01535e", "#05d185", "#01b38e", "#0307fc", "#005a03", "#02b3aa", "#044251", "#0453c4", "#02c509", "#040a40", "#043ef6"],
          hoverBorderColor: ["#04601a", "#01ab84", "#040479", "#028c71", "#02355e", "#03742e", "#06a962", "#031da0", "#05f769", "#01535e", "#05d185", "#01b38e", "#0307fc", "#005a03", "#02b3aa", "#044251", "#0453c4", "#02c509", "#040a40", "#043ef6"],
          offset: 4,
          datalabels: {
            color: '#fff',
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
