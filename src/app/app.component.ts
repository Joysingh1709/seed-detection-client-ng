import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from 'firebase/auth';
import { BehaviorSubject, Subject } from 'rxjs';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'seed-detection-client-ng';
  appName: string = "Seed Quality Detection";

  user: any;

  currentUrl = new BehaviorSubject<string>('');

  constructor(public auth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private router: Router) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
      user ? this.router.navigate(['/']) : this.router.navigate(['signin']);
    });
  }

  signOut() {
    this.firebaseService.logout().then(() => {
      console.log("logged out");
    })
  }
}
