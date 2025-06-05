import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.scss'
})
export class QuienSoyComponent {

}
