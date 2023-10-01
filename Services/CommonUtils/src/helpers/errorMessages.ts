//TODO: decouple errorMessages cause some are service specific
export const errorMessages = {
    USER_NOT_AUTHORIZED: {status: 401, text: "User is not authorized"},
    TOKEN_REQUIRED: {status: 401, text: "Token required"},
    INVALID_TOKEN: {status: 401, text: "Token not valid"},
    ADMIN_NOT_FOUND: {status: 401, text: "This type of regist can only be done by specific users"},
    NO_PERMISSION: {status: 401, text: "Not sufficient user rights"},
    ALL_REQUIRED: {status: 401, text: "All fields required"},
    REPEATED_REVIEW: {status: 403, text: "You already made a review for this location. Wait until you are able to review it again."},
    MISSING_PARAMS: {status: 403, text: "Some url params missing!"},
    NO_FILES_OR_KEY: {status: 400, text: "No files sent, or object key wrongly defined!"},
    MISSING_ID_PARAM: {status: 403, text: "Please refer id with your request."},
    INVALID_LOCATION: {status: 401, text: "Address mentioned is not valid"},
    NOT_VALID_ADDRESS: {status: 400, text: "Missing required Address fields Either(city, street, nr or flag)"},
    INVALID_MARKER_LOCATION: {status: 409, text: "Conflict: trying to add review from existing address but with diferent location"},
    INVALID_FLAG: {status: 400, text: "Flag value is not valid"},
    NO_AVAILABILITY: {status: 200, text: "No Available residences found for this city!"},
    CLAIMED_ALREADY: {status: 400, text: "This property was already claimed by you, wait until we finish validation!"},
    ADDRESS_SEGMENT_FAULT: {status: 500, text: "Residence Owner without Address"},
    EMAIL_SEGMENT_FAULT: {status:500, text: "User without Email"}
  } as const;
  