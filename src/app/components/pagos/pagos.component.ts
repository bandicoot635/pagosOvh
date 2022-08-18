import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';
declare let alertify: any

export interface Pago {
  numero: number,
  descripcion: string,
  cantidad: number
  monto: number
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})

export class PagosComponent implements OnInit {


  public pagosList: any[] = [];
  public buscar: string = "";
  public pagos: any = []
  public pagoV: Pago = {
    numero: 0,
    descripcion: "",
    cantidad: 0,
    monto: 0
  }
  public arrayDesdeService: Array<any> = [];

  constructor(private api: ApiService, private http:HttpClient) { }

  ngOnInit(): void {
    this.api.getPagos().subscribe((resp: any) => {
      this.pagosList = resp;
    })
  
    this.arrayDesdeService = this.api.getArray(); //recibe
    this.pagos = this.arrayDesdeService
    this.leerLocalStorage()
  }
  leerLocalStorage() {
    if (!localStorage.getItem('pagosList')) { //aqui preguntamos si esto no existe
      console.log('esta vacio');
      return
    }
    console.log('se obtiene info de localStorage');
    const pagosList: any[] = JSON.parse(localStorage.getItem('pagosList')!)
    this.arrayDesdeService = pagosList

  }

  buscarPago(buscar: string) {
    this.buscar = buscar;
  }

  add(pago: any) {
    
    this.pagoV = {
      numero: pago.id_pago,
      descripcion: pago.descripcion.trim(),
      cantidad: 1,
      monto: 112
    }

    //Indice a veces devuelve -1 y por eso devuelve undefined
    let indice = this.pagos.findIndex((p: any) => p.numero === this.pagoV.numero);

    if (indice == -1) {
      this.pagos.push(this.pagoV);

      let msg = alertify.message('Default message');
      msg.delay(2).setContent(`Pago agregado (Cantidad: ${this.pagos[indice + 1].cantidad} )`);
      
    } else {

      let msg = alertify.error('Default message');
      msg.delay(2).setContent(`Solo se puede un pago`);
      /* ESTAS LINEAS DE CODIGO SIRVEN PARA AGREGAR MAS CATNTIDAD DE UN PAGO
      this.pagos[indice].cantidad++;

      let msg = alertify.message('Default message');
      msg.delay(2).setContent(`Pago agregado (Cantidad: ${this.pagos[indice].cantidad} )`);*/
    }
  }

  delete(pago: any) {

    if (!this.pagos.length) {
      let msg = alertify.error('Default message');
      msg.delay(1).setContent('No hay nada para eliminar');
    } else {
      let x = this.pagos.length
      this.pagos = this.pagos.filter((item: any) => item.numero !== pago.id_pago);
      if (x !== this.pagos.length) {
        let msg = alertify.error('Default message');
        msg.delay(1).setContent('Pago eliminado');
      } else {
        let msg = alertify.error('Default message');
        msg.delay(1).setContent('Este pago no ha sido agregado');
      }
    }
  }

  paginar(desde:any){
    // console.log(desde);
    this.http.get(`http://localhost:3000/pagos?desde=${desde}`).subscribe((resp:any) => {
       this.pagosList = resp
      // console.log(resp);
    })
   
    
  }

  sendArray(datos: any) { // cuando se ejecuta el metodo 'enviarData' se manda la data al service
    this.api.setArray(datos);
  }

  enviarData() { //Cuando le doy click al icono de la carpeta se ejecuta este metodo
    this.sendArray(this.pagos);
  }

}

