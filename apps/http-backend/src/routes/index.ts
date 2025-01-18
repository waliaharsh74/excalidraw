import express, { Router } from "express";
const router: Router = express.Router()
import { prismaClient } from "@repo/db"
import { signUpSchema, signInSchema } from "@repo/common/types";
import bcrypt from "bcrypt"
import { JWT_SECRET } from "@repo/backend-common/config"
import jwt from "jsonwebtoken"

router.get('/sign-up', async (req, res) => {
    try {

        const { firstName, lastName, email, password } = req.body
        const parsedData = signUpSchema.safeParse(req.body)

        if (!parsedData.success) {
            console.log(parsedData.error);
            res.json({
                message: parsedData.error.message
            })
            return;
        }


        const isUser = await prismaClient.user.findFirst({
            where: {
                email
            }
        })
        if (isUser) {
            res.json({
                msg: "User with Email already exists"
            })
            return
        }
        const hashedPassword = await bcrypt.hash(password, 3);
        const user = await prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword
            }
        })
        res.json({
            id: user.userId
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: "Oopa something went wrong"
        })

    }

})
router.get('/sign-in', async (req, res) => {
    const { email, password } = req.body
    const parsedData = signUpSchema.safeParse(req.body)

    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: parsedData.error.message
        })
        return;
    }
    const user = await prismaClient.user.findFirst({ where: { email } })
    if (!user) {
        res.json({
            msg: "User with Email doesn't exists please try again"
        })
        return
    }
    const isPasswordCorrect = bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        res.status(403).json({
            msg: "Wrong Password!!"
        })
        return
    }
    const token = jwt.sign({
        userId: user?.userId
    }, JWT_SECRET);

    res.json({
        token
    })






})
router.post('/room', (req, res) => {
    const { email, password } = req.body


})

export default router