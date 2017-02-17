import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StickyModule } from '../ng2-sticky-kit';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { Department } from './department/department.component';
import { itemList } from './department/itemlist/itemList.component';
import { itemListService } from './department/itemlist/itemList.service';
import { PagerService } from './department/itemlist/pager.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';


const appRoutes: Routes = [
  
  { path: 'Departments/:department/:category', component:Department},
  
  
];

@NgModule({
  declarations: [
    AppComponent,
    Department,
    itemList,
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
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
