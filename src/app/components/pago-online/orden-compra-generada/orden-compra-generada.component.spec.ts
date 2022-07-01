import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCompraGeneradaComponent } from './orden-compra-generada.component';

describe('OrdenCompraGeneradaComponent', () => {
  let component: OrdenCompraGeneradaComponent;
  let fixture: ComponentFixture<OrdenCompraGeneradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenCompraGeneradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCompraGeneradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
