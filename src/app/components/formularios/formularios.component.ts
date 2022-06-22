import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.css']
})
export class FormulariosComponent implements OnInit {

  private valoresOrdenPago = {
    numero: 0,
    fecha: "",
    descripcion: "",
    nombre: "",
    curp: "",
    plantel: 0
  };
  private httpHeaders = new HttpHeaders({ 'content-type': 'application/json', });
  private URL: string = "http://localhost:3000"
  private fecha: any
  private date = new Date();
  public forma!: FormGroup
  public condicion: boolean = false
  public alumnos: any = null;
  private datos!: {
    id_pago: number;
    descripcion: string;
  };

  profileForm = new FormGroup({
    termino: new FormControl(''),
    boolean: new FormControl(),
    boolean2: new FormControl(),
  })

  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private http: HttpClient, private api: ApiService) {

    this.datos = {
      id_pago: this.activatedRoute.snapshot.params['id_pago'],
      descripcion: this.activatedRoute.snapshot.params['descripcion']
    }

    this.crearFormulario()
  }

  ngOnInit(): void {

  }


  buscarAlumno(): any {

    let valores = {
      termino: this.profileForm.controls['termino'].value,
      boolean: this.profileForm.controls['boolean'].value,
      // matricula: this.profileForm.controls['matricula'].value
    }
    // console.log(valores)


    this.http.post(`${this.URL}` + "/alumnos", valores, { headers: this.httpHeaders }).subscribe((resp: any) => {
      this.alumnos = resp;

      if (this.alumnos) {
        // this.condicion = true
        this.forma.patchValue({ nombre: resp.nombre })
        this.forma.patchValue({ curp: resp.CURP })

        Swal.fire({
          icon: 'success',
          title: 'Alumno encontrado',
          showConfirmButton: false,
          timer: 1500
        })

      } else {
        // this.condicion = false;

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se han encontrado coincidencias!',
          showConfirmButton: false,
          timer: 1500
        })
      }

    })
  }

  onChange(option: any, name: string) {

    let checkbox = document.getElementsByName("check") as NodeListOf<HTMLInputElement>
    // console.log(checkbox)

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
      id_pago: [this.datos.id_pago, [Validators.required]],
      descripcion: [this.datos.descripcion, [Validators.required]],
      fecha: [this.fecha, [Validators.required]],
      nombre: ['', [Validators.required]],
      curp: ['', [Validators.required]],
    })
  }

  obtenerOvh(numero: string, fecha: string, descripcion: string, nombre: string, CURP: string): any {
    this.valoresOrdenPago.numero = parseFloat(numero),
    this.valoresOrdenPago.fecha = fecha,
    this.valoresOrdenPago.descripcion = descripcion,
    this.valoresOrdenPago.nombre = nombre;
    this.valoresOrdenPago.curp = CURP;

    this.http.post(`${this.URL}` + "/ovh/generar", this.valoresOrdenPago, { headers: this.httpHeaders }).subscribe((resp: any) => {
      resp;
      
      if (resp != "") {
        // console.log(resp);
        window.open('https://ovh.veracruz.gob.mx/ovh/formatoReferenciado.do?lineaCaptura=' + resp)

      } else {
        console.log("llego vacio");
      }




    })
  }
}
