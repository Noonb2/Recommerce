import { Component, AfterViewInit, ElementRef, OnInit, animate, style, state, transition, trigger } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {itemCartService} from './itemCart.service';
import {CookieService} from 'angular2-cookie/core';

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
    status="closed"
    constructor(
         private elementRef:ElementRef,
         private route:ActivatedRoute,
         private _itemCartService:itemCartService,
         private _cookieService:CookieService,){}
    
    ngAfterViewInit(){
        var q = document.createElement("script");
        q.type = "text/javascript";
        q.src = "./app/myCart/itemCart/quantity.script.js"
        this.elementRef.nativeElement.appendChild(q);
    }
    
    ngOnInit(){
        this.cart = this.route.params.subscribe(params => { this.mycart = params['myCart']});
        var checkLogin = this._cookieService.getObject('login');
        if(checkLogin==undefined||JSON.parse(JSON.stringify(checkLogin)).login==false){
          this.itemCarts = [];
        }else{
          var username = JSON.parse(JSON.stringify(this._cookieService.getObject('login'))).data.username;
          var json = {
            'username':username
          }
          this._itemCartService.getItemCarts(json).subscribe(res=>this.itemCarts=res);
        }
        


    }

    deleteItem(object:Number){
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
            this.itemCarts=res
            var data = JSON.parse(JSON.stringify(this._cookieService.getObject('login')));
            data.data.carts.pop(object);
            this._cookieService.putObject('login',data);
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
            var data = JSON.parse(JSON.stringify(this._cookieService.getObject('login')));
            data.data.carts=[];
            
            this.status="open";
      
            setTimeout(() => {  
              this.status="closed";
              this._cookieService.putObject('login',data);
              this.itemCarts=[];
              location.href="/";
            }, 700);
          });
        }
      
    }

 
    
}