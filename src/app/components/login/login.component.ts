import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  email = '';
  password = '';
  message = false;
  messageText = '';
  title = 'I love pizza!'

  login(): void{
    if(this.email == '' || this.password == ''){
      this.message = true;
      this.messageText = "Please fill all the fields";
      setTimeout(() => {
        this.message = false;
      }, 4000);
    }
    else{
      this.router.navigate(['/home']);
    }
  }

}
