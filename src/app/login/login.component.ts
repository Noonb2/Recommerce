// import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs/Observable';

// @Component({
//   selector: 'login',
//   templateUrl: 'login.component.html',
//   styleUrls: ['login.component.css']
// })

// export class Login implements OnInit{
//   title = 'app works!';
//   constructor(private elementRef:ElementRef){}
//   ngAfterViewInit(){
//       var s = document.createElement("script");
//       s.type = "text/javascript";
//       s.src = "./login/login.script.js";
//       this.elementRef.nativeElement.appendChild(s);
//   }
//   ngOnInit(){
//       this.sub = this.route.params.subscribe(params => {
//           this.login = params['login'];
//       })
//   }
//}
