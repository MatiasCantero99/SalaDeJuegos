import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createClient, User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth/auth.service';

const supabase = createClient(environment.supabaseUrl,environment.supabaseKey);

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
  avatarFile: File | null = null;

  constructor(private router: Router, private toastr: ToastrService, private authService : AuthService){
    this.mail = '';
    this.password = '';
  }

  register() {
  supabase.auth.signUp({
    email: this.mail,
    password: this.password,
  }).then(({ data, error }) => {
    if (error) {
      console.error('Error:', error.message);
      
    } else {

      console.log('User registered:', data.user);
      this.saveUserData(data.user!);
      
    }
  }
  );

}

  saveUserData(user: User) {

    const avatarUrl = this.saveFile().then((data) => {
      if (data) {

        supabase.from('miTabla').insert([
          { authId: user.id, email: this.mail, avatarUrl: data.path }
        ]).then(({ data, error }) => {
          if (error) {
            console.error('Error:', error.message);
          } else {
            this.authService.isLoggedIn$.next(true);
            this.toastr.success('Usuario registrado exitosamente', '¡Éxito!');
            this.router.navigate(['/home']);
          }
        });
      }
    });

  }


async saveFile() {
const { data, error } = await supabase
  .storage
  .from('images')
  .upload(`users/${this.avatarFile?.name}`, this.avatarFile!, {
    cacheControl: '3600',
    upsert: false
  });

  return data;
}

onFileSelected(event: any) {
  this.avatarFile = event.target.files[0];
}
}
