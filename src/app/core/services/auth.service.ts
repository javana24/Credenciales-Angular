import { Injectable, signal, computed } from '@angular/core';
import { Credentials } from '../models/credentials';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 🔹 Nombre de las claves en localStorage
  private readonly USERS_KEY = 'REGISTERED_USERS';
  private readonly SESSION_KEY = 'AUTHENTICATION';

  // 🔹 Signal reactiva que guarda el usuario actual (null si no hay sesión)
  public user = signal<any | null>(null);

  constructor(private router: Router) {
    // 🔹 Al crear el servicio, revisamos si hay sesión activa guardada
    const session = localStorage.getItem(this.SESSION_KEY);
    if (session) {
      this.user.set(JSON.parse(session)); // Restauramos sesión
    }
  }

  /**
   * 🔹 REGISTRAR UN NUEVO USUARIO
   * Guarda el nuevo usuario (email y password) en el localStorage
   */
  register(credentials: Credentials) {
    // Obtenemos los usuarios registrados previamente
    const users = this.getRegisteredUsers();

    // Verificamos si el email ya existe
    const exists = users.some(u => u.email === credentials.email);
    if (exists) {
      throw new Error('El usuario ya está registrado');
    }

    // Agregamos el nuevo usuario al listado
    users.push(credentials);

    // Guardamos de nuevo la lista en localStorage
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  /**
   * 🔹 OBTENER LISTA DE USUARIOS REGISTRADOS
   */
  private getRegisteredUsers(): Credentials[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  /**
   * 🔹 INICIAR SESIÓN
   * Comprueba que las credenciales coincidan con las registradas.
   */
  login(credentials: Credentials): boolean {
    const users = this.getRegisteredUsers();

    // Busca un usuario que coincida en email y password
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      // Guardamos la sesión activa
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));

      // Actualizamos la Signal
      this.user.set(user);

      return true; // Login correcto
    }

    return false; // Login fallido
  }

  /**
   * 🔹 CERRAR SESIÓN
   */
  logout() {
    // Elimina la sesión activa
    localStorage.removeItem(this.SESSION_KEY);

    // Limpia el signal
    this.user.set(null);

    // Redirige al login
    this.router.navigate(['/login']);
  }

  /**
   * 🔹 VERIFICAR SI HAY SESIÓN ACTIVA
   */
  isAuthenticated(): boolean {
    return this.user() !== null;
  }

  /**
   * 🔹 OBTENER USUARIO ACTUAL
   */
  getCurrentUser() {
    return this.user();
  }
}
