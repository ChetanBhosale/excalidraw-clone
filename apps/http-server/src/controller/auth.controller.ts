import { Request, Response } from "express";
import { prisma } from "@repo/database";
import { Response as ResponseUtil } from '@repo/ts-common/services';
import bcrypt from 'bcryptjs'
import { CustomRequest } from "../middleware/auth.middleware";
import { ISignupSchema, ICreateRoomSchema } from "@repo/ts-common/zodParser";
import { JWT_SECRET } from "@repo/ts-common/secret";
import jwt from 'jsonwebtoken'

export const signup = async (req: CustomRequest, res: Response) => {
    try {
        const response = ISignupSchema.parse(req.body);

        if(!response) {
            return ResponseUtil(res,400,'Invalid request body',{})
        }


        const {email,password,name} = response;



        const hashedPassword = await bcrypt.hash(password,10)

        const user = await prisma.user.create({
            data : {
                email,
                password : hashedPassword,
                name
            }
        })
 
        return ResponseUtil(res,201,'user signup successfully!',user)

    } catch (error:any) {
        console.log(error)
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
        let secret = JWT_SECRET as string || 'secret'
        const token = jwt.sign({id : user.id},secret,{expiresIn : '1h'})
        
        return ResponseUtil(res,200,'Login successful',{token,user})
        
    } catch (error) {
        console.log(error)
        return ResponseUtil(res,500,'Internal server error',{})
    }
}

export const room = async(req:CustomRequest,res:Response) => {
    try {
        const response = ICreateRoomSchema.parse(req.body);
        if(!response) {
            return ResponseUtil(res,400,'Invalid request body',{})
        }

        const {name,slug} = response;
        
        let userId = req.user?.id;

        if(!userId) {
            return ResponseUtil(res,401,'Unauthorized',{})
        }

        try {
            const room = await prisma.room.create({
                data : {
                    name,
                    slug,
                    adminId : userId
                }
            })
    
        } catch (error) {
            return ResponseUtil(res,500,'Room already exists with the name please try again with another name',{})
        }

       
        return ResponseUtil(res,201,'Room created successfully',room)
    } catch (error) {
        return ResponseUtil(res,500,'Internal server error',{})
    }
}