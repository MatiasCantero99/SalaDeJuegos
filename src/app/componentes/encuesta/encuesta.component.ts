import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [NgIf,NgFor, ReactiveFormsModule, CommonModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})
export class EncuestaComponent implements OnInit {

  encuestaForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService){}

  ngOnInit(): void {
    this.encuestaForm = this.fb.group({
      nombre: ['', [Validators.required,Validators.pattern('^[a-zA-ZñÑ]+$')]],
      apellido: ['',[Validators.required, Validators.pattern('^[a-zA-ZñÑ]+$')]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
      opinion: ['', Validators.required], 
      opciones: ['', Validators.required], 
      intereses: this.fb.group({
        Ahorcado: [false],
        MayorOMenor: [false],
        Blackjack: [false],
        Preguntado: [false]
      }, { validators: this.alMenosUnoSeleccionado })
    });
  }


  alMenosUnoSeleccionado(group: FormGroup) {
    const seleccionados = Object.values(group.value).some(value => value);
    return seleccionados ? null : { requerido: true };
  }


  async enviar() {
  if (this.encuestaForm.invalid) {
    this.encuestaForm.markAllAsTouched();
    return;
  }

  if (!this.authService.isLoggedIn$.value) {
    this.toastr.warning('Debes estar logueado para enviar la encuesta.', 'Atención');
    return;
  }

  const user = await this.authService.getUser();
  if (!user) {
    this.toastr.error('No se pudo obtener el usuario.', 'Error');
    return;
  }
  const respuestas = this.encuestaForm.value;

  if (respuestas.edad < 18 || respuestas.edad > 99){
    this.toastr.error('Revisa el registro', 'Error');
    return;
  }


  const payload = {
    mail: user.email,
    nombre: respuestas.nombre,
    apellido: respuestas.apellido,
    edad: respuestas.edad,
    telefono: respuestas.telefono,
    opinion: respuestas.opinion,
    consola: respuestas.opciones,
    ahorcado: respuestas.intereses.Ahorcado,
    mayoromenor: respuestas.intereses.MayorOMenor,
    blackjack: respuestas.intereses.Blackjack,
    preguntado: respuestas.intereses.Preguntado,
  };

  try {
    const supabase = this.authService.getSupabase();
    const { error } = await supabase.from('encuesta').insert([payload]);

    if (error) {
      console.error('Error al guardar encuesta:', error.message);
      this.toastr.error('Hubo un problema al guardar la encuesta.', 'Error');
    } else {
      this.toastr.success('Encuesta enviada con éxito.', '¡Éxito!');
      this.encuestaForm.reset();
    }
  } catch (err) {
    console.error('Error inesperado:', err);
  }
}


}
