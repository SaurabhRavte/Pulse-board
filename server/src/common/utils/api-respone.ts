import { Response } from "express";

interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

class ApiResponse {
  static ok<T = unknown>(
    res: Response,
    message: string,
    data: T | null = null,
  ): Response<ApiResponseBody<T>> {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created<T = unknown>(
    res: Response,
    message: string,
    data: T | null = null,
  ): Response<ApiResponseBody<T>> {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}

export default ApiResponse;
