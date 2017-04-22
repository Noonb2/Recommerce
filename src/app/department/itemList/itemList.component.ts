
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
    keyword:string;
    statusItem=true;
    numCarts = this.sharedService.getNumCarts();
    screen: number; 
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
    ngAfterViewInit(){
      

      var l = document.createElement("script");
      l.type = "text/javascript";
      l.src = "./app/department/itemlist/itemlist.script.js";
      this.elementRef.nativeElement.appendChild(l);
    }
    ngOnInit(){
        this.screen = window.innerWidth;
        window.scrollTo(0,0);
        
        
        this.sub = this.route.params.subscribe(params => {
           this.spinner=true;
           this.department = params['department'];
           this.category = params['category'];
           this.keyword = params['keyword'];
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
                   this.department="Search Results"
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

                   {
                    
                      if(this.department=="Search Results"){
                       this.category = '"'+this.keyword+'"';
                       
                       }
                    
                   }
                   break;
           }
       // In a real app: dispatch action to load the details here.
        
          if(this.department=="Search Results"){
              this.statusItem = true;
              this.itemlistService.getItemSearch(this.keyword).subscribe(data=>{
                this.data = data;
                this.allItems = [];
                this.allItems = data;
                if(this.allItems.length==0){
                  this.statusItem = false;
                  this.setPage(0);
                }else{
                  this.setPage(1);
                }
                this.spinner=false;
                window.scrollTo(0,0);
                  // initialize to page 1
                
              })
          }else{
            this.itemlistService.getItemParams(this.department,this.category   ).subscribe(data => {
              this.data =data;
              this.allItems = data;
              this.spinner=false;
              window.scrollTo(0,0);
                // initialize to page 1
              this.setPage(1);
            });
          }
        
           
        });

    }

     setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) {
            this.pager={};
            this.pagedItems = [];
            return;
        }

        // get pager object from service
        var numpage;
        if(this.screen >= 768){
            numpage = 5;
        }
        else if(this.screen <= 320){
            numpage = 2;
        }
        else{
            numpage = 3;
        } 
        this.pager = this.pagerService.getPager(this.allItems.length, page,12, numpage);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
        window.scrollTo(0,0);

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

    filter(from:string,to:string){

      var f = parseInt(from);
      var t = parseInt(to);
      var temp = [];
      if(f==NaN || t==NaN){
        console.log('NaN');
        return;
      }
      console.log('filter:'+f+' to '+t);
      this.spinner=true;
      this.statusItem = true;

      this.data.forEach(function(element,index){
        if(element.price>=f && element.price<=t){
          temp.push(element);
        }
      })

      this.allItems = temp;
      if(this.allItems.length!=0){
        this.setPage(1);
      }else{
        this.setPage(0);
        this.statusItem = false;
      }
      this.spinner = false;
      window.scrollTo(0,0);
    }

    sort(){
      var temp = [];
      console.log('sort!');
      var array = this.allItems.slice();
      this.allItems= [];
      this.setPage(0);
      this.spinner = true;
      this.itemlistService.sort(array).subscribe(res=>{
        this.allItems=res;
        this.spinner=false;
        this.setPage(1);
      })

    }
  
}
