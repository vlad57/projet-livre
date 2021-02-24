import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {HttpCallService} from '../services/http-call.service';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  authenticationService: AuthenticationService;
  messageError: string;

  loginForm = new FormGroup({
    email: new FormControl(this.email),
    password: new FormControl(this.password)
  });

  constructor(public router: Router, public authenticationServices: AuthenticationService) {
    this.authenticationService = authenticationServices;
  }

  ngOnInit() {
    if (history.state.email && history.state.password) {
      this.email = history.state.email;
      this.password = history.state.password;

      this.loginForm.setValue({'email': this.email, 'password': this.password});
    }
  }

  async onSubmit() {

    const ret =  this.authenticationService.login(this.loginForm.get('email').value, this.loginForm.get('password').value);

    ret.subscribe(() => {}, error => {
        if (error.status === 404) {
          this.messageError = 'Email invalide';
        } else {
          this.messageError = 'Mot de passe incorrecte';
        }
      },
    );

    return false;

  }

}
