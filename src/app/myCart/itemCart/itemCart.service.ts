import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class itemCartService {

	private itemCartUrl = '/api/myCarts';

	constructor(private http:Http,
		){}



	getItemCarts(object:Object){
		return this.http.post(this.itemCartUrl,object).map(res=>res.json());
	}
	deleteItem(object:Object){
		return this.http.post('/api/deleteItem',object).map(res=>res.json());
	}
	checkout(object:Object){
		return this.http.post('/api/checkout',object).map(res=>res.json());
	}

	getItemAssrule(object:Object){
		return this.http.post('/api/assrule',object).map(res=>res.json());
	}

	addToCart(item:Object){
		return this.http.post('/addCart',item).map(res=>res.json());
	}

}