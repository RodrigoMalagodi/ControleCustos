import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoFornecimentoComponent } from './tipo-fornecimento.component';

describe('TipoFornecimentoComponent', () => {
  let component: TipoFornecimentoComponent;
  let fixture: ComponentFixture<TipoFornecimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoFornecimentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoFornecimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
