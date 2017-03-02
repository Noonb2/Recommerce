
import { Component, AfterViewInit, ElementRef, OnInit, animate, style, state, transition, trigger } from '@angular/core';
import { itemListService } from './itemList.service';
import {SharedService} from '../../shared.service';
import { ActivatedRoute } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { PagerService } from './pager.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
// import * as _ from 'underscore';
import { default as swal } from 'sweetalert2';

@Component({
  selector: 'itemList',
  templateUrl: './itemList.component.html',
  styleUrls: ['./itemList.component.css'],
  animations: [
    trigger("fadeIn", [
      state("open", style({opacity: 1})),
      state("closed", style({opacity: 0,display:'none'})),
      transition("closed <=> open", animate(500)),
    ])
  ],

})





export class itemList implements OnInit {
    department:string;
    category:string;
    private sub:any;
    title = 'app works!';
    data = [];
    status="closed";
    message="";
    checkAddToCart=false;
    spinner:boolean;
    numCarts = this.sharedService.getNumCarts();
    constructor(
      private elementRef:ElementRef,
      private itemlistService:itemListService, 
      private pagerService:PagerService, 
      private http: Http,
      private route:ActivatedRoute,
      private _cookieService:CookieService,
      private sharedService:SharedService,
      ){}

    private allItems: any[];

    pager: any = {};

    pagedItems: any[];

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
           this.spinner=true;
           this.department = params['department'];
           this.category = params['category'];
           switch (this.department) {
               case "women":
                   // code...
                   this.department="Women's Fashion";
                   break;
               case "men":
                   this.department="Men's Fashion";
                   break;
               case "elec":
                   this.department="Electronics";
                   break;
               case "home":
                   this.department="Home";
                   break;
               default:
                   // code...
                   break;
           }
           switch (this.category) {
               case "tv":
                   // code...
                   this.category="TV & Home Theatre";
                   break;
               case "comp":
                   // code...
                   this.category="Computers & Printers";
                   break;
               case "mobile":
                   // code...
                   this.category="Mobile Devices";
                   break;
               case "livingroom":
                   // code...
                   this.category="Living Room";
                   break;
               default:
                   // code...
                   break;
           }
       // In a real app: dispatch action to load the details here.
           this.itemlistService.getItemParams(this.department,this.category   ).subscribe(data => {
            this.data =data;
            this.allItems = data;
            this.spinner=false;

              // initialize to page 1
            this.setPage(1);
          });
        });

    }

     setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    addToCart(item:Object){
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
        this.itemlistService.addToCart(json).subscribe(res=>{
        this.checkAddToCart=res;
        if(this.checkAddToCart){
          this.sharedService.addCarts();
          swal("Good Choice!", "You confirm to add this product", "success");
          
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
