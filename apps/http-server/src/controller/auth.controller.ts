import { Request, Response } from "express";
import { prisma } from "@repo/database";
import { Response as ResponseUtil } from '@repo/ts-common/services';
import bcrypt from 'bcryptjs'
import { CustomRequest } from "../middleware/auth.middleware";

export const signup = async (req: CustomRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await prisma.user.create({
            data : {
                email,
                password : hashedPassword
            }
        })

        return ResponseUtil(res,201,'user signup successfully!',user)

    } catch (error:any) {
        return res.status(500).json({
            message : "Internal server error",
            error : error
        })
    }
}

export const login = async(req:Request,res:Response) => {
    try {
        const {email,password} = req.body;

        const user = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(!user) {
            return ResponseUtil(res,401,'Invalid email or password',{})
        }   

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if(!isPasswordValid) {
            return ResponseUtil(res,401,'Invalid email or password',{})
        }
        
        
    } catch (error) {
    }
}