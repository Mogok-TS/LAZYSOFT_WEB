import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductListComponent } from './product-list.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, NgxPaginationModule],
      declarations: [ ProductListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  describe("get warehouse list and product list as soon as home page appears", function () {
    it("get Warehouse List", function () {
      const warehouse = {
        id : '1',
        name: 'Mogok'
      }
      fixture.detectChanges();
      const spy = spyOn(component.productService, "getWarehoustList").and.returnValues(of(JSON.stringify(warehouse)));
      const token = "token";
      const data = {
        type: "GET",
      }
      const headers = new HttpHeaders()
        .set('token', token);
      component.getWarehouseList();
      expect(component.getWarehouseList).toHaveBeenCalled;
      // component.productService.getWarehoustList(data, headers).subscribe((response: Response) => {
      //   expect(response).not.toBe(null);
      // });
    });
  }); 

});
