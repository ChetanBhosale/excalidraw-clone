import {Response as respone} from 'express'

export const Response = (res:respone,status:number,message:string,data:any) => {
    return res.status(status).json({
        message,
        data
    })
}