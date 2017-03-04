import { Component, AfterViewInit, ElementRef } from '@angular/core';


@Component({
  selector: 'index',
  templateUrl:'./index.component.html',
  styleUrls: ['./index.component.css'],
})

export class Indexpage {
  title = 'app works!';
  constructor(private elementRef:ElementRef){}
  ngAfterViewInit(){
      // var s = document.createElement("script");
      // s.type = "text/javascript";
      // s.src = "/app/app.script.js";
      // this.elementRef.nativeElement.appendChild(s);
  }
  
}
