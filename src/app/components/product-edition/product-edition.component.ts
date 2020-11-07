import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptService } from 'src/app/encryption-service/encrypt.service';
import { ProductService } from 'src/app/services/product.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ImageCompressorService, CompressorConfig } from 'ngx-image-compressor';

@Component({
  selector: 'app-product-edition',
  templateUrl: './product-edition.component.html',
  styleUrls: ['./product-edition.component.css']
})
export class ProductEditionComponent implements OnInit {

  constructor(
    private encryptService: EncryptService,
    private router: Router,
    public productService: ProductService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private imageCompressor: ImageCompressorService,
  ) {  }

  ngOnInit(): void {
    this.encryptedToken = '' + sessionStorage.getItem("token");
    this.token = this.encryptService.decrypt(this.encryptedToken);
    this.encryptedItemId = '' + this.route.snapshot.paramMap.get('id');
    this.itemID = this.encryptService.decrypt(this.encryptedItemId.replace(new RegExp('###', 'g'), "/"));

    //set token to http headers
    this.headers = new HttpHeaders()
      .set('token', this.token);
    this.getWarehouseList();

    //form validation
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
  encryptedItemId: any;
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
  product: any;

  name: any;
  stock_balance: any;
  price: any;
  warehouse: any;
  description: any;
  status: any;


  //Get warehouse list
  getWarehouseList(): void {
    const data = {
      'type': 'GET'
    }
    this.productService.getWarehoustList(data, this.headers)
      .subscribe(
        data => {
          this.warehouseList = data['data'];
          this.getProductItem();
        },
        error => {
          console.log(error);
        }
      )
  }

  // get the product data
  getProductItem(): void{
    const data = {
      type: "GET",
      itemID: this.itemID,
    }

    //get product data from database
    this.productService.getProductItem(data, this.headers)
    .subscribe(
      data => {
        this.product = data;
        this.name = data.name;
        this.stock_balance = data.stock_balance;
        this.price = data.price;
        for(let index = 0 ; index < this.warehouseList.length; index++){
          if(data.warehouse == this.warehouseList[index]["id"]){
            this.warehouse = this.warehouseList[index]["name"];
          }
        }
        this.description = data.description;
        this.imageUrl = this.productService.getImageLink(data.image_path);
        this.oldImage = data.image_name;
        this.form.patchValue({
          name : data.name,
          stock_balance : data.stock_balance,
          price: data.price,
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

  // store the image user selected
  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    if (FILE.type.toString() == "image/png" || FILE.type.toString() == "image/jpeg" || FILE.type.toString() == "image/jpg") {
      this.preview(FILE);
      this.imageObj = FILE;
    }
    else {
      this.showMessage("warn", "Image type can only be accepted!")
    }
  }

  // for previewing the image user has selected
  preview(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
  }

  // for validating stock balance to be numbers only
  validateStockBalance() {
    const regularExpression = /^[-\s0-9၀-၉]*$/;
    this.stockValidate = regularExpression.test(String(this.form.value.stock_balance).toLowerCase());
  }

  //validate text area
  validate() {
    var re = /<(\"[^\"]*\"|'[^']*'|[^'\">])*>/;
    return re.test(String(this.form.value.description).toLowerCase());
  }

  // for validating price to be number only
  validatePrice() {
    const regularExpression = /^[-\s0-9၀-၉]*$/;
    this.priceValidate = regularExpression.test(String(this.form.value.price).toLowerCase());
  }

  // for showing warning and success message box
  showMessage(type, text): void {
    if (type == "warn") {
      this.warnMessage = true;
      this.successMessage = false;
      this.messageText = text;
      if(this.warnMessage = true){
        setTimeout(() => {
          this.warnMessage = false;
        }, 4000);
      }
    }
    else {
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

  // updating the edited product details
  async submit(){

    // checking form is valid or nor
    if (!this.form.valid) {
      this.showMessage("warn", "Please fill all the required fields.");
    }

    // checking stock balance is numbers only or not
    else if (this.stockValidate == false) {
      this.showMessage("warn", "Stock balance should be numbers only.");
    }

    // checking price is number only or not
    else if (this.priceValidate == false) {
      this.showMessage("warn", "Price should be numbers only.");
    }

    else if (this.validate() == true) {
      this.showMessage("warn", "No script text allowed");
    }

    //  user has selected an image to update
    else if(this.imageObj != null){
      this.spinner.show();

      // compress image size if it is larger than 1Mb
      if (this.imageObj.size > 1048576) {
        this.imageObj = await this.compressImage(this.imageObj);
      }

      // to check if the product already exist in database or not
      if(this.form.value.name == this.name && this.form.value.warehouse == this.warehouse){
        this.status = '1';
      }
      else{
        this.status = '2';
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
      form.append('status', this.status);
      form.append('type', 'UPDATE');

      // update data of product details through api
      this.productService.updateProductItem(form, this.headers)
        .subscribe(
          response => {
            this.spinner.hide();
            this.redirectHome();
          },
          error => {
            this.spinner.hide();
            console.log(error);
          }
        )
    }

    //user did not select an image to update
    else if(this.imageObj == null){

      if (this.form.value.name == this.name && this.form.value.warehouse == this.product.warehouse) {
        this.status = '1';
      }
      else {
        this.status = '2';
      }

      this.spinner.show();
      const form = new FormData();
      form.append('itemID', this.itemID);
      form.append('name', this.form.value.name);
      form.append('stock_balance', this.form.value.stock_balance);
      form.append('price', this.form.value.price);
      form.append('warehouse', this.form.value.warehouse);
      form.append('description', this.form.value.description);
      form.append('imageName', this.oldImage)
      form.append('status', this.status);
      form.append('type', 'UPDATE');

      // update data of product details through api
      this.productService.updateProductItem(form, this.headers)
        .subscribe(
          response => {
            this.spinner.hide();
            this.router.navigate(['/home/product-list']);
          },
          error => {
            this.spinner.hide();
            if (error.status == 403) {
              this.showMessage("warn", "This product already exists in this warehouse!");
            }
            else{
              this.showMessage("warn", "Internal Server Error!");
            }
          }
        )
    }
  }

  // for compressing image size
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
  redirectHome(): void {
    this.router.navigate(['/home']);
  }



  // close message box
  closeMessage() {
    this.warnMessage = false;
    this.successMessage = false;
  }

}
