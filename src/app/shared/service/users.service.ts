import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import { Subject } from "rxjs";
import { UserFullDto } from "../model/user-full-dto.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import jwt_decode from 'jwt-decode'
import {tap} from "rxjs/operators";
import {UserMinimalDto} from "../model/user-minimal-dto.model";
import {UserCreationDto} from "../model/user-creation-dto.model";
import {Address} from "../model/address.model";
import {UserPatchDto} from "../model/user-patch-dto.model";
import {EducationFullDto} from "../model/education-full-dto.model";
import {ExperienceFullDto} from "../model/experience-full-dto.model";

interface AuthTokensResponse{
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private urlBase: string = environment.apiUrlBase;
  authenticationStatusChanged: Subject<boolean> = new Subject<boolean>();
  adminsChanged = new Subject();
  usersChanged = new Subject();

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
    return this.http.post<AuthTokensResponse>(this.urlBase + 'login', {username: username, password: password}).pipe(
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

  getAdmins() {
    return this.http.get<UserMinimalDto[]>(this.urlBase + "admins");
  }

  addAdmin(userEmail: any) {
    return this.http.post(this.urlBase + "admins/" + userEmail, null);
  }

  removeAdmin(userEmail: any) {
    return this.http.delete(this.urlBase + "admins/" + userEmail);
  }

  checkIfEmailIsFree(email: string) {
    return this.http.get<boolean>(this.urlBase + "users/" + email + "/is-email-free");
  }

  createUser(newUser: UserCreationDto) {
    return this.http.post(this.urlBase + "users", newUser);
  }

  getCurrentUserDetails() {
    return this.http.get<UserFullDto>(this.urlBase + "users/current-user-details");
  }

  getUserDetailsByEmail(userEmail: string) {
    return this.http.get<UserFullDto>(this.urlBase + "users/" + userEmail + "/user-details");
  }

  uploadPhotoByEmail(userEmail: string, photoFile: File) {
    const formData = new FormData();
    formData.append("photo", photoFile, photoFile.name);
    return this.http.post(this.urlBase + "users/" + userEmail + "/upload-photo", formData)
  }

  uploadCurrentUserPhoto(photoFile: File) {
    const formData = new FormData();
    formData.append("photo", photoFile, photoFile.name);
    return this.http.post(this.urlBase + "users/upload-photo", formData)
  }

  // patchCurrentUser(userPatchDto: UserPatchDto) {
  //   return this.http.patch(this.urlBase + "users/" + , userPatchDto);
  // }

  patchUser(userEmail: string, userPatchDto: UserPatchDto) {
    return this.http.patch(this.urlBase + "users/" + userEmail, userPatchDto);
  }

  deleteUser(userEmail: string) {
    return this.http.delete(this.urlBase + "users/" + userEmail);
  }

  deleteUserEducation(userEmail: string, educationId: number) {
    return this.http.delete(this.urlBase + "users/" + userEmail + "/education/" + educationId);
  }

  deleteUserExperience(userEmail: string, experienceId: number) {
    return this.http.delete(this.urlBase + "users/" + userEmail + "/experience/" + experienceId);
  }

  getUserEducation(userEmail: any, educationId: number) {
    return this.http.get<EducationFullDto>(this.urlBase + "users/" + userEmail + "/education/" + educationId);
  }

  getUserExperience(userEmail: any, experienceId: number) {
    return this.http.get<ExperienceFullDto>(this.urlBase + "users/" + userEmail + "/experience/" + experienceId);
  }

  createUserEducation(userEmail: any, educationFullDto: EducationFullDto) {
    return this.http.post(this.urlBase + "users/" + userEmail + "/education", educationFullDto);
  }

  createUserExperience(userEmail: any, experienceFullDto: ExperienceFullDto) {
    return this.http.post(this.urlBase + "users/" + userEmail + "/experience", experienceFullDto);
  }

  editUserEducation(userEmail: any, educationId: number, educationFullDto: EducationFullDto) {
    return this.http.put(this.urlBase + "users/" + userEmail + "/education/" + educationId, educationFullDto);
  }

  editUserExperience(userEmail: any, experienceId: number, experienceFullDto: ExperienceFullDto) {
    return this.http.put(this.urlBase + "users/" + userEmail + "/experience/" + experienceId, experienceFullDto);
  }



  emitAuthenticationStatusChanged(){
    this.authenticationStatusChanged.next(!!this.currentUser);
  }

  emitAdminsChanged() {
    this.adminsChanged.next(null);
  }

  emitUsersChanged() {
    this.usersChanged.next(null);
  }
}
