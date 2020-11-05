import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerStub;

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    }
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
      declarations: [ LoginComponent ],
      providers: [
        { provide: Router, useValue: routerStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let errors = {};
    let email = component.form.controls['email'];
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('password field validity', () => {
    let errors = {};
    let password = component.form.controls['password'];

    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('submitting a form emits a user', () => {
    expect(component.form.valid).toBeFalsy();
    component.form.controls['email'].setValue("test@test.com");
    component.form.controls['password'].setValue("123456789");
    expect(component.form.valid).toBeTruthy();

    component.login();

    expect(component.user.email).toBe("test@test.com");
    expect(component.user.password).toBe("123456789");
  });

  describe("Log in testing", function () {

    it('sign in button click should trigger the login() function', function () {
      spyOn(component, 'login');

      let button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();

      fixture.whenStable().then(() => {
        expect(component.login).toHaveBeenCalled();
      });
    });

    it("form input are invalid", function () {
      const spy = spyOn(component, "showMessage");
      expect(component.form.valid).toBe(false);
      component.showMessage("Please fill all the fields!");
      expect(component.showMessage).toHaveBeenCalledWith("Please fill all the fields!");
    });

    it("form input are valid ", function () {
      const spy = spyOn(component.productService, "login");
      component.form.controls['email'].setValue("test@test.com");
      component.form.controls['password'].setValue("123456789");
      expect(component.form.valid).toBe(true);
      const user = {
        email: 'test@test.com',
        password: '123456789',
        type: "POST"
      }
      component.productService.login(user);
      expect(component.productService.login).toHaveBeenCalledWith(user);
    });

    it('user is valid and redirect to home page', function() {
      const spy = spyOn(component.productService, "login").and.returnValues(of({'status' : true}));
      const user = {
        email: 'test@test.com',
        password: '123456789',
        type: "POST"
      }
      component.productService.login(user).subscribe((response: Response) => {
        expect(response).not.toBe(null);
        expect(response['status']).toBeTrue;
        component.homePage();
        expect(routerStub.navigate).toHaveBeenCalledWith(['/home']);
      });
      expect(component.productService.login).toHaveBeenCalledWith(user);
    })

    it('user is not valid and show error messages', function () {
      const spy = spyOn(component.productService, "login").and.returnValues(of({ 'status': false }));
      const user = {
        email: 'test@test.com',
        password: '123456789',
        type: "POST"
      }
      component.productService.login(user).subscribe((response: Response) => {
        expect(response['status']).toBeFalse;
        component.showMessage("error message");
        expect(component.showMessage).toHaveBeenCalledTimes(1);
      });
    })

  });

});
