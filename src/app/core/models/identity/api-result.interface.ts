export interface ApiResult<T> {
    [x: string]: any;
    status: boolean | null;
    message: string | '';
    data: T | null;
}
