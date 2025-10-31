
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/local-store-auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let auth = inject(AuthService);
  let router = inject(Router);
  let authenticated = auth.user()!=null;
  if(!authenticated)
    router.navigate(['/login']);
  return authenticated;
};
