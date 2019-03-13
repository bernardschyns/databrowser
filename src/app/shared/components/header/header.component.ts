import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AuthenticationService]
})
export class HeaderComponent implements OnInit {
  private errorMsg: string;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {

    
  }

  logout() {
    this.authService.logout().then(result => {
      if(result) {
        this.router.navigate(['/']);
      }
    }).catch((errorMessage) =>{
      this.errorMsg = errorMessage;
    });
  }

}
