import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
declare let alertify: any

export interface Pago {
  numero: number,
  descripcion: string,
  cantidad: number
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})

export class PagosComponent implements OnInit {


  public pagosList: any[] = [];
  public page: number = 0;
  public buscar: string = "";
  public pagos: any = []
  public pagoV: Pago = {
    numero: 0,
    descripcion: "",
    cantidad: 0
  }

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getPagos().subscribe((resp: any) => {
      this.pagosList = resp;
    })
    if (this.page == 0) {
      let butonAtras = document.getElementById("butonAtras") as HTMLInputElement;
      butonAtras.disabled = true;
    }
  }

  buscarPago(buscar: string) {
    this.page = 0;
    this.buscar = buscar;
  }

  add(pago: any) {
    this.pagoV = {
      numero: pago.id_pago,
      descripcion: pago.descripcion.trim(),
      cantidad: 1
    }

    //indice a veces devuelve -1 y por eso devuelve undefined
    let indice = this.pagos.findIndex((p: any) => p.numero === this.pagoV.numero);

    if (indice == -1) {
      this.pagos.push(this.pagoV);

      let msg = alertify.message('Default message');
      msg.delay(2).setContent(`Pago agregado (Cantidad: ${this.pagos[indice + 1].cantidad} )`);
    } else {
      this.pagos[indice].cantidad++;
     
      let msg = alertify.message('Default message');
      msg.delay(2).setContent(`Pago agregado (Cantidad: ${this.pagos[indice].cantidad} )`);
    }
  }

  delete(pago: any) {
    this.pagos = this.pagos.filter((item: any) => item.numero !== pago.id_pago);
    var msg = alertify.error('Default message');
    msg.delay(1).setContent('Pago eliminado');
  }

  siguientePagina() {
    let butonAtras = document.getElementById("butonAtras") as HTMLInputElement;

    if (this.page == 0) {
      butonAtras.disabled = true;
    } else {
      butonAtras.disabled = false;
    }
    this.page += 10;
    console.log(this.page);
  }

  atrasPagina() {
    this.page -= 10
    console.log(this.page);

    let butonAtras = document.getElementById("butonAtras") as HTMLInputElement;
    if (this.page <= 0) {
      butonAtras.disabled = true;
    }
  }

  sendArray(datos: any) {
    this.api.setArray(datos);
  }

  enviarData() {
    this.sendArray(this.pagos);
  }

}

