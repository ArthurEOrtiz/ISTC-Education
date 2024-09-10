interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string | ErrorResponse;
}