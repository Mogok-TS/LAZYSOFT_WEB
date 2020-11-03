import { Component, OnInit } from '@angular/core';
import { WarehouseService } from 'src/app/warehouse_services/warehouse.service'; 
import { ProductService } from 'src/app/services/product.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncryptService } from 'src/app/encryption-service/encrypt.service';
import { HttpHeaders } from '@angular/common/http';
import { ImageCompressorService, CompressorConfig } from 'ngx-image-compressor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-addition',
  templateUrl: './product-addition.component.html',
  styleUrls: ['./product-addition.component.css']
})

export class ProductAdditionComponent implements OnInit {

  constructor(
    private warehouseService: WarehouseService,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private encryptService: EncryptService,
    private imageCompressor: ImageCompressorService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.warehouse = this.warehouseService.getWarehouseList();
    this.encryptedToken = '' + sessionStorage.getItem("token");
    this.token = this.encryptService.decrypt(this.encryptedToken);
    this.headers = new HttpHeaders()
      .set('token', this.token);
    this.form = this.fb.group({
      name: ['', [
        Validators.required,]],
      stock_balance: ['', [
        Validators.required,]],
      price: ['' , [
        Validators.required,]],
      warehouse: ['', [
        Validators.required,]],
      description: ['', [
        Validators.required,]],
    });
  }

  form: FormGroup;
  token: any;
  encryptedToken: any;
  warehouse: any;
  imageObj: File;
  imageUrl: any;
  warnMessage = false;
  successMessage = false;
  messageText = '';
  headers: any;

  stockValidate = true;
  priceValidate = true;


  async submit(){
    if(!this.form.valid){
      this.showMessage("warn", "Please fill all the required fields.");
    }
    else if(this.checkImage() == false){
      this.showMessage("warn", "Please select thumbnail photo.");
    }
    else if(this.stockValidate == false){
      this.showMessage("warn", "Stock balance should be numbers only.");
    }
    else if(this.priceValidate == false){
      this.showMessage("warn", "Price should be numbers only.");
    }
    else{
      this.spinner.show();
      if (this.imageObj.size > 1048576) {
        this.imageObj = await this.compressImage(this.imageObj);
      }
      const form = new FormData();
      form.append('image', this.imageObj);
      form.append('name', this.form.value.name);
      form.append('stock_balance', this.form.value.stock_balance);
      form.append('price', this.form.value.price);
      form.append('warehouse', this.form.value.warehouse);
      form.append('description', this.form.value.description);
      form.append('type', 'POST');

      this.productService.addNewProductItem(form, this.headers)
      .subscribe(
        response => {
          this.form.reset();
          this.imageObj = null;
          this.imageUrl = null;
          this.priceValidate = true;
          this.stockValidate = true;
          this.spinner.hide();
          this.showMessage("success", "Successfully added.");
        },
        error => {
          this.spinner.hide();
          console.log(error);
        }
      )
    }
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

  checkImage(){
    if(this.imageObj == null){
      return false;
    }
    else {
      return true;
    }
  }


  validateStockBalance(){
    const regularExpression = /^[-\s0-9၀-၉]*$/;
    this.stockValidate = regularExpression.test(String(this.form.value.stock_balance).toLowerCase());
  }

  validatePrice(){
    const regularExpression = /^[-\s0-9၀-၉]*$/;
    this.priceValidate = regularExpression.test(String(this.form.value.price).toLowerCase());
  }

  showMessage(type, text): void{
    if(type == "warn"){
      this.warnMessage = true;
      this.successMessage = false;
      this.messageText = text;
      setTimeout(() => {
        this.warnMessage = false;
      }, 4000);
    }
    else{
      this.successMessage = true;
      this.warnMessage = false;
      this.messageText = text;
      setTimeout(() => {
        this.successMessage = false;
      }, 4000);
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

  redirectHome():void{
    this.router.navigate(['/home']);
  }

}
