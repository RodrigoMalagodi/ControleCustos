import { AbstractControl, FormGroup } from '@angular/forms';
import { getMonth } from 'ngx-bootstrap/chronos';

export class ValidatorField {
  static MustMatch(controlName: string, matchingControlName: string): any {
    return (group: AbstractControl) => {
      const formGroup = group as FormGroup;
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== '' && matchingControl.value !== '') {
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          return null;
        }
        if (control.value != matchingControl.value) {
          matchingControl.setErrors({
            mustMatch: true,
          });
        } else {
          matchingControl.setErrors(null);
        }
      }
      return null;
    };
  }

  static DateValid(dataInicio: string, dataFim: string): any {
    return (group: AbstractControl) => {
      const formGroup = group as FormGroup;
      const diaInicio = formGroup.controls[dataInicio];
      const diaFim = formGroup.controls[dataFim];

      const anoMesInicio = this.setAnoMes(diaInicio.value);
      const anoMesFim = this.setAnoMes(diaFim.value);

      if (anoMesInicio !== 0 && anoMesFim !== 0) {
        if (diaInicio.errors && !diaInicio.errors.dateValid) {
          return null;
        }
        if (diaFim.errors && !diaFim.errors.dateValid) {
          return null;
        }
        if (anoMesInicio <= anoMesFim) {
          return null;
        }
        if (anoMesFim >= anoMesInicio) {
          return null;
        } else {
          diaInicio.setErrors({
            dateValid: true,
          });
          diaFim.setErrors({
            dateValid: true,
          });
        }
      }
      return null;
    };
  }

  static setAnoMes(date: Date): number {
    date = new Date(date);

    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    return parseInt(year + month + day);
  }

  static formatDate(date: Date): string {
    date = new Date(date);

    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();

    return year + '-' + month + '-' + day;
  }
}
