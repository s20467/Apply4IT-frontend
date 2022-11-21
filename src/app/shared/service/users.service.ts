import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import { Subject } from "rxjs";
import { UserFullDto } from "../model/user-full-dto.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import jwt_decode from 'jwt-decode'
import {tap} from "rxjs/operators";

interface AuthTokensResponse{
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private UrlBase: string = environment.apiUrlBase;
  authenticationStatusChanged: Subject<boolean> = new Subject<boolean>();

  currentUser: UserFullDto | null = null;

  constructor(private http: HttpClient, private router: Router) {
    let access_token: string | null = localStorage.getItem('apply4it_access_token');
    if(access_token) {
      let decodedJwt = jwt_decode(access_token);
      this.currentUser = new UserFullDto();
      // @ts-ignore
      this.currentUser.email = decodedJwt['sub'];
      // @ts-ignore
      this.currentUser.authorities = decodedJwt['authorities'];
      this.emitAuthenticationStatusChanged()
    }
  }

  login(username: string, password: string){
    return this.http.post<AuthTokensResponse>(this.UrlBase + 'login', {username: username, password: password}).pipe(
      tap((response: AuthTokensResponse) => {
        localStorage.setItem("apply4it_access_token", response.access_token);
        localStorage.setItem("apply4it_refresh_token", response.refresh_token);
        let decodedJwt = jwt_decode(response.access_token);
        this.currentUser = new UserFullDto();
        // @ts-ignore
        this.currentUser.email = decodedJwt['sub'];
        // @ts-ignore
        this.currentUser.authorities = decodedJwt['authorities'];
        this.emitAuthenticationStatusChanged();
      })
    );
  }

  logout(){
    this.currentUser = null;
    localStorage.removeItem("apply4it_access_token");
    localStorage.removeItem("apply4it_refresh_token");
    this.emitAuthenticationStatusChanged();
    this.router.navigate(['/'])
  }

  isLoggedIn(){
    return !!this.currentUser;
  }

  isAdmin(){
    if(this.currentUser == null) {
      return false;
    }
    return this.currentUser.authorities.includes("ROLE_ADMIN");
  }

  emitAuthenticationStatusChanged(){
    this.authenticationStatusChanged.next(!!this.currentUser);
  }

}
