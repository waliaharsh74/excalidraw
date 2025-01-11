import express, { Router } from "express";
const router: Router = express.Router()

router.get('/sign-up', (req, res) => {
    const { firstName, lastName, email, password } = req.body
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