import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorage } from './token.storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private token = inject(TokenStorage);

  private API = 'http://localhost:3000/auth';

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.API}/login`, { email, password });
  }

  register(data: { email: string; password: string; name: string }) {
    return this.http.post<{ token: string }>(`${this.API}/register`, data);
  }

  saveToken(token: string) {
    this.token.set(token);
  }

  logout() {
    this.token.clear();
  }

  loginWithGoogle() {
    // redirige al backend para iniciar OAuth
    window.location.href = `${this.API}/google`;
  }
}
