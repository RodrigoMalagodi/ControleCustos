import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDetalhesComponent } from './home-detalhes.component';

describe('HomeDetalhesComponent', () => {
  let component: HomeDetalhesComponent;
  let fixture: ComponentFixture<HomeDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDetalhesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
