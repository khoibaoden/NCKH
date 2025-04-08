import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const tokenString = localStorage.getItem('authToken'); // Lấy token từ localStorage
        const token = tokenString ? JSON.parse(tokenString) : null; // Parse JSON thành object
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token.accessToken}`,
                },
            });
        }
        return next.handle(req);
    }
}
