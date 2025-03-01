import { NextFunction, Request, Response } from "express"
import { Response as ResponseUtil } from '@repo/ts-common/services'
import { JWT_SECRET } from '@repo/ts-common/secret'
import jwt from 'jsonwebtoken'

export interface CustomRequest extends Request {
    user?: any
}

export const authMiddleware = async (req:CustomRequest,res:Response,next:NextFunction) => {
    const token = req.headers.authorization

    if(!token) {
        return ResponseUtil(res,401,'Unauthorized',{})
    }

    const decoded = jwt.verify(token,JWT_SECRET as string)

    if(!decoded) {
        return ResponseUtil(res,401,'Unauthorized',{})
    }

    req.user = decoded

    next()
}
