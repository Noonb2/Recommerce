import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css']
})

export class itemlist {
  title = 'app works!';
  constructor(private elementRef:ElementRef){}
  ngAfterViewInit(){
      // var s = document.createElement("script");
      // s.type = "text/javascript";
      // s.src = "/app/app.script.js";
      // this.elementRef.nativeElement.appendChild(s);
  }
  
}
