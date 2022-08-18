import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2'
declare let alertify: any

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.css']
})
export class FormulariosComponent implements OnInit {

  private httpHeaders = new HttpHeaders({ 'content-type': 'application/json', });
  private URL: string = "http://localhost:3000"
  private fecha: any
  private date = new Date();
  public forma!: FormGroup
  public condicion: boolean = false
  public alumnos: any = null;
  profileForm = new FormGroup({
    termino: new FormControl(''),
    boolean: new FormControl(),
    boolean2: new FormControl(),
  })
  public arrayDesdeService: Array<any> = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private api: ApiService) {
    this.profileForm.patchValue({ boolean2: true });
  }

  ngOnInit(): void {
    this.arrayDesdeService = this.api.getArray(); //RECIBE
    // console.log(this.arrayDesdeService);
    this.guardarLocalStorage()
    this.leerLocalStorage()
    this.crearFormulario()
  }

  guardarLocalStorage() {
    if (this.arrayDesdeService.length > 0) {
      console.log('se guardo en localStorage');

      localStorage.setItem('pagosList', JSON.stringify(this.arrayDesdeService))
    }

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

  delete(pago: any) {
    // console.log(pago);

    this.arrayDesdeService = this.arrayDesdeService.filter((item: any) => item.numero !== pago.numero);

    this.guardarLocalStorage()
    let msg = alertify.error('Default message');
    msg.delay(1).setContent('Pago eliminado');
    console.log(this.arrayDesdeService);

  }

  sendArray(datos: any) { //ENVIA
    this.api.setArray(datos);
  }

  enviarData() {
    this.sendArray(this.arrayDesdeService);
  }

  buscarAlumno(): any {

    let valores = {
      termino: this.profileForm.controls['termino'].value,
      boolean: this.profileForm.controls['boolean'].value,
      boolean2: this.profileForm.controls['boolean2'].value,
    }


    if (!valores.boolean && !valores.boolean2) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Tienes que hacer check a "buscar por"',
        showConfirmButton: false,
        timer: 1700
      })
    } else {

      this.http.post(`${this.URL}` + "/alumnos", valores, { headers: this.httpHeaders }).subscribe({
        next: (res: any) => {
          this.alumnos = res;

          this.forma.patchValue({ nombre: res.nombre })
          this.forma.patchValue({ curp: res.CURP })
          this.forma.patchValue({ matricula: res.matricula })
          Swal.fire({
            icon: 'success',
            title: 'Alumno encontrado',
            showConfirmButton: false,
            timer: 1700
          })
        }, error: (error: any) => {
          this.forma.patchValue({ nombre: '' })
          this.forma.patchValue({ curp: '' })
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error.error,
            showConfirmButton: false,
            timer: 1700
          })
        }
      })
    }
  }

  onChange(option: any, name: string) {

    let checkbox = document.getElementsByName("check") as NodeListOf<HTMLInputElement>

    checkbox.forEach(valor => {
      if (option.target.id != 'boolean') {
        this.profileForm.patchValue({ boolean: false });
      };
      if (option.target.id != 'boolean2') {
        this.profileForm.patchValue({ boolean2: false });
      };

    });
    // console.log( this.profileForm.value)
  };

  crearFormulario() {

    this.date.setDate(this.date.getDate() + 7)
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    this.fecha = this.date.getDate() + "/" + months[this.date.getMonth()] + "/" + this.date.getFullYear()

    this.forma = this.fb.group({
      fecha: [this.fecha, [Validators.required]],
      nombre: ['', [Validators.required]],
      curp: ['', [Validators.required]],
    })
  }


  obtenerOvh(nombre: string, fecha: string, CURP: string): any {

    if (!this.alumnos) {
      Swal.fire({
        icon: 'error',
        title: 'Primero agregue los datos del alumno',
        showConfirmButton: false,
        timer: 1700
      })
    } else {

      let referencias: any[] = []
      let cantidad: any = []

      for (let i = 0; i < this.arrayDesdeService.length; i++) {
        referencias[i] = this.arrayDesdeService[i].numero
        cantidad[i] = this.arrayDesdeService[i].cantidad
      }

      let valoresOrdenPago = {
        numero: referencias.toString().trim(),
        cantidad: cantidad.toString().trim(),
        nombre: nombre.trim(),
        fecha: fecha,
        curp: CURP
      };

      this.http.post(`${this.URL}/ovh/generar`, valoresOrdenPago, { headers: this.httpHeaders }).subscribe({

        next: (res: any) => {
          window.open(`https://ovh.veracruz.gob.mx/ovh/formatoReferenciado.do?lineaCaptura=${res.trim()}`)
          Swal.fire({
            icon: 'success',
            title: 'Linea de captura generada',
            confirmButtonText: 'Volver',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.replace("http://localhost:4200/pagos");
            }
          })
        }, error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: error.error.error,
            showConfirmButton: false,
            timer: 1700
          });
        }
      })
    }


  }

}
