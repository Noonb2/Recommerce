import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app works!';
  constructor(private elementRef:ElementRef){}
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
  
}
