
import { Component, AfterViewInit, ElementRef, OnInit, animate, style, state, transition, trigger } from '@angular/core';
import { ActivatedRoute} from '@angular/router';


import { Location } from '@angular/common';


import {itemCartService} from './itemCart.service';
import {CookieService} from 'angular2-cookie/core';
import {SharedService} from '../../shared.service';


@Component({
  selector: 'itemCart',
  templateUrl: './itemCart.component.html',
  styleUrls: ['./itemCart.component.css'],
  animations: [
    trigger("fadeIn", [
      state("open", style({opacity: 1})),
      state("closed", style({opacity: 0,display:'none'})),
      transition("closed <=> open", animate(500)),
    ])
  ],
})

export class itemCart implements OnInit{
    mycart:string;
    private cart:any;
    title = 'app works!';
    itemCarts = [];
    status="closed";
    sum=0;
    constructor(
         private elementRef:ElementRef,
         private location: Location,
         private route:ActivatedRoute,
         private _itemCartService:itemCartService,
         private _cookieService:CookieService,
         private sharedService:SharedService
         ){}
    
    ngAfterViewInit(){
        var q = document.createElement("script");
        q.type = "text/javascript";
        q.src = "./app/myCart/itemCart/quantity.script.js";
        this.elementRef.nativeElement.appendChild(q);
    }
    
    ngOnInit(){
        window.scrollTo(0,0);
        var checkLogin = this._cookieService.getObject('login');
        if(checkLogin==undefined||JSON.parse(JSON.stringify(checkLogin)).login==false){
          this.itemCarts = [];
        }else{
          var username = JSON.parse(JSON.stringify(this._cookieService.getObject('login'))).data.username;
          var json = {
            'username':username
          }
          this._itemCartService.getItemCarts(json).subscribe(res=>{
            this.itemCarts=res;
            for (var i in this.itemCarts) {
              // code...
              console.log(parseFloat(this.itemCarts[i].price) );
              this.sum = this.sum  + parseFloat(this.itemCarts[i].price) ;
              console.log(this.sum);
            }
          });

        }

        


    }

    deleteItem(object){
       var temp = parseFloat(this.itemCarts[object].price) ;
       var checkLogin = this._cookieService.getObject('login');
        if(checkLogin==undefined||JSON.parse(JSON.stringify(checkLogin)).login==false){
          this.itemCarts = [];
        }else{
          var username = JSON.parse(JSON.stringify(this._cookieService.getObject('login'))).data.username;
          var json = {
            'username':username,
            'item':object,
          }
          this._itemCartService.deleteItem(json).subscribe(res=>{
            this.itemCarts=res;
            this.sharedService.deleteItem();
            this.sum = this.sum - temp;
          });
        }


    }
    checkout(){
      var checkLogin = this._cookieService.getObject('login');
        if(checkLogin==undefined||JSON.parse(JSON.stringify(checkLogin)).login==false){

        }else{
          var username = JSON.parse(JSON.stringify(this._cookieService.getObject('login'))).data.username;
          var json = {
            'username':username,
            'item':this.itemCarts,
          }
          this._itemCartService.checkout(json).subscribe(res=>{           
            this.status="open";     
            setTimeout(() => {  
              this.status="closed";
              this.itemCarts=[];
              location.href="/";
            }, 700);
          });
        }
      
    }

    continue(){
        this.location.back();
    }
    
}