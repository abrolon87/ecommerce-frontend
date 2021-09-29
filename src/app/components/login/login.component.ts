import { Component, OnInit } from '@angular/core';

import appConfig from '../../config/app-config';
import * as OktaSignIn from '@okta/okta-signin-widget';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignIn: any;
  constructor(private oktaAuthService: OktaAuthStateService, private oktaAuth: OktaAuth) {

    this.oktaSignIn = new OktaSignIn({
      logo:"assets/images/logo.png",
      features: {
        registration: true
      },
      baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
      clientId: appConfig.oidc.clientId,
      redirectUri: appConfig.oidc.redirectUri,
      authParams: {
        pkce: true,  // Proof Key for Code Exchange
        issuer: appConfig.oidc.issuer,
        scopes: appConfig.oidc.scopes
      }
    });
   }

  ngOnInit(): void {
    this.oktaSignIn.remove();

    this.oktaSignIn.renderEl({
      el: '#okta-sign-in-widget'},
      (response: { status: string; }) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw console.error();
      }
    );
  
  }

}
