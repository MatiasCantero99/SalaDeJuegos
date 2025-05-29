import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

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

  login() {
    // Implement login logic here
    console.log('Username:', this.mail);
    console.log('Password);', this.password);
  }

  autocompletar() {
    this.mail = "mail.com";
    this.password = "1234";
  }
}
