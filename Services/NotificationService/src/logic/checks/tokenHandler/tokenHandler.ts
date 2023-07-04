import {Request} from "express"
import {User} from "../../types/typeModels"
import jwt from "jsonwebtoken"

// ?? if left value is null or undefined || is left value is false
const SECRET: string = process.env.SECRET ?? ""

export function tokenHandler<T>(req: Request): Promise<T & User>{

    return new Promise( (r, e) => {

        const tokenFromQuery: any = req.query.token
        const tokenFromHeader: () => string | undefined = () => {
            const header: string | undefined = req.headers['authorization']

            if(header) return header.split(" ")[1]
            return undefined
        }

        const token = (tokenFromQuery)? tokenFromQuery : tokenFromHeader()
        
        if(token){
            jwt.verify(token, SECRET, (err: any, decoded: any) => {
                if (err)
                    e({msg: 'Failed to auth token'})

                if(!(decoded.id && decoded.type && decoded.email)) 
                    e({msg: 'missing required keys'})

                r(Object.assign({}, req.body as T, decoded as User))

            })

        }else e({msg: 'authorization must exist in headers'})

    })
}