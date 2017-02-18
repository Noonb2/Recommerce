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
  login={
    username:"",
    password:""
  }
  reg={
    username:"",
    password:"",
    name:"",
    email:"",
    gender:""
  }
  logmessage = "Please fill up the form!";
  message = "Please fill up the form!";
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
    this.loginService.checkLogin(this.login).subscribe(bool=>{
      this.checkLog=bool
      console.log(this.checkLog);
      if(this.checkLog == true){
        this.logmessage = "login success!";
        
      }
      else if(this.checkLog==false){
        this.logmessage = "wrong Username or Password!";
      }


    });
    
  }
  register(){
    this.loginService.register(this.reg).subscribe(res =>{
      this.checkRegister=res;
      console.log(this.checkRegister);
      if(this.checkRegister){
        this.message = "register success!";
        this.reg={
        username:"",
        password:"",
        name:"",
        email:"",
        gender:""
        }
      }
      else {
        this.message = "Sorry, This username has already used!";
      }
      
    });
    
  }




  
  
}
