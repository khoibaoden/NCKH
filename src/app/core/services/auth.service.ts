import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthToken } from '../models/identity/auth-token.interface';
import { ApiResult } from '../models/identity/api-result.interface';
import { UserCurrent } from '../models/identity/user-current.interface';
import { LocalStorage } from '../enums/local-storage.enum';
import { HttpService } from './http.service';
import { RefreshTokenRequest } from '../models/identity/refresh-token-request.interface';
import { LocalStorageService } from './local-storage.service';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private httpLd: HttpLoadingService,
        private localStorageService: LocalStorageService,
        private httpService: HttpService
    ) {}

    public url = environment.url;
    isLoggedIn(): boolean {
        const token = localStorage.getItem('authToken');

        if (token) {
            return true;
        }
        return false;
    }

    // tny add
    login(request: any): Observable<any> {
        return this.httpLd
            .post('auth/login-by-username', request)
            .pipe(catchError(this.handleError));
    }

    //lấy ng dùng hiện tại
    getUserInfo(): Observable<UserCurrent | null> {
        return this.userCurrent;
    }

    private isInitAuthSubject: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    isInitAuth$: Observable<boolean> = this.isInitAuthSubject.asObservable();
    private currentUserSubject = new BehaviorSubject<any>(null);
    public userCurrent = this.currentUserSubject.asObservable();

    getUserCurrent() {
        console.log(this.currentUserSubject.value);
        return this.currentUserSubject.value;
    }

    setUserCurrent(user: any) {
        this.currentUserSubject.next(user);
    }

    //Auth token
    getAuthTokenLocalStorage(): AuthToken | null {
        const authToken: AuthToken | null = this.localStorageService.getItem(
            LocalStorage.AuthToken
        );
        return authToken;
    }

    setAuthTokenLocalStorage(authToken: AuthToken | null) {
        // console.log("sét thành công:   "+JSON.stringify(authToken));
        // this.localStorageService.setItem(LocalStorage.AuthToken, authToken);
        setTimeout(() => {
            this.localStorageService.setItem(LocalStorage.AuthToken, authToken);
        }, 300);
    }

    getUserCurrentApi(): Observable<ApiResult<UserCurrent>> {
        return this.http.get<ApiResult<UserCurrent>>(
            'https://localhost:7115/api/user/user-info'
        );
    }

    fetchUserCurrent(): Observable<ApiResult<UserCurrent>> {
        let headers = this.httpService.addSkipLoadingHeader();

        return this.http.get<ApiResult<UserCurrent>>(
            'https://localhost:7115/api/user/user-info',
            { headers }
        );
    }

    refreshToken(
        request: RefreshTokenRequest
    ): Observable<ApiResult<AuthToken>> {
        return this.http.post<ApiResult<AuthToken>>(
            'https://localhost:7115/api/auth/refresh-token',
            request
        );
    }

    hasRole(role: string): boolean {
        if (!this.currentUserSubject.value) {
            return false;
        }

        if (this.currentUserSubject.value.roleNames.includes(role)) {
            return true;
        } else {
            return false;
        }
    }

    hasRoleAsync(user: any, role: string): boolean {
        if (!user) {
            return false;
        }

        if (user.roleNames.includes(role)) {
            return true;
        } else {
            return false;
        }
    }

    logout(): Observable<ApiResult<boolean>> {
        return this.http.post<ApiResult<boolean>>(
            'https://localhost:7115/api/auth/logout',
            null
        );
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    resendEmailOtp(toEmail: string): Observable<any> {
        const requestPayload = {
            toEmail: toEmail,
            subject: 'BHDT',
            body: 'Lấy lại mật khẩu.',
        };

        return this.http.post<any>(
            `${this.url}/api/user/resend-email-otp`,
            requestPayload
        );
    }

    setPassword(payload: any): Observable<any> {
        return this.http.post(`${this.url}/api/user/set-password`, payload);
    }

    getUsers(pageSize: number = 1000): Observable<any> {
        return this.http.get<any>(
            `${this.url}/api/user/paging-info?pageSize=${pageSize}`
        );
    }

    getPagingUser(request: any): Observable<any> {
        return this.http.get('https://localhost:7115/api/user/paging-info', {
            params: request.params,
        });
    }

    getStudentDisciplineScores(params: any): Observable<any> {
        return this.http.get<any>(
            'https://localhost:7115/api/student-discipline-score/statistic-result',
            { params: params }
        );
    }
    // tny end add

    register(request: any): Observable<any> {
        return this.http.post<any>(
            'https://localhost:7115/api/auth/register-with-advisor',
            request
        );
    }

    getRoles(): Observable<any> {
        return this.http.get<any>('https://localhost:7115/api/role/paging');
    }

    getClassByAdvisor(): Observable<any> {
        return this.http.get<any>('https://localhost:7115/api/role/paging');
    }
}
