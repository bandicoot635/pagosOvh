import { Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private URL: string = "http://localhost:3000"
  public arrayDelService: Array<any>=[]
 
  constructor(private http: HttpClient) { }

  setArray(array: any) { //Aqui llega la data y se queda guardado en un array local    
    this.arrayDelService = array;
  }
  
  getArray() { //Con este metodo se puede acceder al array local, desde otro componente
    return this.arrayDelService;
  }


  getPagos() {
    return this.http.get(`${this.URL}/pagos/`)
  }

}
