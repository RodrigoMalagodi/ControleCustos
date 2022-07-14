import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasListaComponent } from './contas-lista.component';

describe('ContasListaComponent', () => {
  let component: ContasListaComponent;
  let fixture: ComponentFixture<ContasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContasListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
