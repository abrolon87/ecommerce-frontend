import { Component, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;

  userFullName?: string; 

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,

    private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
       // Subscribe to authentication state changes
       this.oktaAuthService.authState$.subscribe(

        (result) => {
          console.log(result);
          console.dir(result);
          result.isAuthenticated ? this.isAuthenticated = true : this.isAuthenticated = false;
          
          this.getUserDetails();
  
        }
  
      );
  }

  getUserDetails() {

    if (this.isAuthenticated) {
      // Fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name

      this.oktaAuth.getUser().then(

        (res) => {
          console.log(res);
          console.log(res.name);
          this.userFullName = res.name;
          const email = res.email;
          this.storage.setItem('userEmail', JSON.stringify(email));

        }

      );
    }
  }

  logout() {

    // Terminates the session with Okta and removes current tokens.

    this.oktaAuth.signOut();

  }

}


