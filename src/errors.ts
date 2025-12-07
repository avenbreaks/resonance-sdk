export class ResonanceAPIError extends Error {
    constructor(
        public statusCode: number,
        public code: string,
        message: string
    ) {
        super(message);
        this.name = 'ResonanceAPIError';
    }
}