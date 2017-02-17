import { Component, AfterViewInit, ElementRef,OnInit } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { loginService } from './login.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app works!';
  usernameLogin:string;
  passwordLogin:string;
  checkLog:boolean;
  checkRegister:boolean;
  usernameRegis:string;
  passwordRegis:string;
  name:string;
  gender:string;
  testvar = true;
  message = "register success!"
  constructor(private elementRef:ElementRef,
              private _cookieService:CookieService,
              private loginService:loginService,
    ){}


  ngAfterViewInit(){
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "./app/app.script.js";
      this.elementRef.nativeElement.appendChild(s);

      var l = document.createElement("script");
      l.type = "text/javascript";
      l.src = "./app/login.script.js";
      this.elementRef.nativeElement.appendChild(l);
  }
  

  ngOnInit(){
    // this.checkLog = Boolean(this._cookieService.getObject('login'));
    // if(this.checkLog==undefined){
    //   this._cookieService.putObject('login',false);
    //   this.checkLog = false;
    // }
    
  }


   cookiesToJSON(key:string){
     var _key = this._cookieService.getObject(key);
    return JSON.parse(JSON.stringify(_key));
  }


  checkLogin(){
    this.loginService.checkLogin(this.usernameLogin,this.passwordLogin).subscribe(bool=>this.checkLogin=bool);
    console.log(this.checkLog);
  }
  register(){
    this.loginService.register(this.usernameRegis,this.passwordRegis,this.name,this.gender).subscribe(bool =>this.checkRegister=bool);
    console.log(this.checkRegister);
  }

  test(){
    this.testvar = !this.testvar;
    if(this.testvar == true){
      this.message = "register success!";
    }
    else {
      this.message = "existing account!";
    }
    
  }

  
  
}
