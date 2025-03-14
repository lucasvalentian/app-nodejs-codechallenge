export interface ResponseDto<T> {
    code: string | number;
    message: string;
    data: T
}
