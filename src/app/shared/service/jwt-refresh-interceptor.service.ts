import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {map, mergeMap, Observable, throwError} from "rxjs";
import { catchError, retry, tap } from "rxjs/operators";
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

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { //maybe flatmap
      // console.log(req.url)
      if(this.usersService.isLoggedIn() && !req.url.endsWith('refresh-token')) {
        // console.log(this.usersService.isLoggedIn());
        // console.log(req.url)
        return next.handle(req).pipe(
          catchError((error) => {
            // console.log(error)
            // console.log(caught)
            if (error instanceof HttpErrorResponse && error.status == HttpStatusCode.Unauthorized) {
              this.http.get<AccessTokenResponse>(environment.apiUrlBase + 'refresh-token', {headers: new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('apply4it_refresh_token')})})
                .subscribe({
                  next: (response: AccessTokenResponse) => {
                    this.setAccessToken(response.access_token)
                    // console.log("otrzymano nowy token")
                    return this.http.request(this.getNewRequest(req));
                  },
                  error: (error) => {
                    this.usersService.logout();
                    this.router.navigate(['login']);
                    return throwError(error);
                  }})
            }
            return throwError(error);
          }));
      }
      else
        return next.handle(req);
    }

    getNewRequest(req: HttpRequest<any>) {
      return req.clone({headers: req.headers.append('Authorization', 'Bearer ' + localStorage.getItem('apply4it_access_token'))})
    }


    setAccessToken(accessToken: string) {
      localStorage.setItem('apply4it_access_token', accessToken);
    }



  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     if(this.usersService.isLoggedIn())
    //         return next.handle(req).pipe(
    //             tap(
    //                 () => {},
    //                 (error: HttpErrorResponse) => {
    //                     if(error.status == 401){
    //                         this.http.get<AccessTokenResponse>(environment.apiUrlBase + 'refresh-token', {headers: new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('apply4it_refresh_token')})})
    //                             .subscribe((response: AccessTokenResponse) => {
    //                                 localStorage.setItem('apply4it_access_token', response.access_token);
    //                                 return next.handle(
    //                                   req.clone({ headers: req.headers.append('Authorization', 'Bearer ' + localStorage.getItem('apply4it_access_token')) })
    //                                 )
    //                             },
    //                             (error) => {
    //                                 this.usersService.logout();
    //                                 this.router.navigate(['login']);
    //                                 return;
    //                             })
    //                     }
    //                 })
    //         );
    //     else
    //         return next.handle(req);
    // }

}
