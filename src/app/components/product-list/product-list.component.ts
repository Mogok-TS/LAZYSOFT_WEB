import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    public productService: ProductService,
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
  searchFocus = false;
  deleteName = '';
  currentID : any;


  ngOnInit(): void {
    this.encryptedToken = '' + sessionStorage.getItem("token");
    this.token = this.encryptService.decrypt(this.encryptedToken);
    this.headers = new HttpHeaders()
      .set('token', this.token);

    this.getWarehouseList();
    console.log(this.p);
  }

  // redirect user to new product addition page
  addNewProduct(): void{
     this.router.navigate(['/home/product-addition']);
  }

  //redirect user to product edition page
  editPage(id): void {
    var encryptedId = this.encryptService.encrypt(id.toString());
    this.router.navigate([`/home/product-edition/${encryptedId.replace(new RegExp('/', 'g'), "###")}`]);
  }

  //redirect user to product detail page
  productDetail(id): void{
    var encryptedId = this.encryptService.encrypt(id.toString());
    this.router.navigate([`/home/product-detail/${encryptedId.replace(new RegExp('/', 'g'), "###")}`]);
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
          this.getProductItemList();
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
        var i = 0;
        this.productList.forEach((item) => { 
          this.productList[i].image_path = this.productService.getImageLink(item.image_path);
          for (let i = 0; i < this.warehouse.length; i++) {
            if (item.warehouse.toString() == this.warehouse[i]['id']) {
              item.warehouse = this.warehouse[i]['name'];
              console.log(item.warehouse);
            }
          };
          i++;
        });

        this.displayList = this.productList;
        console.log(this.displayList);

        if (this.productList.length % 12 == 0) {
          this.p = 1;
        }
  
        //checking there is product data or not
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
  }

  // confirmation box for deleting items
  confirmBox(item) {
    this.currentID = item.itemID;
    this.deleteName = item.name
  }

  // for search box input focus design
  focusSearch(){
    this.searchFocus = true;
  }
  focusoutSearch(){
    this.searchFocus = false;
  }

}
