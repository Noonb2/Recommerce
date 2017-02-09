import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { StickyModule } from '../ng2-sticky-kit';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    // StickyModule
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
