import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptService } from 'src/app/encryption-service/encrypt.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

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
  p: number = 1;
  showPagination = false;
  searchFocus = false;


  ngOnInit(): void {
    this.encryptedToken = '' + sessionStorage.getItem("token");
    this.token = this.encryptService.decrypt(this.encryptedToken);
    console.log("--->>" + this.token);
    this.headers = new HttpHeaders()
      .set('token', this.token);

    this.getWarehouseList();
    this.getProductItemList();
  }

  // redirect user to new product addition page
  addNewProduct(): void{
     this.router.navigate(['/home/product-addition']);
  }

  //redirect user to product edition page
  editPage(id): void {
    this.router.navigate([`/home/product-edition/${id}`]);
  }

  //redirect user to product detail page
  productDetail(id): void{
    this.router.navigate([`/home/product-detail/${id}`]);
  }



  //Get warehouse list
  getWarehouseList(): void {
    const data = {
      'type': 'GET'
    }
    this.productService.getWarehoustList(data, this.headers)
      .subscribe(
        data => {
          this.warehouse = data['data'];
        },
        error => {
          console.log(error);
        }
      )
  }

  // getting product item list
  getProductItemList(): void{
    const data = {
      type : 'GET',
    }

    // get product item list from database through api
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
  
        //checking there is product data or not
        if(this.displayList.length > 0)
        {
          this.noData = false;
        }
        else{
          this.noData = true;
        }

        //checking if the pagination control should display or not
        if (this.displayList.length > 12) {
          this.showPagination = true;
        }
        else {
          this.showPagination = false;
        }

      },
      error => {
        console.log(error);
      }
    )
  }

  // deleting product item
  deleteItem(id): void{
    const data = {
      itemID : id,
      type: "DELETE",
    }

    //delete product from database through api
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

  //if user types in search bar 
  searchBar(): void{
    this.searchData = [];
    if (this.search != '') {
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].name.replace(/\s/g, "").toLowerCase().includes(this.search.replace(/\s/g, "").toLowerCase()) ||
          this.productList[i].price.toString().replace(/\s/g, "").toLowerCase().includes(this.search.replace(/\s/g, "").toLowerCase()) ||
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

    //checking if there is no data or not 
    if(this.displayList.length > 0 ){
      this.noData = false;
    }
    else{
      this.noData = true;
    }

    //checking if the pagination control should display or not
    if (this.displayList.length > 12) {
      this.showPagination = true;
    }
    else {
      this.showPagination = false;
    }
  }

  // confirmation box for deleting items
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

  // for search box input focus design
  focusSearch(){
    this.searchFocus = true;
  }
  focusoutSearch(){
    this.searchFocus = false;
  }

}
