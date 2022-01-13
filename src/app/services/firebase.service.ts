import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { LoginCredentials } from '../utils/LoginCreds';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  user = new BehaviorSubject(null);

  constructor(public auth: AngularFireAuth) { }

  async loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((res) => {
      console.log("user successfilly logged in using google : ", res);
    }).catch(err => {
      console.log(err);
    });
  }

  async loginWithEmailPass(data: LoginCredentials) {
    return new Promise<firebase.auth.UserCredential>((resolve, rej) => {
      this.auth.signInWithEmailAndPassword(data.email, data.password).then(res => {
        resolve(res);
      }).catch(err => {
        rej(err);
      })
    })
  }

  async getAccesstoken() {
    return firebase.auth().currentUser?.refreshToken;
  }

  async logout() {
    this.auth.signOut();
  }
}
