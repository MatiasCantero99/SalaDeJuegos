import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-personas',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './personas.component.html',
  styleUrl: './personas.component.scss'
})
export class PersonasComponent {
 personas: string[] = ['Juan', 'Pedro', 'Maria', 'Jose', 'Ana'];

 constructor(private router: Router) { }
 
 seleccionarPersona(persona: string) {
    this.router.navigate(['personas/detalle', persona]);
    //this.router.navigate(['personas/detalle'], { queryParams: { nombre: persona } });
 }

}
