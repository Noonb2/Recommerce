
import { Component, AfterViewInit, ElementRef, OnInit, animate, style, state, transition, trigger } from '@angular/core';
import { ActivatedRoute} from '@angular/router';


import { Location } from '@angular/common';


import {itemCartService} from './itemCart.service';
import {CookieService} from 'angular2-cookie/core';
import {SharedService} from '../../shared.service';
import { default as swal } from 'sweetalert2';

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
    statusRecommend;
    youMayAlsoLike=false;
    AssruleItem = [];
    checkAddToCart:boolean;
    option;
    screen;
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

        var c = document.createElement("script");
        c.type = "text/javascript";
        c.src = "./app/myCart/itemCart/owlcarousel.script.js";
        this.elementRef.nativeElement.appendChild(c);
    }
    ngOnInit(){
        this.screen = window.innerWidth;
        window.scrollTo(0,0);
        var checkLogin = this._cookieService.getObject('login');
        if(checkLogin==undefined||JSON.parse(JSON.stringify(checkLogin)).login==false){
          this.itemCarts = [];
        }else{
          var username = JSON.parse(JSON.stringify(this._cookieService.getObject('login'))).data.username;
          var id = JSON.parse(JSON.stringify(this._cookieService.getObject('login'))).data._id;
          var json = {
            'username':username,
            'id':id
          }
          this._itemCartService.getItemCarts(json).subscribe(res=>{
            this.itemCarts=res;
            if(this.itemCarts.length!=0){
              this.statusRecommend = true;
              this._itemCartService.getItemAssrule(json).subscribe(res=>{
                this.AssruleItem = res;
                this.statusRecommend=false;
                if(this.AssruleItem.length!=0){
                  this.youMayAlsoLike=true;
                }

              })
            }
            for (var i in this.itemCarts) {
              // code...
              console.log(parseFloat(this.itemCarts[i].price) );
              this.sum = this.sum  + parseFloat(this.itemCarts[i].price) ;
              console.log(this.sum);
            }
          });
          var numItems;
          if(this.screen >= 768){
            numItems = 5;
          }
          else if(this.screen <= 320){
            numItems = 2;
          }
          else{
            numItems = 3;
          } 
          this.option = {
            // items:numItems,
            dots:false,
            responsiveClass:true,
            navText:["<div title='Previous' class='fa fa-chevron-left btn btn-slide' style='position:absolute;left:0;top:40%;font-size:20px'></div>",
            "<div title='Next' class='fa fa-chevron-right btn btn-slide' style='position:absolute;right:0;top:40%;font-size:20px'></div>"],
            responsive:{
                0:{
                    items:2,
                    nav:false,
                    loop:true
                },
                600:{
                    items:3,
                    nav:false,
                    loop:true
                },
                1000:{
                    items:5,
                    nav:true,
                    loop:true
                }
            }
          }
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

    addToCart(item){
      var recieveCookie = this._cookieService.getObject('login');
      if(recieveCookie==undefined){
        this.checkAddToCart=false;
        swal('Please Sign in','Thank You','warning');
      }else if(JSON.parse(JSON.stringify(recieveCookie)).login){
        var username = JSON.parse(JSON.stringify(recieveCookie)).data.username;
        var json = {
           'username':username,
           'item':item
        };
        this._itemCartService.addToCart(json).subscribe(res=>{
        this.checkAddToCart=res;
        if(this.checkAddToCart){
          this.sharedService.addCarts();
          swal("Good Choice!", "You confirm to add this product", "success");
          this.itemCarts.push(item);
          this.sum = this.sum +parseFloat(item.price);
          
        }else{
          swal('Try Again','Waiting for service', 'info');
        }
        });
        
      }
      else{
          swal('Please Sign in','Thank You','warning');
      }
      
    }
    
}