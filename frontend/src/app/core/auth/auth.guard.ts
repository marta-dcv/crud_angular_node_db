import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorage } from './token.storage';

export const authGuard: CanActivateFn = () => {
  const token = inject(TokenStorage);
  const router = inject(Router);

  if (token.isLogged()) return true;

  router.navigate(['/login']);
  return false;
};
