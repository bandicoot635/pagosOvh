import { Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private URL: string = "http://localhost:3000"
  public arrayDelService: Array<any>=[]

 
  constructor(private http: HttpClient) { }

  setArray(array: any) {
    this.arrayDelService = array;
  }
  
  getArray() {
    return this.arrayDelService;
  }

  getPagos() {
    return this.http.get(`${this.URL}/pagos/`)
  }

}
