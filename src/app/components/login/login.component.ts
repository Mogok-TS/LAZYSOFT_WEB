import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncryptService } from 'src/app/encryption-service/encrypt.service';
import { ProductService } from 'src/app/services/product.service';
import * as CryptoJS from '../../../../node_modules/crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public productService: ProductService,
    private encryptService: EncryptService,
  ) { }

  form: FormGroup;
  message = false;
  messageText = '';
  token: any;
  user = {
    email: '',
    password: '',
    type: 'POST',
  }
  encPassword = "k#yF0^#nc^ypt?0#"
  test: any;
  emailFocus = false;
  passwordFocus = false;


  ngOnInit(): void {

    


    this.form = this.fb.group({
      email: ['', [
        Validators.required,]],
      password: ['', [
        Validators.required,]],
    });
  }

  login(): void{
    if(!this.form.valid){
      this.showMessage("Please fill all the fields!");
    }
    else{
      this.user.email = this.form.value.email;
      this.user.password = this.form.value.password;
      this.productService.login(this.user)
      .subscribe(
        response => {
          this.token = this.encryptService.encrypt(response["token"]);
          sessionStorage.setItem("token", this.token);
          this.router.navigate([`/home`]);
        },
        error => {
          if(error.status == 404){
            this.showMessage("User not found.");
          }
          else if(error.status == 403){
            this.showMessage("Incorrect password.");
          }
          else{
            this.showMessage("Internal server error.");
          }
        }
      )
    }
  }

  showMessage(text){
    this.message = true;
    this.messageText = text;
    if(this.message = true){
      setTimeout(() => {
        this.message = false;
      }, 4000);
    }
  }

  focusEmail(): void{
    this.emailFocus = true;
  }
  focusoutEmail(): void{
    this.emailFocus = false;
  }

  focusPassword(): void {
    this.passwordFocus = true;
  }
  focusoutPassword(): void {
    this.passwordFocus = false;
  }


  closeMessage(){
    this.message = false;
  }

}
