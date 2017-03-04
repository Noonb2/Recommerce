import { Component, AfterViewInit, ElementRef , animate, style, state, transition, trigger ,OnInit, AfterViewChecked} from '@angular/core';
import {RateService} from './rate.service';
import {CookieService} from 'angular2-cookie/core';


@Component({
  selector: 'rating',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css'],
  animations: [
    trigger("fadeIn", [
      state("open", style({opacity: 1})),
      state("closed, void", style({opacity: 0,display:'none'})),
      transition("closed <=> open", animate(500)),
    ])
  ],

   // animations: [trigger(
   //    'fadeIn',
   //    [
   //      state('closed, void', style({height: '0px', color: 'maroon', borderColor: 'maroon'})),
   //      state('open', style({height: '*', borderColor: 'green', color: 'green'})),
   //      transition(
   //          'closed<=> open', [animate(500, style({height: '250px'})), animate(500)])
   //    ])],
   
})

export class Rate implements OnInit{
  title = 'app works!';
  state = "closed";
  itemRating = [];
  constructor(private elementRef:ElementRef,
              private rateService:RateService,
              private _cookieService:CookieService,
    ){}
  ngAfterViewInit(){
    console.log('Afterview');
      
      
      var recieveCookie = this._cookieService.getObject('login');
      if(recieveCookie==undefined){
        
      }else if(JSON.parse(JSON.stringify(recieveCookie)).login){
         var username = JSON.parse(JSON.stringify(recieveCookie)).data.username;
         var json = {
           'username':username,
         };
        console.log(json);
        this.rateService.getItem(json).subscribe(res=>{
          this.itemRating = res;
          console.log(this.itemRating);
          this.state = "open";
        });
        
      }
  }
  ngOnInit(){
    // console.log('on init');
    // var recieveCookie = this._cookieService.getObject('login');
    //   if(recieveCookie==undefined){
        
    //   }else if(JSON.parse(JSON.stringify(recieveCookie)).login){
    //      var username = JSON.parse(JSON.stringify(recieveCookie)).data.username;
    //      var json = {
    //        'username':username,
    //      };
    //     console.log(json);
    //     this.rateService.getItem(json).subscribe(res=>{
    //       this.itemRating = res;
    //       console.log(this.itemRating);
    //       this.state = "open";
    //     });
        
    //   }
    // this.inpustName = this.itemId + '_rating';
    
  }
  ngAfterViewChecked(){
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "/app/index/rate-review/rate.script.js";
      this.elementRef.nativeElement.appendChild(s);
  }  
  
  rateItem(){
    this.state="closed";
  }

  

}
