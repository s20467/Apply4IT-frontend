import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, Observable, switchMap, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { UsersService } from "./users.service";


interface AccessTokenResponse{
    access_token: string;
}

@Injectable({
    providedIn: 'root'
})
export class JwtRefreshInterceptor implements HttpInterceptor{

    constructor(private usersService: UsersService, private http: HttpClient, private router: Router){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if(this.usersService.isLoggedIn() && !req.url.endsWith('refresh-token')) {
        return next.handle(req).pipe(
          map(x => x),
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status == HttpStatusCode.Unauthorized) {
              return this.getRefreshedTokenRequest().pipe(
                switchMap((response: AccessTokenResponse) => {
                  this.setAccessToken(response.access_token)
                  return this.http.request(req);
                }));
            }
            return throwError(error);
          })
        );
      }
      else
        return next.handle(req);
    }


  getRefreshedTokenRequest() {
    return this.http.get<AccessTokenResponse>(environment.apiUrlBase + 'refresh-token', {headers: new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('apply4it_refresh_token')})});
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('apply4it_access_token', accessToken);
  }

}
