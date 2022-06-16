import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})

export class RecuperarComponent {

  private URL: string = "http://localhost:3000"
  private httpHeaders = new HttpHeaders({ 'content-type': 'application/json', });
  private i: number = 0
  public nuevo: any[] = []
  public recuperar: any = []
  public condicion: boolean = false;
  public resultado: any = []
  // profileForm = new FormGroup({
  //   curp: new FormControl()
  // })
  private exprecion: string = "[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}"

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  profileForm: FormGroup = this.fb.group({
    curp: ['', [Validators.required, Validators.pattern(this.exprecion)]]
  })

  consultarLineCaptura() {

    let valores = {
      curp: this.profileForm.controls['curp'].value,
    }

    // if (this.profileForm.valid) {

      this.http.post(`${this.URL}` + "/ovh/recuperar", valores, { headers: this.httpHeaders }).subscribe((resp: any) => {
      this.recuperar = resp
      // console.log(this.recuperar);
      

        if (resp.length != 0) {
          this.condicion = true
        } else {
          this.condicion = true
        };
      });
    // };

  }



  //   for (this.i = 0; this.i < resp.respuesta.length; this.i++) {
  //     this.nuevo[this.i] = resp.respuesta[this.i]
  //   }



  imprimirPfd(i: number) {
    
      let datos = this.recuperar[i]

      this.http.post(`${this.URL}` + "/ovh/validarFecha", datos, { headers: this.httpHeaders }).subscribe((resp: any) => {
          resp
        
        console.log(resp);
        
        if (resp.fecha) {
          Swal.fire({
            title: 'Su linea de captura aun esta vigente',
            text: "Te quedan " + resp.dias + " dias para pagarla",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Volver a imprimir'
          }).then((result) => {
            if (result.isConfirmed) {
              window.open('https://ovh.veracruz.gob.mx/ovh/formatoReferenciado.do?lineaCaptura=' + this.recuperar.respuesta[0].lineaCaptura)
              Swal.fire(
                'Listo',
                'Puedes descargarlo',
                'success'
              )
            }
          })
    
        } else {
          Swal.fire({
            title: 'Su linea de captura esta vencida',
            text: "¿Desea generar una nueva?",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Generar'
          }).then((result) => {
            if (result.isConfirmed) {
    
              let valores = {
                curp: this.profileForm.controls['curp'].value,
                 datos
              }
    
              this.http.post(`${this.URL}` + "/ovh/generarVencido", valores, { headers: this.httpHeaders }).subscribe((resp: any) => {
                resp;
                // console.log(resp);
    
                if (resp != "") {
                  console.log(resp);
                  window.open('https://ovh.veracruz.gob.mx/ovh/formatoReferenciado.do?lineaCaptura=' + resp)
                  Swal.fire(
                    'Listo',
                    'Nueva orden de pago generada',
                    'success'
                  )
                } else {
                  console.log("llego vacio");
                }
              })
    
              // console.log(valores);
    
              // window.open('http://localhost:4200/pagos')
    
    
            }
          })
    
        }

        
      });

    
   
      

 

  }

}

