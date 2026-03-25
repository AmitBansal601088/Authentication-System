import express from 'express'
import { registeredUser ,verifyUser}  from '../controller/user.controller.js'

const router= express.Router()
router.post('/register',registeredUser)
router.get('/verify/:token',verifyUser)
export default router