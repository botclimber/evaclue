export const errorMessages = {
  USER_NOT_AUTHORIZED: {status: 401, text: "User is not authorized"},
  TOKEN_REQUIRED: {status: 401, text: "Token required"},
  INVALID_TOKEN: {status: 401, text: "Token not valid"},
  ADMIN_NOT_FOUND: {status: 401, text: "This type of regist can only be done by specific users"},
  NO_PERMISSION: {status: 401, text: "Not sufficient user rights"},
  ALL_REQUIRED: {status: 401, text: "All fields required"},
  REPEATED_REVIEW: {status: 403, text: "You already made a review for this location. Wait until you are able to review it again."},
  MISSING_PARAMS: {status: 403, text: "Some url params missing!"}
} as const;
