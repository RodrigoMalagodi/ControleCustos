import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedoresDetalhesComponent } from './fornecedores-detalhes.component';

describe('FornecedoresDetalhesComponent', () => {
  let component: FornecedoresDetalhesComponent;
  let fixture: ComponentFixture<FornecedoresDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedoresDetalhesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedoresDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
