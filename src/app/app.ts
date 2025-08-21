import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from './login/login';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    // LoginComponent,
    RouterOutlet

  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('authenti-app');
}
