export {};

// declare module 'express-session' {
//     interface SessionData {
//         singin: boolean
//     }
// }

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
    authorized: boolean
  }
}