import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { ProductService } from './product.service';
import { of } from 'rxjs';

const baseUrl = 'http://localhost:5000/module001/';

describe('ProductServicesService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // auth test
  it('should perform a post to /auth with email and password', () => {
    const user = {
      email : 'email',
      password: 'password',
      type: 'POST'
    }
    const httpClientStub: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
      'http',
      ['post']
    );
    const authService = new ProductService(httpClientStub);
    httpClientStub.post.and.returnValue(of());
    authService.login(user);
    expect(httpClientStub.post).toHaveBeenCalledWith(`${baseUrl}/account/login`, user);
  });

  // product addition test
  it('should perform a post to /items/add with form data and headers', () => {
    const token = "token";
    const form = new FormData();
    const headers = new HttpHeaders()
      .set('token', token);
    const httpClientStub: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
      'http',
      ['post']
    );
    const service = new ProductService(httpClientStub);
    httpClientStub.post.and.returnValue(of());
    service.addNewProductItem(form, headers);
    expect(httpClientStub.post).toHaveBeenCalledWith(`${baseUrl}/items/add`, form ,{headers: headers});
  });

  // get product list test
  it('should perform a post to /items/getall with data and headers', () => {
    const token = "token";
    const data = {
      type: "GET",
    }
    const headers = new HttpHeaders()
      .set('token', token);
    const httpClientStub: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
      'http',
      ['post']
    );
    const service = new ProductService(httpClientStub);
    httpClientStub.post.and.returnValue(of());
    service.getProductItemList(data, headers);
    expect(httpClientStub.post).toHaveBeenCalledWith(`${baseUrl}/items/getall`, data, { headers: headers });
  });

  // get a product item test
  it('should perform a post to /items/get with data and headers', () => {
    const token = "token";
    const data = {
      type: "GET",
    }
    const headers = new HttpHeaders()
      .set('token', token);
    const httpClientStub: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
      'http',
      ['post']
    );
    const service = new ProductService(httpClientStub);
    httpClientStub.post.and.returnValue(of());
    service.getProductItem(data, headers);
    expect(httpClientStub.post).toHaveBeenCalledWith(`${baseUrl}/items/get`, data, { headers: headers });
  });

  // update product test
  it('should perform a post to /items/get with data and headers', () => {
    const token = "token";
    const data = {
      type: "UPDATE",
    }
    const headers = new HttpHeaders()
      .set('token', token);
    const httpClientStub: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
      'http',
      ['post']
    );
    const service = new ProductService(httpClientStub);
    httpClientStub.post.and.returnValue(of());
    service.updateProductItem(data, headers);
    expect(httpClientStub.post).toHaveBeenCalledWith(`${baseUrl}/items/update`, data, { headers: headers });
  });


  // delete product test
  it('should perform a post to /items/get with data and headers', () => {
    const token = "token";
    const data = {
      type: "DELETE",
    }
    const headers = new HttpHeaders()
      .set('token', token);
    const httpClientStub: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
      'http',
      ['post']
    );
    const service = new ProductService(httpClientStub);
    httpClientStub.post.and.returnValue(of());
    service.deleteProductItem(data, headers);
    expect(httpClientStub.post).toHaveBeenCalledWith(`${baseUrl}/items/delete`, data, { headers: headers });
  });

});
