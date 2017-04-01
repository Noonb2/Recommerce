import { Component, AfterViewInit, ElementRef , animate, style, state, transition, trigger ,OnInit, AfterViewChecked} from '@angular/core';
import {RateService} from './rate.service';
import {CookieService} from 'angular2-cookie/core';
import { default as swal } from 'sweetalert2';


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
  recommendStatus = false;
  recommendItem = false;
  spinner = false;
  itemRating = [];
  itemRecommend =[];
  username;
  id_user;
  constructor(private elementRef:ElementRef,
              private rateService:RateService,
              private _cookieService:CookieService,
    ){}
  ngAfterViewInit(){
    // console.log('Afterview');
      
      
      
  }
  ngOnInit(){
    var recieveCookie = this._cookieService.getObject('login');
      if(recieveCookie==undefined){
        
      }else if(JSON.parse(JSON.stringify(recieveCookie)).login){
         this.username = JSON.parse(JSON.stringify(recieveCookie)).data.username;
         this.id_user = JSON.parse(JSON.stringify(recieveCookie)).data._id;
         var json = {
           'username':this.username,
         };
        console.log(json);
        this.rateService.getItem(json).subscribe(res=>{
          this.itemRating = res;
          console.log(this.itemRating);
          if(this.itemRating.length!=0){
            this.state = "open";
          }
          
          document.querySelector('body').classList.add('ovh');
        });
        
      }
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
    var state = this.checkHasRate(this.itemRating);
    if(state=="open"){
      swal('Please rate all the items','','warning');
    }else{
      var json ={
        'username':this.username,
        'items':this.itemRating
      }
     
      this.rateService.rateItem(json).subscribe(res=>{
        swal("Thank you", "", "success");
         this.recommendStatus = true;
         this.spinner = true;
          this.rateService.recommendItem({id:this.id_user}).subscribe(res=>{
            this.itemRecommend = res.data;
            console.log(res.data);
            this.spinner = false;
            // this.recommendStatus = false;
            this.recommendItem = true;
          });
        // this.state = state; not closed yet
      })
      

    }
    document.querySelector('body').classList.remove('ovh');
  }

  rateRecommend(){
    var state = this.checkHasRateRecommend(this.itemRecommend);
    if(state=="open"){
      swal('Please rate all the items','','warning');
    }else{
      var json ={
        '_id':this.id_user,
        'items':this.itemRecommend
      }
      this.rateService.rateRecommend(json).subscribe(res=>{
        swal("Thank you", "", "success");
        this.state = state;
        /////////// add here
      });
    }
  }
  onClickRate(id:String,rateName:String,value:number){
    var index = this.findById(this.itemRating,id);
    if(index>=0){
      this.addRate(index,rateName,value);
      console.log(this.itemRating[index]);
    }
    else{
      console.log("somethings wrong!!");
    }

  }

  onClickRecommend(id:String,value:number){
    var index = this.findById(this.itemRecommend,id);
    if(index>=0){
      this.itemRecommend[index].overall = value;
      console.log(this.itemRecommend[index].overall);
    }
    else{
      console.log("somethings wrong!!");
    }
  }

  checkHasRate(item){
    for(var i = 0;i<item.length;i++){
      if( item[i].myrate.overall == 0 ||
          item[i].myrate.price == 0 ||
          item[i].myrate.quality == 0 ||
          item[i].myrate.design == 0 ||
          item[i].myrate.sustainability == 0 
        ){
        return "open";
      }

    }

    return "closed";
  }

  checkHasRateRecommend(item){
    for(var i = 0;i<item.length;i++){
      console.log(item[i]);
      if( item[i].overall == undefined){
        return "open";
      }

    }

    return "closed";
  }
  findById(array:any[],id:String){
    for (var i = 0 ;i <= array.length; i++) {
      if(array[i]._id == id){
        return i;
      }
    }
    return -1;
  }

  addRate(index:number,rateName:String,value:number){
    switch (rateName) {
      case "overall":
        // code...
          this.itemRating[index].myrate.overall = value;
        break;
      case "price":
        // code...
          this.itemRating[index].myrate.price = value;
        break;
      case "quality":
        // code...
          this.itemRating[index].myrate.quality = value;
        break;
      case "design":
        // code...
          this.itemRating[index].myrate.design = value;
        break;
      case "sustainability":
        // code...
          this.itemRating[index].myrate.sustainability = value;
        break;  
      default:
        // code...
        break;
    }
  }


}
