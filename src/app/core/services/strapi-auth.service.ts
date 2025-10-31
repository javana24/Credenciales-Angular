import { Injectable, signal, computed } from '@angular/core';
import { Credentials } from '../models/credentials';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USERS_KEY = 'REGISTERED_USERS';
  private readonly SESSION_KEY = 'AUTHENTICATION';

  public user = signal<any | null>(null);
  public error = signal<any | null>(null);

  constructor(private router: Router) {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (session) {
      this.user.set(JSON.parse(session)); 
    }
  }

  register(credentials: Credentials) {

    const users = this.getRegisteredUsers();

    const exists = users.some(u => u.email === credentials.email);
    if (exists) {
      throw new Error('El usuario ya está registrado');
    }

    users.push(credentials);

    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private getRegisteredUsers(): Credentials[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  login(credentials: Credentials): boolean {
    /*const body ={
      identifier:credentials.email,
      password:credentials.password
    };
    this.http.post<LoginResponse>{"http://localhost:1337/api/auth/local", body}.suscribe({
      next:(data:LoginResponse)=>(
        localStorage.setItem{'token',data.jwt})
    })
*/
    const users = this.getRegisteredUsers();

    
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
      this.user.set(user);

      return true;
    }

    return false; 
  }


  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    this.user.set(null);

    this.router.navigate(['/login']);
  }


  isAuthenticated(): boolean {
    return this.user() !== null;
  }


  getCurrentUser() {
    return this.user();
  }
}
