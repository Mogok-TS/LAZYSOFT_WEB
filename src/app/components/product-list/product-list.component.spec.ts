import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let routerStub;

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    }
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, NgxPaginationModule, RouterTestingModule, ReactiveFormsModule, FormsModule],
      declarations: [ ProductListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      // providers: [
      //   { provide: Router, useValue: routerStub }
      // ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // it('should navigate with a provided config',
  //   (inject([Router, Location], (router: Router, location: Location) function() {

  //     // router.navigateByUrl('/simple');
  //     // expect(location.path()).toEqual('/simple');
  //   }));



  describe("get warehouse list and product list as soon as home page appears", function () {
    it("get Warehouse List", function () {
      const warehouse = [{
        id : '1',
        name: 'Mogok'
      }]
      const spy = spyOn(component.productService, "getWarehoustList").and.returnValues(of(warehouse));
      const token = "token";
      const data = {
        type: "GET",
      }
      const headers = new HttpHeaders()
        .set('token', token);
      component.productService.getWarehoustList(data, headers).subscribe((response: Response) => {
        expect(response).not.toBe(null);
      });
    });


    it("get Product List", function () {
      const productList = [{
        name: 'name',
        stock_balance : 'stkBalance',
        price :'price',
        warehouse : 'warehouseId',
        description : 'description',
        image_name : 'image name',
        image_path : 'image path'
      }]
      const spy = spyOn(component.productService, "getProductItemList").and.returnValues(of(productList));
      const token = "token";
      const data = {
        type: "GET",
      }
      const headers = new HttpHeaders()
        .set('token', token);
      component.productService.getProductItemList(data, headers).subscribe((response: Response) => {
        expect(response).not.toBe(null);
      });
    });

  });

});
