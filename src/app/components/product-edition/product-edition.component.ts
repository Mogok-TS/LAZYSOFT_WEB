import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptService } from 'src/app/encryption-service/encrypt.service';
import { ProductService } from 'src/app/services/product.service';
import { WarehouseService } from 'src/app/warehouse_services/warehouse.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ImageCompressorService, CompressorConfig } from 'ngx-image-compressor';

@Component({
  selector: 'app-product-edition',
  templateUrl: './product-edition.component.html',
  styleUrls: ['./product-edition.component.css']
})
export class ProductEditionComponent implements OnInit {

  constructor(
    private warehouseService: WarehouseService,
    // private encryptService: EncryptService,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private imageCompressor: ImageCompressorService,
  ) {  }

  ngOnInit(): void {
    this.warehouseList = this.warehouseService.getWarehouseList();
    this.encryptedToken = sessionStorage.getItem("token");
    // this.token = this.encryptService.decrypt(this.encryptedToken);
    this.itemID = this.route.snapshot.paramMap.get('id');
    this.headers = new HttpHeaders()
      .set('token', this.token);
    this.getProductItem();
    this.form = this.fb.group({
      name: ['', [
        Validators.required,]],
      stock_balance: [this.stock_balance, [
        Validators.required,]],
      price: ['', [
        Validators.required,]],
      warehouse: ['', [
        Validators.required,]],
      description: ['', [
        Validators.required,]],
    });
  }
  
  warehouseList: any;
  encryptedToken : any;
  token : any;
  headers: any;
  form : FormGroup;
  imageUrl: any;
  imageObj: File;
  warnMessage = false;
  successMessage = false;
  stockValidate = true;
  priceValidate = true;
  messageText = '';
  itemID: any;
  oldImage: any;

  name: any;
  stock_balance: any;
  price: any;
  warehouse: any;
  description: any;


  getProductItem(): void{
    const data = {
      type: "GET",
      itemID: this.itemID,
    }
    this.productService.getProductItem(data, this.headers)
    .subscribe(
      data => {
        this.name = data.name;
        this.stock_balance = data.stock_balance;
        this.price = data.price;
        for(let index = 0 ; index < this.warehouseList.length; index++){
          if(data.warehouse == this.warehouseList[index]["id"]){
            this.warehouse = this.warehouseList[index]["name"];
          }
        }
        this.description = data.description;
        this.imageUrl = `http://localhost:5000/${data.image_path}`;
        this.oldImage = data.image_name;
        this.form.patchValue({
          name : data.name,
          stock_balance : data.stock_balance,
          price : data.price,
          warehouse : data.warehouse,
          description : data.description,
        });
        this.stockValidate = true;
      },
      error => {
        console.log(error);
      }
    )
  }

  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.preview(FILE);
    this.imageObj = FILE;
  }

  preview(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
  }
  validateStockBalance() {
    const regularExpression = /^[-\s0-9၀-၉]*$/;
    this.stockValidate = regularExpression.test(String(this.form.value.stock_balance).toLowerCase());
  }

  validatePrice() {
    const regularExpression = /^[-\s0-9၀-၉]*$/;
    this.priceValidate = regularExpression.test(String(this.form.value.price).toLowerCase());
  }

  showMessage(type, text): void {
    if (type == "warn") {
      this.warnMessage = true;
      this.successMessage = false;
      this.messageText = text;
      setTimeout(() => {
        this.warnMessage = false;
      }, 4000);
    }
    else {
      this.successMessage = true;
      this.warnMessage = false;
      this.messageText = text;
      setTimeout(() => {
        this.successMessage = false;
      }, 4000);
    }
  }

  async submit(){
    if (!this.form.valid) {
      this.showMessage("warn", "Please fill all the required fields.");
    }
    else if (this.stockValidate == false) {
      this.showMessage("warn", "Stock balance should be numbers only.");
    }
    else if (this.priceValidate == false) {
      this.showMessage("warn", "Price should be numbers only.");
    }
    else if(this.imageObj != null){
      this.spinner.show();
      if (this.imageObj.size > 1048576) {
        this.imageObj = await this.compressImage(this.imageObj);
      }
      const form = new FormData();
      form.append('itemID', this.itemID);
      form.append('image', this.imageObj);
      form.append('name', this.form.value.name);
      form.append('stock_balance', this.form.value.stock_balance);
      form.append('price', this.form.value.price);
      form.append('warehouse', this.form.value.warehouse);
      form.append('description', this.form.value.description);
      form.append('imageName', this.oldImage)
      form.append('type', 'UPDATE');

      this.productService.updateProductItem(form, this.headers)
        .subscribe(
          response => {
            this.spinner.hide();
            this.router.navigate(['/home/product-list']);
          },
          error => {
            this.spinner.hide();
            console.log(error);
          }
        )
    }
    else if(this.imageObj == null){
      this.spinner.show();
      const form = new FormData();
      form.append('itemID', this.itemID);
      form.append('name', this.form.value.name);
      form.append('stock_balance', this.form.value.stock_balance);
      form.append('price', this.form.value.price);
      form.append('warehouse', this.form.value.warehouse);
      form.append('description', this.form.value.description);
      form.append('imageName', this.oldImage)
      form.append('type', 'UPDATE');

      this.productService.updateProductItem(form, this.headers)
        .subscribe(
          response => {
            this.spinner.hide();
            this.router.navigate(['/home/product-list']);
          },
          error => {
            this.spinner.hide();
            console.log(error);
          }
        )
    }
  }

  async compressImage(file) {
    var temp;
    const config: CompressorConfig = { orientation: 1, ratio: 50, quality: 50, enableLogs: true };
    temp = await this.imageCompressor.compressFile(file, config);
    console.warn(temp.size);
    if (temp.size > 1048576) {
      return this.compressImage(temp);
    }
    else {
      return temp;
    }
  }

  redirectHome(): void {
    this.router.navigate(['/home']);
  }

}
