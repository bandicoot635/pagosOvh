import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(pagosList: any[], buscar: string = ""): any[] {

    let valoresAceptados = /^[0-9]+$/;
  
    if (buscar.match(valoresAceptados)) {
      const filtroNumero = pagosList.filter(pago => pago.id_pago.toString().includes(buscar))
      return filtroNumero
    }

    const filtroNombre = pagosList.filter(pago => pago.descripcion.includes(buscar.toUpperCase()));

    // document.write(filtroNombre)
    // console.log(typeof filtroNombre);
    return filtroNombre
  }

}