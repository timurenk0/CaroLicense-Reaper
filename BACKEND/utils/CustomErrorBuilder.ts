type CustomApiErrorPayload = {
    code: string,
    message: string,
    hint?: string,
    status: number
}

export class CustomApiError extends Error {
    code: string;
    message: string;
    hint?: string | undefined;
    status: number;


    constructor({ code, message, hint, status }: CustomApiErrorPayload) {
        super(message);

        this.code = code;
        this.message = message;
        this.hint = hint;
        this.status = status;
    }
}