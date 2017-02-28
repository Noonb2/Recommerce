import { Component, AfterViewInit, ElementRef , animate, style, state, transition, trigger} from '@angular/core';


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

export class Rate {
  title = 'app works!';
  state = "closed";
  constructor(private elementRef:ElementRef){}
  ngAfterViewInit(){
      // var s = document.createElement("script");
      // s.type = "text/javascript";
      // s.src = "/app/app.script.js";
      // this.elementRef.nativeElement.appendChild(s);
  }
  toggle(){
    this.state = this.state==="closed"? "open": "closed";
  }
}
