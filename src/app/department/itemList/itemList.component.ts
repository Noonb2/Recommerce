
import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { itemListService } from './itemList.service';
import { ActivatedRoute } from '@angular/router';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { PagerService } from './pager.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
// import * as _ from 'underscore';


@Component({
  selector: 'itemList',
  templateUrl: './itemList.component.html',
  styleUrls: ['./itemList.component.css']
})





export class itemList implements OnInit {
    department:string;
    category:string;
    private sub:any;
    title = 'app works!';
    data = [];
    constructor(
      private elementRef:ElementRef,
      private itemlistService:itemListService, 
      private pagerService:PagerService, 
      private http: Http,
      private route:ActivatedRoute){}

    private allItems: any[];

    pager: any = {};

    pagedItems: any[];


    ngAfterViewInit(){
        // var s = document.createElement("script");
        // s.type = "text/javascript";
        // s.src = "/app/app.script.js";
        // this.elementRef.nativeElement.appendChild(s);
    }
    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
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
        });
        this.itemlistService.getItemParams(this.department,this.category   ).subscribe(data => this.data =data);

        
        this.http.get('/api/test')
            .map((response: Response) => response.json())
            .subscribe(data => {
            // set items to json response
            this.allItems = data;

            // initialize to page 1
            this.setPage(1);
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


  
}
