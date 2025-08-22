import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signOut,
  User,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../models/iuser.model';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #auth = inject(Auth);
  #router = inject(Router);
  #snackBar = inject(MatSnackBar);
  // add firestore

  #firestore = inject(Firestore);

  get user$(): Observable<User | null> {
    return authState(this.#auth);
  }

  async createUserWithEmailAndPassword(iUser: IUser) {
    try {
      const registeredUser = await createUserWithEmailAndPassword(
        this.#auth,
        iUser.email,
        iUser.password,
      );
      this.#saveUser(registeredUser.user, iUser.username!);
      this.#redirect('/home');
      return registeredUser;
    } catch (error) {
      this.#showAlert('Error creating user: ' + error);
      throw new Error('Error creating user: ' + error);
    }
  }

  #showAlert(message: string) {
    this.#snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
    });
  }

  #redirect(path: string) {
    this.#router.navigate([path]);
  }

  async #saveUser(user: User, username: string) {
    const { email, uid } = user;
    const userData = {
      email,
      username,
      uid,
    };
    const collectionRef = collection(this.#firestore, 'users');
    await setDoc(doc(collectionRef, user.uid), userData);
  }

  async logOut() {
    await signOut(this.#auth);
    this.#redirect('/');
    this.#showAlert('Logout successful');
  }

  async signInWithEmailAndPassword(iUser: IUser) {
    try {
      const loggedUser = await signInWithEmailAndPassword(
        this.#auth,
        iUser.email,
        iUser.password,
      );
      this.#redirect('/home');
    } catch (error) {
      this.#showAlert('Error logging in: ' + error);
      // throw new Error('Error logging in: ' + error);
    }
  }

  async sendPasswordResetEmail(email: string){
    try {
      await sendPasswordResetEmail(this.#auth, email);
      this.#showAlert("Password reset email sent");
      this.#redirect('/')
    } catch (error) {
      this.#showAlert('Error sending password reset email: ' +error );
      throw new Error('Error sending password reset email: ' + error);
    }
  }
}
