import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabirinsComponent } from './labirins.component';

describe('LabirinsComponent', () => {
  let component: LabirinsComponent;
  let fixture: ComponentFixture<LabirinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabirinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabirinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
