import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoginCredentials } from 'src/app/utils/LoginCreds';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.required]]
    })
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value)
    }
    else {
      const data: LoginCredentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      }
      this.firebaseService.loginWithEmailPass(data).then((res) => {
        console.log(res);
        this.router.navigate(['detect-seed-quality']);
      }).catch(err => {
        console.error(err);
      })
    }
  }

}
