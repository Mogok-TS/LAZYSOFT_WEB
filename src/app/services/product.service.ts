import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:5000/module001/';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  //Login authentication
  login(user): Observable<any> {
    return this.http.post(`${baseUrl}/account/login`, user);
  }

  //Add a new product item
  addNewProductItem(form, headers): Observable<any> {
    return this.http.post(`${baseUrl}/items/add`, form, {headers: headers});
  }

  //Get the list of product items
  getProductItemList(data, headers): Observable<any> {
    return this.http.post(`${baseUrl}/items/getall`, data, {headers: headers});
  }

  //Get product item by id
  getProductItem(data, headers): Observable<any> {
    return this.http.post(`${baseUrl}/items/get`, data, { headers: headers });
  }

  //delete product item
  deleteProductItem(data, headers): Observable<any> {
    return this.http.post(`${baseUrl}/items/delete`, data, { headers: headers });
  }

  //update product item
  updateProductItem(form, headers): Observable<any> {
    return this.http.post(`${baseUrl}/items/update`, form, { headers: headers });
  }

  //get warehouse list
  getWarehoustList(data, headers): Observable<any>{
    return this.http.post(`${baseUrl}/warehouse/getAll`, data , { headers: headers });
  }


}
