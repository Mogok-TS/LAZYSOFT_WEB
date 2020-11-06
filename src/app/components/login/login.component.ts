import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncryptService } from 'src/app/encryption-service/encrypt.service';
import { ProductService } from 'src/app/services/product.service';

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

    // check token available or not, if yes , go to home page
    if (sessionStorage.getItem("token") != null && sessionStorage.getItem("token") != '') {
      this.router.navigate(['/home']);
    }

    //Form validation check
    this.form = this.fb.group({
      email: ['', [
        Validators.required,]],
      password: ['', [
        Validators.required,]],
    });
  }

  // Authenticate user login 
  login(): void{

    // Check form is valid or not
    if(!this.form.valid){
      this.showMessage("Please fill all the fields!");
    }
    else{
      this.user.email = this.form.value.email;
      this.user.password = this.form.value.password;

      // check user in database 
      this.productService.login(this.user)
      .subscribe(
        
        //when user is valid or exist
        response => {
          this.token = this.encryptService.encrypt(response["token"]);
          sessionStorage.setItem("token", this.token);
          this.homePage();
        },

        // User not exist or password wrong
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

  //let the user to go home page
  homePage(): void{
    this.router.navigate([`/home`]);
  }

  //show warning message box
  showMessage(text){
    this.message = true;
    this.messageText = text;
    if(this.message = true){
      setTimeout(() => {
        this.message = false;
      }, 4000);
    }
  }

  //for input focus designs
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

  // for closing warning message box
  closeMessage(){
    this.message = false;
  }

}
