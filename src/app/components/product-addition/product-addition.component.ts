import { Component, OnInit } from '@angular/core';
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
    public productService: ProductService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private encryptService: EncryptService,
    private imageCompressor: ImageCompressorService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.encryptedToken = '' + sessionStorage.getItem("token");
    this.token = this.encryptService.decrypt(this.encryptedToken);

    // set token to http header
    this.headers = new HttpHeaders()
      .set('token', this.token);
    this.getWarehouseList();
    // form validation 
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


  // submit the product addition form
  async submit(){

    // check form is valid or not
    if(!this.form.valid){
      this.showMessage("warn", "Please fill all the required fields.");
    }

    //check if the user is selected an image or not
    else if(this.checkImage() == false){
      this.showMessage("warn", "Please select thumbnail photo.");
    }

    // check if the stock balance is numbers only or not
    else if(this.stockValidate == false){
      this.showMessage("warn", "Stock balance should be numbers only.");
    }

    else if(this.validate() == true){
      this.showMessage("warn", "No script text allowed");
    }

    // check price is numbers only or not
    else if(this.priceValidate == false){
      this.showMessage("warn", "Price should be numbers only.");
    }
    else{
      this.spinner.show();
      // compress image if the image size is larger than 1Mb
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

      // post data form to database throung api server
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
          if (error.status == 403) {
            this.showMessage("warn", "This product already exists in this warehouse!");
          }
          else {
            this.showMessage("warn", "Internal Server Error!");
          }
        }
      )
    }
  }

  //Get warehouse list
  getWarehouseList(): void{
    const data = {
      'type' : 'GET'
    }
    this.productService.getWarehoustList(data, this.headers)
    .subscribe(
      data => {
        this.warehouse  = data['data'];
        console.log(this.warehouse);
      },
      error => {
        console.log(error);
      }
    )
  }

  // store the image that user selected
  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    if (FILE.type.toString() == "image/png" || FILE.type.toString() == "image/jpeg" || FILE.type.toString() == "image/jpg"){
      this.preview(FILE);
      this.imageObj = FILE;
    }
    else{
      this.showMessage("warn", "Image type can only be accepted!")
    }
  }

  // for previewing the selected image
  preview(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
  }

  // checking if the user is selected an image or not
  checkImage(){
    if(this.imageObj == null){
      return false;
    }
    else {
      return true;
    }
  }

  // validate stock balance to be numbers only
  validateStockBalance(){
    const regularExpression = /^[-\s0-9၀-၉]*$/;
    this.stockValidate = regularExpression.test(String(this.form.value.stock_balance).toLowerCase());
  }

  // validate price to be numbers only
  validatePrice(){
    const regularExpression = /^[-\s0-9၀-၉]*$/;
    this.priceValidate = regularExpression.test(String(this.form.value.price).toLowerCase());
  }

  //validate text area
  validate(){
    var re = /<(\"[^\"]*\"|'[^']*'|[^'\">])*>/;
    return re.test(String(this.form.value.description).toLowerCase());
  }

  // show warning and success message boxes
  showMessage(type, text): void{
    if(type == "warn"){
      this.warnMessage = true;
      this.successMessage = false;
      this.messageText = text;
      if(this.warnMessage == true){
        setTimeout(() => {
          this.warnMessage = false;
        }, 4000);
      }
    }
    else{
      this.successMessage = true;
      this.warnMessage = false;
      this.messageText = text;
      if(this.successMessage = true){
        setTimeout(() => {
          this.successMessage = false;
        }, 4000);
      }
    }
  }

  // compress image size
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

  // redirect user to home page
  redirectHome():void{
    this.router.navigate(['/home']);
  }

  //close message box
  closeMessage(){
    this.warnMessage = false;
    this.successMessage = false;
  }

}
