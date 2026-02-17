export interface ApiValidationError {
  message: string;
  errors?: { path: string; message: string }[];
}