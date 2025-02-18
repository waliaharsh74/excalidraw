import express, { Router } from "express";
const router: Router = express.Router()
import { prismaClient } from "@repo/db"
import { signUpSchema, signInSchema, CreateRoomSchema } from "@repo/common/types";
import bcrypt from "bcrypt"
import { JWT_SECRET } from "@repo/backend-common/config"
import jwt from "jsonwebtoken"
import { middleware } from "../middleware";

router.post('/sign-up', async (req, res) => {
    try {

        const { firstName, lastName, email, password } = req.body
        const parsedData = signUpSchema.safeParse(req.body)

        if (!parsedData.success) {
            res.json({
                fieldErros: parsedData.error.flatten().fieldErrors,
                msg: "Parsing Data failed"

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
            id: user.userId,
            msg: "User Created Successfully!"

        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: "Oops something went wrong"
        })

    }

})
router.post('/sign-in', async (req, res) => {
    const { email, password } = req.body
    const parsedData = signInSchema.safeParse(req.body)

    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            fieldErros: parsedData.error.flatten().fieldErrors,
            msg: "Parsing Data failed"
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
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect);
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
router.post('/create-room', middleware, async (req, res) => {
    // @ts-ignore: 
    const userId = req.userId
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            fieldErrors: parsedData.error.flatten().fieldErrors,
            msg: "Parsing Data failed"
        })
        return
    }
    const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.slug,
            adminId: userId
        }
    })
    res.json({
        msg: "room created Successfully",
        roomId: room.roomId

    })


})
router.post('/get-room/:id', async (req, res) => {
    try {


        // @ts-ignore: 
        const userId = req.userId

        const roomId = Number(req.params.id);
        const chat = await prismaClient.chat.findMany({
            where: {
                roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        })
        res.json({
            msg: "messages fetched Successfully",
            chat: chat

        })
    } catch (error) {
        console.log(error);

        res.json({
            chat: []
        })
    }


})
router.post('/get-slug/:slug', async (req, res) => {
    try {

        const slug = (req.params.slug);
        const roomId = await prismaClient.room.findUnique({
            where: {
                slug
            },

        })
        res.json({
            msg: "room-Id fetched Successfully",
            roomId: roomId?.roomId

        })
    } catch (error) {
        console.log(error);

        res.json({
            msg: "room-Id fetching failed",
        })
    }


})
router.get('/get-shapes/:id', async (req, res) => {
    try {

        const roomId = Number(req.params.id);
        const allShapes = await prismaClient.room.findUnique({
            where: {
                roomId
            }
        })
        res.json({
            shapes: allShapes
        })




    } catch (error) {
        console.log(error);

        res.json({
            msg: "fetching shapes failed",
        })
    }


})

export default router