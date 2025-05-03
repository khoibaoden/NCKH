import { Injectable } from '@angular/core';
import { AuthService } from '../services/identity/auth.service';
import { PermissionConstant } from '../constants/permission-constant';

@Injectable({
    providedIn: 'root',
})
export class HasPermissionHelper {
    constructor(private authService: AuthService) {}
    hasPermissions(permissions: string[]): boolean {
        const userPermissions =
            this.authService.getUserCurrent()?.roleNames || [];
        if (
            userPermissions.includes(PermissionConstant.Admin) ||
            userPermissions.includes(PermissionConstant.Master)
        ) {
            return true;
        }
        return permissions.every(
            (permission) =>
                userPermissions.includes(permission) ||
                (permission.endsWith('.V') &&
                    userPermissions.includes(permission.split('.V')[0]))
        );
    }

    hasPermissionMain = (permission: string) => {
        const userPermissions =
            this.authService.getUserCurrent()?.permissions || [];
        if (
            userPermissions.includes(PermissionConstant.Admin) ||
            userPermissions.includes(PermissionConstant.Master)
        ) {
            return true;
        }
        return userPermissions.includes(permission);
    };
}
