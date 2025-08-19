import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { LogoComponent } from '../shared/logo/logo';
import { MatButtonModule } from '@angular/material/button';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationError } from '../shared/util/form.errors';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';


@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    LogoComponent,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent implements OnInit {
  REGISTER_FORM_PROPS = {
    EMAIL: 'email',
    USER_NAME : 'username',
    PASSWORD: 'password',
  };

  
  hide = signal(true);
  
  registerForm!: FormGroup;
  
  // dependency injection
  #formBuilder = inject(FormBuilder);
  #authService = inject(AuthService);
  
  ngOnInit(): void {
    this.registerForm = this.#formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      // can be use like this also
      [this.REGISTER_FORM_PROPS.USER_NAME] : new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
  }

  getError(ctrl: AbstractControl, name: string): string {
    return FormValidationError.getFormControlErrorMessage(ctrl, name);
  }

  async register(){
    try {
      await this.#authService.createUserWithEmailAndPassword(
      this.registerForm.value,
    );
    } catch (error) {
      
    }
  }
}
