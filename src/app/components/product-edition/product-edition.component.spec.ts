import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductEditionComponent } from './product-edition.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxImageCompressorModule } from 'ngx-image-compressor';
import { ImageCompressorService } from 'ngx-image-compressor';


describe('ProductEditionComponent', () => {
  let component: ProductEditionComponent;
  let fixture: ComponentFixture<ProductEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, NgxImageCompressorModule],
      declarations: [ ProductEditionComponent ],
      providers: [ImageCompressorService]
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
});
