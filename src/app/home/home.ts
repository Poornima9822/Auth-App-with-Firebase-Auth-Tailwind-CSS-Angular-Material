import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  #authService = inject(AuthService);
  user$ = this.#authService.user$;

  logOut(){
    this.#authService.logOut();
  }
}
