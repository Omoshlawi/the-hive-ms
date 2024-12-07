import { NextFunction, Request, Response } from "express"

const requireUser = () => async(req:Request, res:Response, next:NextFunction)=>{

}

export default requireUser