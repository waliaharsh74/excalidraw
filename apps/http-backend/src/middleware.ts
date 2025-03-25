import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
export function middleware(req: Request, res: Response, next: NextFunction) {
    try {

        const token = req.headers["authorization"]?.split(' ')[1] ?? "";
        
        if(!token){
            res.status(403).json({
                message: "Unauthorized"
            })
            return
        }
    

        const decoded = jwt.verify(token, JWT_SECRET);


        if (decoded) {
            // @ts-ignore: 
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                message: "Unauthorized"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"JWT Verification failed"
        })
    }
}