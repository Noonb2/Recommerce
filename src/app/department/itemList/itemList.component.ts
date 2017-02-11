import { Component, AfterViewInit, ElementRef } from '@angular/core';
import {itemListService} from './itemList.service';
@Component({
  selector: 'itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css']
})

export class itemList {

    title = 'app works!';
    data = [];
    constructor(private elementRef:ElementRef,private itemlistService:itemListService){}
    ngAfterViewInit(){
        // var s = document.createElement("script");
        // s.type = "text/javascript";
        // s.src = "/app/app.script.js";
        // this.elementRef.nativeElement.appendChild(s);
    }
    ngOnInit(){
        this.itemlistService.getItem().subscribe(data => this.data =data);
        
    }
  
}
