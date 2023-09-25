export const errorMessages = {
    INVALID_LOCATION: {status: 401, text: "Address mentioned is not valid"},
    USER_NOT_AUTHORIZED: {status: 401, text: "User is not authorized"},
    TOKEN_REQUIRED: {status: 401, text: "Token required"},
    INVALID_TOKEN: {status: 401, text: "Token not valid"},
    ADMIN_NOT_FOUND: {status: 401, text: "This type of regist can only be done by specific users"},
    NO_PERMISSION: {status: 401, text: "Not sufficient user rights"},
    ALL_REQUIRED: {status: 401, text: "All fields required"},
    NOT_VALID_ADDRESS: {status: 400, text: "Missing required Address fields Either(city, street, nr)"}
  } as const;
  