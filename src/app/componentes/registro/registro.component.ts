import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createClient, User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth/auth.service';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  mail: string;
  password: string;

  constructor(private router: Router, private toastr: ToastrService, private authService: AuthService) {
    this.mail = '';
    this.password = '';
  }

  async register() {
    if (this.password.length < 6) {
      this.toastr.error('La contraseña debe tener al menos 6 caracteres.', 'Contraseña inválida');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: this.mail,
      password: this.password,
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('duplicate key')) {
        this.toastr.error('El correo ya está registrado. Probá con otro.', 'Correo duplicado');
      } else {
        this.toastr.error('Ocurrió un error al registrarte.', 'Error');
      }
      console.error('Error al registrar:', error.message);
      return;
    }

    if (data.user) {
      this.saveUserData(data.user);
    }
  }

  saveUserData(user: User) {
    supabase.from('miTabla').insert([
      { authId: user.id, email: this.mail }
    ]).then(async ({ error }) => {
      if (error) {
        console.error('Error al guardar datos del usuario:', error.message);
        this.toastr.error('No se pudo guardar la información del usuario', 'Error');
        return;
      }

      try {
        await this.authService.loginWithEmail(this.mail, this.password);
        this.authService.isLoggedIn$.next(true);
        this.toastr.success('Usuario registrado exitosamente', '¡Éxito!');
        this.router.navigate(['/home']);
      } catch (loginError: any) {
        console.error('Error al loguear automáticamente:', loginError.message);
        this.toastr.error('Error al iniciar sesión automáticamente', 'Error');
      }
    });
  }


}
