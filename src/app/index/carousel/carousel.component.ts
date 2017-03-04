import { Component, AfterViewInit, ElementRef } from '@angular/core';


@Component({
  selector: 'carousel',
  templateUrl:'./carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})

export class Carousel {
  title = 'app works!';
  constructor(private elementRef:ElementRef){}
  ngAfterViewInit(){
      // var s = document.createElement("script");
      // s.type = "text/javascript";
      // s.src = "/app/app.script.js";
      // this.elementRef.nativeElement.appendChild(s);
  }
  
}
