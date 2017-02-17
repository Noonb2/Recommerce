import { Component, AfterViewInit, ElementRef,OnInit } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app works!';

  constructor(private elementRef:ElementRef,
              private _cookieService:CookieService,
    ){}


  ngAfterViewInit(){
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "./app/app.script.js";
      this.elementRef.nativeElement.appendChild(s);
  }
  

  ngOnInit(){
    var test = this._cookieService.get('login');
    // var test = this.cookiesToJSON('login');
    console.log(test);
   
  }

   cookiesToJSON(key:string){
     var _key = this._cookieService.getObject(key);
    return JSON.parse(JSON.stringify(_key));
  }


  
}
