import { Injectable } from '@angular/core';
import { AuthService } from '../services/identity/auth.service';
import { PermissionConstant } from '../constants/permission-constant';

@Injectable({
    providedIn: 'root',
})
export class HasPermissionHelper {
    constructor(private authService: AuthService) {}
    // hasPermissions(permissions: string[]): boolean {
    //     const userPermissions =
    //         this.authService.getUserCurrent()?.roleNames || [];
    //     console.log(userPermissions);
    //     if (
    //         userPermissions.includes(PermissionConstant.Admin) ||
    //         userPermissions.includes(PermissionConstant.Master)
    //     ) {
    //         return true;
    //     }
    //     return permissions.every(
    //         (permission) =>
    //             userPermissions.includes(permission) ||
    //             (permission.endsWith('.V') &&
    //                 userPermissions.includes(permission.split('.V')[0]))
    //     );
    // }

    hasPermissions(permissions: string[]): boolean {
        const userPermissions =
            this.authService.getUserCurrent()?.roleNames || [];
        const result = permissions.some((permission) => {
            const hasExactMatch = userPermissions.includes(permission);
            const hasVariantMatch =
                permission.endsWith('.V') &&
                userPermissions.includes(permission.split('.V')[0]);
            return hasExactMatch || hasVariantMatch;
        });
        return result;
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
