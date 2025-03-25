import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/identity/auth.service';
// import { log } from 'console';

@Injectable({
    providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const requiredPermissions = route.data['requiredPermissions'] as string[];
        const userPermissions =
            this.authService.getUserCurrent()?.permissions || [];

        // Check if user has all required permissions
        const hasPermissions = requiredPermissions.some(permission =>
            userPermissions.includes(permission)
        );

        if (!hasPermissions) {
            // Save the attempted URL to localStorage
            localStorage.setItem('redirectUrl', state.url);

            // Redirect to blank page
            this.router.navigate(['/admin/pages/blank-page']);
            return false;
        }

        // If permissions are granted, clear redirect URL
        localStorage.removeItem('redirectUrl');
        return true;
    }

}
