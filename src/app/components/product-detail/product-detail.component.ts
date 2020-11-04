import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptService } from 'src/app/encryption-service/encrypt.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private encryptService : EncryptService,
  ) { }

  ngOnInit(): void {
    this.encryptedToken = '' + sessionStorage.getItem("token");
    this.token = this.encryptService.decrypt(this.encryptedToken);
    this.itemID = this.route.snapshot.paramMap.get('id');

    //set token to http header
    this.headers = new HttpHeaders()
      .set('token', this.token);

    this.getWarehouseList();
    this.getProductItem();
  }

  itemID: any;
  warehouseList: any;
  encryptedToken: any;
  token: any;
  headers: any;
  imageUrl: any;
  productList = {
    name : '',
    stockBalance: '',
    price : '',
    warehouse: '',
    description: ''
  }

  // redirect user to home page
  redirectHome(): void{
    this.router.navigate(['/home']);
  }

  //Get warehouse list
  getWarehouseList(): void {
    const data = {
      'type': 'GET'
    }
    this.productService.getWarehoustList(data, this.headers)
      .subscribe(
        data => {
          this.warehouseList = data['data'];
        },
        error => {
          console.log(error);
        }
      )
  }

  // get product data
  getProductItem(): void {
    const data = {
      type: "GET",
      itemID: this.itemID,
    }

    //get product data from database
    this.productService.getProductItem(data, this.headers)
      .subscribe(
        data => {
          for (let index = 0; index < this.warehouseList.length; index++) {
            if (data.warehouse == this.warehouseList[index]["id"]) {
              this.productList.warehouse = this.warehouseList[index]["name"];
            }
          }
          this.productList.name = data.name;
          this.productList.price = data.price;
          this.productList.stockBalance = data.stock_balance;
          this.productList.description = data.description;
          this.imageUrl = `http://localhost:5000/${data.image_path}`;
        },
        error => {
          console.log(error);
        }
      )
  }

}
