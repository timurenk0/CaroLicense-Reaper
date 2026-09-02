export type ServerError = {
    code: string,
    message: string,
    hint?: string,
    status: number
}