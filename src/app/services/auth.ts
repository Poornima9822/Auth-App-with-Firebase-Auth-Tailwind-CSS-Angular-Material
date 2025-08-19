import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'
import { IUser } from '../models/iuser.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #auth = inject(Auth)
  #router = inject(Router)
  #snackBar = inject(MatSnackBar)

  get user$(): Observable<User | null>{
    return authState(this.#auth)
  }
  
  async createUserWithEmailAndPassword(iUser : IUser){
    try {
      const registeredUser = await createUserWithEmailAndPassword(this.#auth, iUser.email, iUser.password);
      this.#redirect('/home')
      return registeredUser;
    } catch (error) {
      this.#showAlert('Error creating user: ' +error)
      throw new Error('Error creating user: ' +error)
    }
  }

  #showAlert(message : string){
    this.#snackBar.open(message , 'Close', {
      duration: 3000,
      horizontalPosition : 'start',
      verticalPosition : 'bottom',

    });
  }

  #redirect(path : string){
    this.#router.navigate([path])
  }
}
