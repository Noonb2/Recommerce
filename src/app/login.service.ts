import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class loginService {

	loginUrl = '/login';
	registerUrl = '/register';

	constructor(private http:Http){

	}
	checkLogin(username:string,password:string){

		return this.http.post(this.loginUrl
			,{
				'username':username,
				'password':password
			}).map((res:Response) => res.json());
		// console.log(data);
		
	}

	register(username:string,password:string,name:string,gender:string){
		return this.http.post(this.registerUrl,
			{
				'username':username,
				'password':password,
				'name':name,
				'gender':gender,
			}).map(res=>res.json());
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