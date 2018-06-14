import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRoleManagementComponent } from './employee-role-management.component';

describe('EmployeeRoleManagementComponent', () => {
  let component: EmployeeRoleManagementComponent;
  let fixture: ComponentFixture<EmployeeRoleManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeRoleManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
