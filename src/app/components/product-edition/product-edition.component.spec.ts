import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductEditionComponent } from './product-edition.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgxImageCompressorModule } from 'ngx-image-compressor';
import { ImageCompressorService } from 'ngx-image-compressor';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('ProductEditionComponent', () => {
  let component: ProductEditionComponent;
  let fixture: ComponentFixture<ProductEditionComponent>;
  let routerStub;

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    }
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, NgxImageCompressorModule],
      declarations: [ ProductEditionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ImageCompressorService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("Edit data submit and home page navigation", function () {
    it("update to database and redirect to home page", function () {
      const spy = spyOn(component.productService, "updateProductItem").and.returnValues(of({ 'status': true }));
      const form = new FormData();
      var router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      const token = "token";
      const headers = new HttpHeaders()
        .set('token', token);
      component.submit();
      component.productService.updateProductItem(form, headers).subscribe((response: Response) => {
        expect(response).not.toBe(null);
        component.redirectHome();
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
      });
    });

    it('should go to home page', function () {
      var router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      component.redirectHome();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

});

