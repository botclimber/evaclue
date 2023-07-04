import jwt from "jsonwebtoken"

export async function tokenReader<T>(token: string): Promise<T>{
    try{
        const result: T = jwt.verify(token, process.env.SECRET ?? "", (err, data) => {
            if(err) {
                console.log(err)
                throw "invalid token"
            }else return data
        }) as T
        
        return result

    }catch(e){
        console.log(e)
        throw e
    }
}