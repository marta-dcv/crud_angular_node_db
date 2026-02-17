import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  template: `<p style="padding:16px">Procesando login...</p>`
})
export class AuthCallbackPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) this.auth.saveToken(token);
    this.router.navigate(['/']);
  }
}
