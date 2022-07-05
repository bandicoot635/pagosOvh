import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})

export class PagosComponent implements OnInit {

  public pagosList: any = [];
  public page: number = 0;
  public buscar: string = "";
  public carrito: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getPagos().subscribe((resp: any) => {
      this.pagosList = resp;
      this.pagosList.forEach((e: any) => {
        e.contador = 0
      });
      // console.log(this.pagosList);

    })

    if(this.page==0){
      let butonAtras = document.getElementById("butonAtras") as HTMLInputElement;
      butonAtras.disabled = true;
    }
  }

  buscarPago(buscar: string) {
    this.page = 0;
    this.buscar = buscar;
  }

  add(pago:any) {
    this.carrito.push(pago)
    console.log(pago, this.carrito)


    // if (this.pagosList[i].contador == 3) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'No puedes pagar mas de 3!',
    //     showConfirmButton: false,
    //     timer: 1500
    //   })
    // } else {
    //   this.pagosList[i].contador++
    //   this.carrito.push(datos)
    // }

    // console.log(this.carrito);
  }

  delete(i: number) {
    if( this.pagosList[i].contador<=0){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay nada para eliminar!',
        showConfirmButton: false,
        timer: 1500
      })
    }else{
      this.pagosList[i].contador--
      this.carrito.splice(i)
      console.log(this.carrito, this.pagosList[i].contador );
    }
  }
  siguientePagina() {
    let butonAtras = document.getElementById("butonAtras") as HTMLInputElement;
   
    if (this.page== 0 ) {
      butonAtras.disabled = true;
    }else{
      butonAtras.disabled = false;
    }
    this.page += 10;
    console.log(this.page);
  }

  atrasPagina() {
    this.page -= 10
    console.log(this.page);
    
    let butonAtras = document.getElementById("butonAtras") as HTMLInputElement;
    if (this.page <= 0 ) {
      butonAtras.disabled = true;
    }
  }

}

