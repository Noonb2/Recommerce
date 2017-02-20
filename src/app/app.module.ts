import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StickyModule } from '../ng2-sticky-kit';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { loginService } from './login.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import {itemCartService} from './myCart/itemCart/itemCart.service';
import { Department } from './department/department.component';
import { itemList } from './department/itemlist/itemList.component';
import { itemListService } from './department/itemlist/itemList.service';
import { PagerService } from './department/itemlist/pager.service';

import { myCart } from './myCart/myCart.component';
import { itemCart } from './myCart/itemCart/itemCart.component';



const appRoutes: Routes = [
  
  { path: 'Departments/:department/:category', component:Department },
  { path: 'myCart', component:myCart }
  
];

@NgModule({
  declarations: [
    AppComponent,
    Department,
    itemList,
    myCart,
    itemCart
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    StickyModule
  ],
  providers: [
    itemListService,
    PagerService,
    CookieService,
    loginService,
    itemCartService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
