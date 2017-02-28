import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SharedService {

	constructor(private cookieService:CookieService){

	}

	cookiesToJSON(key:string){
	    var _key = this.cookieService.getObject(key);
	    if(_key!= undefined)
	    return JSON.parse(JSON.stringify(_key));
	}

	numCarts:Number;

	getNumCarts(){
		this.numCarts = this.cookiesToJSON('login')===undefined||this.cookiesToJSON('login').data.carts===undefined? 0:this.cookiesToJSON('login').data.carts.length;
		return this.numCarts;
	}


}