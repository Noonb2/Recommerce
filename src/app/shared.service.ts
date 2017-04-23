import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SharedService {
	numCarts;
	inspire= {
		status:false,
		item:[],
		username:"",
	}
	inspireStatus=false;
	itemInspire=[];
	constructor(private cookieService:CookieService,
				private http:Http ){
		var username = this.cookiesToJSON('login')===undefined||this.cookiesToJSON('login').login===false? "":this.cookiesToJSON('login').data.username;
		if(username!=""){
			var json = {
				"username":username
			}
			this.http.post('/api/myCarts',json).map(res=>res.json()).subscribe(data=>{
				this.numCarts = data.length;
			})
		}else{
			this.numCarts = 0;
		}
		
	}

	cookiesToJSON(key:string){
	    var _key = this.cookieService.getObject(key);
	    if(_key!= undefined)
	    return JSON.parse(JSON.stringify(_key));
	}

	

	getNumCarts(){
		return this.numCarts;
	}

	addCarts(){
		this.numCarts = this.numCarts+1;
	}

	deleteItem(){
		this.numCarts = this.numCarts-1;
	}

	checkNumLogin(){
		var username = this.cookiesToJSON('login')===undefined||this.cookiesToJSON('login').login===false? "":this.cookiesToJSON('login').data.username;
		if(username!=""){
			var json = {
				"username":username
			}
			this.http.post('/api/myCarts',json).map(res=>res.json()).subscribe(data=>{
				this.numCarts = data.length;
			})
		}
	}

	setNumSignOut(){
		this.numCarts = 0;
	}

	rememberInspire(array,username){
		this.inspire.status = true;
		this.inspire.item = array;
		this.inspire.username = username;
		
	}

}