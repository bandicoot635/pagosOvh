import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})

export class PagosComponent implements OnInit {

  public pagosList: any = [];
  public page: number = 0;
  public buscar: string = "";

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getPagos().subscribe((resp: any) => {
      this.pagosList = resp;
    })
  }

  buscarPago(buscar: string) {
    this.page = 0;
    this.buscar = buscar;

  }


  siguientePagina() {

    let butonAtras = document.getElementById("butonAtras") as HTMLInputElement;
    butonAtras.disabled = false;

    this.page += 10;
  }

  atrasPagina() {
    this.page -= 10
    let butonAtras = document.getElementById("butonAtras") as HTMLInputElement;
    if (this.page == 0) {
      butonAtras.disabled = true;
    }
  }

}

