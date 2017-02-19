import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'itemCart',
  templateUrl: './itemCart.component.html',
  styleUrls: ['./itemCart.component.css']
})

export class itemCart implements OnInit{
    mycart:string;
    private cart:any;
    title = 'app works!';
    
    constructor(
         private elementRef:ElementRef,
         private route:ActivatedRoute){}
    
    ngAfterViewInit(){
        var q = document.createElement("script");
        q.type = "text/javascript";
        q.src = "./app/myCart/itemCart/quantity.script.js"
        this.elementRef.nativeElement.appendChild(q);
    }
    
    ngOnInit(){
        this.cart = this.route.params.subscribe(params => { this.mycart = params['myCart']});
    }

 
    
}