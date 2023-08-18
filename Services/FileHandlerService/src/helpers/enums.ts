export enum fileType {
    IMG = "IMG", 
    DOC = "DOC",
    ATTACH = "ATTACH"
}

export type fileTypeStrings = keyof typeof fileType;