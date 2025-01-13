import express, { Router } from "express";
const router: Router = express.Router()
import { prismaClient } from "@repo/db"

router.get('/sign-up', async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const user = await prismaClient.user.findFirst({
        where: {
            email
        }
    })
    if (user) {
        res.json({
            msg: "User with Email already exists"
        })
    }
    res.json({
        msg: "working"
    })

})
router.get('/sign-in', (req, res) => {
    const { email, password } = req.body


})
router.post('/room', (req, res) => {
    const { email, password } = req.body


})

export default router