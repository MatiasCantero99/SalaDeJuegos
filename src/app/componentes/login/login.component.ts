import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../service/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  mail: string = "";
  password: string = "";
  error: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  async login() {
    try {
      const user = await this.authService.loginWithEmail(this.mail, this.password);

      const perfil = await this.authService.getUsuarioExtendido();

      const supabase = this.authService.getSupabase();
      await supabase
      .from('logs')
      .insert({
        mail: perfil.mail,
        fecha: new Date().toISOString()
      });

      this.router.navigate(['/home']);
    } catch (error: any) {
      this.toastr.error('Mail o contraseña incorrectos.', 'Error');
      this.error = 'Email o contraseña incorrectos';
      console.error('Login error:', error.message);
    }
  }

  autocompletar() {
    this.mail = "bifidi3985@acedby.com";
    this.password = "hola123";
  }
}
