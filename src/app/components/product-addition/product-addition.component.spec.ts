import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductAdditionComponent } from './product-addition.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxImageCompressorModule } from 'ngx-image-compressor';
import { ImageCompressorService } from 'ngx-image-compressor';
import { RouterTestingModule } from '@angular/router/testing';


describe('ProductAdditionComponent', () => {
  let component: ProductAdditionComponent;
  let fixture: ComponentFixture<ProductAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, NgxImageCompressorModule, RouterTestingModule],
      declarations: [ ProductAdditionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ImageCompressorService],
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

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('stock balance should be numbers only'), () => {
    let stockBalance = component.form.controls['stock_balance'];
    stockBalance.setValue("12345");
    expect(stockBalance).toMatch("/^[-\s0-9၀-၉]*$/");
  }

  it('Price balance should be numbers only'), () => {
    let stockBalance = component.form.controls['price'];
    expect(stockBalance).toMatch("/^[-\s0-9၀-၉]*$/");
  }
});
