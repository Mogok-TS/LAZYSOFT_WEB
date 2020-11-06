import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    // check token available or not, if not "Log out" immediately
    if(sessionStorage.getItem("token") == null || sessionStorage.getItem("token") == ''){
      this.router.navigate(['/login']);
    }
  }
  
  // logout function
  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  //Scroll to top on page load
  onActivate(event) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }

}
