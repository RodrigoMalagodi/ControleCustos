import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDetalhesComponent } from './dashboard-detalhes.component';

describe('DashboardDetalhesComponent', () => {
  let component: DashboardDetalhesComponent;
  let fixture: ComponentFixture<DashboardDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDetalhesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
