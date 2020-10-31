import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptService } from 'src/app/encryption-service/encrypt.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(
    private router: Router,
    private encryptService: EncryptService,
    private productService: ProductService,
  ) { }

  token: any;
  encryptedToken: any;
  headers: any;
  productList: any;

  ngOnInit(): void {
    this.encryptedToken = sessionStorage.getItem("token");
    this.token = this.encryptService.decrypt(this.encryptedToken);
    this.headers = new HttpHeaders()
      .set('token', this.token);
    this.getProductItemList();
  }

  addNewProduct(): void{
     this.router.navigate(['/home/product-addition']);
  }

  getProductItemList(): void{
    const data = {
      type : 'GET',
    }
    this.productService.getProductItemList(data, this.headers)
    .subscribe(
      data => {
        this.productList = data;
        console.log(this.productList);
      },
      error => {
        console.log(error);
      }
    )
  }

  deleteItem(id): void{
    const data = {
      id : id,
      type: "DELETE",
    }
    this.productService.deleteProductItem(data, this.headers)
    .subscribe(
      response => {
        console.log("Deleted successfully!");
        this.getProductItemList();
      },
      error =>{
        console.log(error);
      }
    )
  }

  editPage(id): void{
    this.router.navigate([`/home/product-edition/${id}`]);
  }

}
