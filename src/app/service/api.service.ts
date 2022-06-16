import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private URL: string = "http://localhost:3000"
 
  
  constructor(private http: HttpClient) { }

  getPagos() {
    return this.http.get(this.URL + "/pagos/")
  }

  // valor(res: any) {
  //   return this.http.get(this.URL + "/alumnos/" + res.termino + "/" + res.curp + "/" + res.matricula);
  // }

  // recuperar(res:any){
  //   return this.http.get(this.URL + "/recuperar/" + res.curp );
  // }

  // obtenerOvh(res: any) {
  //   return this.http.get( this.URL + "/ovh/" + res.numero + "/" + res.fecha + "/" + res.descripcion + "/" + res.nombre + "/" + res.curp);
  // }


}
