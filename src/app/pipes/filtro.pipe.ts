import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(pagosList: any[], buscar: string = "", page: number = 0): any[] {

    let valoresAceptados = /^[0-9]+$/;
   

    if (buscar.length == 0) {
      return pagosList.slice(page, page + 10)
    }



    else if (buscar.match(valoresAceptados)) {
      const filtroNumero = pagosList.filter(pago => pago.id_pago.toString().includes(buscar))
      // console.log(filtroNumero);
      
      return filtroNumero.slice(page, page + 10) 
    }

    const filtroNombre = pagosList.filter(pago => pago.descripcion.includes(buscar.toUpperCase()));
    // console.log(filtroNombre);
    return filtroNombre.slice(page, page + 10);
  }

}