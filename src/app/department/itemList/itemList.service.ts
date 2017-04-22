import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class itemListService {

	private itemlistUrl = '/api/itemlist';

	constructor(private http:Http,
		){

	}

	getItem(){

		return this.http.get(this.itemlistUrl).map((res:Response) => res.json());
		// console.log(data);
		
	}

	getItemParams(department:string,category:string){
		return this.http.get(this.itemlistUrl+'/'+department+'/'+category).map(res=>res.json());
	}

	addToCart(item:Object){
		return this.http.post('/addCart',item).map(res=>res.json());
	}

	getItemSearch(keyword:string){
		var json = {
			keyword:keyword
		}
		return this.http.post('/api/search',json).map(res=>res.json());
	}
	// private extractData(res: Response) {
	//     let body = res.json();
	//     return body.data || { };
 //  	}
 //  	private handleError (error: Response | any) {
	//     // In a real world app, we might use a remote logging infrastructure
	//     let errMsg: string;
	//     if (error instanceof Response) {
	//       const body = error.json() || '';
	//       const err = body.error || JSON.stringify(body);
	//       errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	//     } else {
	//       errMsg = error.message ? error.message : error.toString();
	//     }
	//     // console.error(errMsg);
	//     return Observable.throw(errMsg);
 //  	}

}