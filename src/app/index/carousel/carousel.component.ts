import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';


@Component({
  selector: 'carousel',
  templateUrl:'./carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})

export class Carousel implements OnInit{
  title = 'app works!';
  constructor(private elementRef:ElementRef){}
  
  ngOnInit(){
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "/app/index/carousel/carousel.script.js";
      this.elementRef.nativeElement.appendChild(s);
  }
  
}
