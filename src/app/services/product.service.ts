import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//To Change API Service Domain Name
// Please , don't add '/' at the end of the url
const baseUrl = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  //Display Image
  getImageLink(img_path){
    return `${baseUrl}/${img_path}`;
  }

  //Login authentication
  login(user): Observable<any> {
    return this.http.post(`${baseUrl}/module001/account/login`, user);
  }

  //Add a new product item
  addNewProductItem(form, headers): Observable<any> {
    return this.http.post(`${baseUrl}/module001/items/add`, form, {headers: headers});
  }

  //Get the list of product items
  getProductItemList(data, headers): Observable<any> {
    return this.http.post(`${baseUrl}/module001/items/getall`, data, {headers: headers});
  }

  //Get product item by id
  getProductItem(data, headers): Observable<any> {
    return this.http.post(`${baseUrl}/module001/items/get`, data, { headers: headers });
  }

  //delete product item
  deleteProductItem(data, headers): Observable<any> {
    return this.http.post(`${baseUrl}/module001/items/delete`, data, { headers: headers });
  }

  //update product item
  updateProductItem(form, headers): Observable<any> {
    return this.http.post(`${baseUrl}/module001/items/update`, form, { headers: headers });
  }

  //get warehouse list
  getWarehoustList(data, headers): Observable<any>{
    return this.http.post(`${baseUrl}/module001/warehouse/getAll`, data , { headers: headers });
  }


}
