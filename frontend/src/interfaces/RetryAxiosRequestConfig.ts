import { InternalAxiosRequestConfig } from "axios";

export interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
