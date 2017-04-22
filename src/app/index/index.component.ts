import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import {SharedService} from '../shared.service';
import {indexService} from './index.service';
import { default as swal } from 'sweetalert2';

@Component({
  selector: 'index',
  templateUrl:'./index.component.html',
  styleUrls: ['./index.component.css'],
})

export class Indexpage implements OnInit{
  title = 'app works!';
  itemBestSeller = [];
  itemNewRelease = [];
  itemInspire = [];
  option;
  statusInspireByYou=false;
  checkAddToCart;
  constructor(private elementRef:ElementRef,
              private http: Http,
              private _cookieService:CookieService,
              private sharedService:SharedService,
              private _indexService:indexService,
    ){}
  ngAfterViewInit(){
      // var s = document.createElement("script");
      // s.type = "text/javascript";
      // s.src = "/app/app.script.js";
      // this.elementRef.nativeElement.appendChild(s);
  }

  ngOnInit(){
    var checkLogin = this._cookieService.getObject('login');

    this._indexService.bestSeller().subscribe(res=>{
      this.itemBestSeller = res;
    })

    this._indexService.newRelease().subscribe(res=>{
      this.itemNewRelease = res;
    })



    /////////// for getting Item Inspired by You 
    if(checkLogin!=undefined && JSON.parse(JSON.stringify(checkLogin)).login!=false){
      var id = JSON.parse(JSON.stringify(this._cookieService.getObject('login'))).data._id;
      var json = {
         _id:id 
      }

      this._indexService.inspireByYou(json).subscribe(res=>{
        this.itemInspire = res;
        if(this.itemInspire.length!=0){
          this.statusInspireByYou=true;

        }
      })
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
        this._indexService.addToCart(json).subscribe(res=>{
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
