import { Component, AfterViewInit, ElementRef,OnInit, animate, style, state, transition, trigger} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { loginService } from './login.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger("fadeIn", [
      state("open", style({opacity: 1})),
      state("closed", style({opacity: 0,display:'none'})),
      transition("closed <=> open", animate(500)),
    ])
  ],
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
  class="";
  name="";
  logmessage = "Loading... ..";
  message = "Loading... ..";
  statusRegister="closed";
  statusLogin="closed";
  $: any;
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
    var recieveCookie = this._cookieService.getObject('login');
    if(recieveCookie==undefined){
      var data = {
        login:false,
        data:[]
      }
      this._cookieService.putObject('login',data);
      this.checkLog = false;
    }else if(JSON.parse(JSON.stringify(recieveCookie)).login){
       this.name = this.cookiesToJSON('login').data.name;
       this.checkLog = true;
    }
    else{
      this.checkLog = false;
    }

    console.log('login status : ',this.checkLog);

    
  }


   cookiesToJSON(key:string){
     var _key = this._cookieService.getObject(key);
    return JSON.parse(JSON.stringify(_key));
  }


  checkLogin(){
    this.loginService.checkLogin(this.login).subscribe(bool=>{
      this.checkLog=bool.login
      console.log('checklog: ',this.checkLog);
      console.log('checkRegister: ',this.checkRegister);
      if(this.checkLog == true){
        this.logmessage = "login success!";
        this.class="ready";
        this._cookieService.putObject('login',bool);
        this.name= this.cookiesToJSON('login').data.name;
        console.log(this._cookieService.getObject('login'));
        this.login={
          username:"",
          password:""
        };
        this.statusLogin="open";
      
        setTimeout(() => {  
          this.statusLogin="closed";
        }, 700);
      }
      else if(this.checkLog==false){
        this.checkLog=false;
        this.logmessage = "wrong Username or Password!";
        this.class="ready";
              this.statusLogin="open";
      
        setTimeout(() => {  
          this.statusLogin="closed";
        }, 700);
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
        
        console.log('CheckRegister : ',this.checkRegister);
        console.log('add class : ',this.class);
              this.statusRegister="open";
      
      setTimeout(() => {  
        this.statusRegister="closed";
      }, 700);
      }
      else {
        this.message = "Sorry, This username has already used!";
              this.statusRegister="open";
      
      setTimeout(() => {  
        this.statusRegister="closed";
      }, 700);
      }

    });
    
  }

  signOut(){
   
    this._cookieService.putObject('login',{
      login:false,
      data:[]
    })
    console.log('sign out');
     this.checkLog=false;
  }






  
  
}
