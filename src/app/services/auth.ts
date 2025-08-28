import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signOut,
  User,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
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
      // this.#saveUser(registeredUser.user, iUser.username!);
      // this.#redirect('/home');
      this.#updateUserProfile(registeredUser.user, {
        displayName: iUser.username,
      });
      this.#showAlert('Please verify your email address '+registeredUser.user.email)
      this.#sendEmailVerification(registeredUser.user)
      await signOut(this.#auth)

      return registeredUser;
    } catch (error) {
      this.#showAlert('Error creating user: ' + error);
      throw new Error('Error creating user: ' + error);
    }
  }

  async #updateUserProfile(user: User, partialUser : Partial<User>){
    try {
      await updateProfile(user, partialUser)
    } catch (error) {
        this.#showAlert('Error updating user profile: ' + error);
        throw new Error('Error updating user profile ' + error);
    }
  }

  // to send verification email
  async #sendEmailVerification(user : User){
    try {
      await sendEmailVerification(user);
      this.#showAlert('Email verification sent')
    } catch (error) {
      this.#showAlert('Error sending email verification: ' + error);
      throw new Error('Error sending email verification' + error);
    }
  }

  async signInWithGoogle(){
    try {
      const provider = new GoogleAuthProvider();
      const user = await signInWithPopup(this.#auth, provider)
      const profile = getAdditionalUserInfo(user)
      if(profile?.isNewUser){
        await this.#saveUser(user.user, profile.profile)
        this.#showAlert('User created successfully')
      }
      this.#redirect('/home')
    } catch (error) {
      this.#showAlert('Error signing with Google'+ error)
      throw new Error('Error signing with Google' + error);
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

  async #saveUser(user: User, profile?: Record<string ,unknown> | null) {
    const { email, uid, displayName, photoURL } = user;
    const userData = {
      email,
      displayName,
      uid,
      photoURL,
      ...profile,
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
      if (!loggedUser.user.emailVerified) {
        this.#showAlert('Please verify your email address');
        await signOut(this.#auth);
        return;
      }
      this.#saveUser(loggedUser.user);
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
