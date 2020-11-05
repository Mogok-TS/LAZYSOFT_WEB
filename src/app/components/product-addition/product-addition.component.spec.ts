import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductAdditionComponent } from './product-addition.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxImageCompressorModule } from 'ngx-image-compressor';
import { ImageCompressorService } from 'ngx-image-compressor';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';


describe('ProductAdditionComponent', () => {
  let component: ProductAdditionComponent;
  let fixture: ComponentFixture<ProductAdditionComponent>;
  let routerStub;

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    }
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, NgxImageCompressorModule, RouterTestingModule],
      declarations: [ ProductAdditionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerStub },
        ImageCompressorService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("add function", function () {
    it("upload to database and redirect to home page", function () {
      const spy = spyOn(component.productService, "addNewProductItem").and.returnValues(of({ 'status': true }));
      const form = new FormData();
      const token = "token";
      const headers = new HttpHeaders()
        .set('token', token);
      component.productService.addNewProductItem(form,headers).subscribe((response: Response) => {
        expect(response).not.toBe(null);
        expect(response['status']).toBeTrue;
        expect(component.form.reset).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Home button from navigation bar", function () {
    it("should redirect user to home page", function () {
      component.redirectHome();
      expect(component.redirectHome).toHaveBeenCalled;
      expect(routerStub.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

});
