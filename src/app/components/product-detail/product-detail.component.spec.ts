import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductDetailComponent } from './product-detail.component';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ ProductDetailComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("get Product Details", function () {
    const product = {
      name: 'name',
      stock_balance: 'stkBalance',
      price: 'price',
      warehouse: 'warehouseId',
      description: 'description',
      image_name: 'image name',
      image_path: 'image path'
    }
    const spy = spyOn(component.productService, "getProductItem").and.returnValues(of(product));
    const token = "token";
    const data = {
      type: "GET",
    }
    const headers = new HttpHeaders()
      .set('token', token);
    component.productService.getProductItem(data, headers).subscribe((response: Response) => {
      expect(response).not.toBe(null);
    });
  });
  
});
