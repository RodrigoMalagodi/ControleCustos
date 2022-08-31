import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCustoComponent } from './tipo-custo.component';

describe('TipoCustoComponent', () => {
  let component: TipoCustoComponent;
  let fixture: ComponentFixture<TipoCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoCustoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
