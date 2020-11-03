import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptService } from 'src/app/encryption-service/encrypt.service';
import { ProductService } from 'src/app/services/product.service';
import { WarehouseService } from 'src/app/warehouse_services/warehouse.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as CryptoJS from '../../../../node_modules/crypto-js';

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
    private warehouseService: WarehouseService,
    private route: ActivatedRoute,
  ) { }

  token: any;
  encryptedToken: any;
  headers: any;
  productList: any = [];
  displayList: any;
  search = '';
  searchData : any;
  warehouse: any;
  noData = false;


  ngOnInit(): void {
    this.warehouse = this.warehouseService.getWarehouseList();
    this.encryptedToken = sessionStorage.getItem("token");
    this.token = CryptoJS.AES.decrypt(this.encryptedToken, "MySecretKeyForEncryption&Descryption");
    console.log("--->>" + this.token);
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
        this.productList.forEach((item) => { 
          for (let i = 0; i < this.warehouse.length; i++) {
            if (item.warehouse.toString() == this.warehouse[i]['id']) {
              item.warehouse = this.warehouse[i]['name'];
              console.log(item.warehouse);
            }
          };
        });
        this.displayList = this.productList;
        if(this.displayList.length > 0)
        {
          this.noData = false;
        }
        else{
          this.noData = true;
        }
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

  searchBar(): void{
    this.searchData = [];
    if (this.search != '') {
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].name.replace(/\s/g, "").toLowerCase().includes(this.search.replace(/\s/g, "").toLowerCase()) ||
          this.productList[i].stock_balance.toString().replace(/\s/g, "").toLowerCase().includes(this.search.replace(/\s/g, "").toLowerCase()) || 
          this.productList[i].price.toString().replace(/\s/g, "").toLowerCase().includes(this.search.replace(/\s/g, "").toLowerCase()) ||
          this.productList[i].description.replace(/\s/g, "").toLowerCase().includes(this.search.replace(/\s/g, "").toLowerCase()) ||
          this.productList[i].warehouse.replace(/\s/g, "").toLowerCase().includes(this.search.replace(/\s/g, "").toLowerCase())  
        ) {
          this.searchData.push(this.productList[i]);
        }
      }
      this.displayList = this.searchData;
    }
    else{
      this.displayList = this.productList;
    }
    if(this.displayList.length > 0 ){
      this.noData = false;
    }
    else{
      this.noData = true;
    }
  }

  confirmBox(id) {
    Swal.fire({
      width: 300,
      text: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: '<i class="fa fa-close"></i>',
      confirmButtonText: '<i class="fa fa-check"></i>'
    }).then((result) => {
      if (result.value) {
        this.deleteItem(id);
      }
    })
  }

}
