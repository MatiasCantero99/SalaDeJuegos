import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayorYMenorComponent } from './mayor-y-menor.component';

describe('MayorYMenorComponent', () => {
  let component: MayorYMenorComponent;
  let fixture: ComponentFixture<MayorYMenorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MayorYMenorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MayorYMenorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
