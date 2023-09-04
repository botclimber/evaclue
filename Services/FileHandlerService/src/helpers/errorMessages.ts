export const errorMessages = {
  USER_NOT_AUTHORIZED: {status: 401, text: "User is not authorized"},
  TOKEN_REQUIRED: {status: 401, text: "Token required"},
  INVALID_TOKEN: {status: 401, text: "Token not valid"},
  ADMIN_NOT_FOUND: {status: 401, text: "This type of regist can only be done by specific users"},
  NO_PERMISSION: {status: 401, text: "Not sufficient user rights"},
  NO_FILES_OR_KEY: {status: 401, text: "No files sent, or object key wrongly defined!"},
  MISSING_ID_PARAM: {status: 403, text: "Please refer id with your request."},
  MISSING_PARAMS: {status: 403, text: "Some url params missing!"}
} as const;
