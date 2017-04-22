import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class indexService {



	constructor(private http:Http,
		){

	}

	bestSeller(){
		return this.http.get('/api/bestseller').map(res=>res.json());
	}

	newRelease(){
		return this.http.get('/api/newrelease').map(res=>res.json());
	}

	inspireByYou(object){
		return this.http.post('/api/inspirebyyou',object).map(res=>res.json());
	}

	addToCart(item){
		return this.http.post('/addCart',item).map(res=>res.json());
	}



}