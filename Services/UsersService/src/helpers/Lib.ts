export async function passwordGenerator (length: number = 12, password: string = ""): Promise<string> {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    if(length === 0) return password;
    else return passwordGenerator(length - 1, `${password}${charset.charAt(Math.floor(Math.random() * charset.length))}`)
    
}