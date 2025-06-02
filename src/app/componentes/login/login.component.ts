import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../service/auth/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const user = await this.authService.loginWithEmail(this.mail, this.password);

      const perfil = await this.authService.getUsuarioExtendido();

      this.router.navigate(['/home']);
    } catch (error: any) {
      this.error = 'Email o contraseña incorrectos';
      console.error('Login error:', error.message);
    }
  }

  autocompletar() {
    this.mail = "bifidi3985@acedby.com";
    this.password = "hola123";
  }
}
