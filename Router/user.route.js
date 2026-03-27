import express from 'express'
import {registeredUser, verifyUser, loginUser, getMe, logoutUser, forgotPassword, resetPassword}  from '../controller/user.controller.js'
import {isLoggedIn} from '../middleware/auth.middleware.js'

const router= express.Router()
router.post('/register',registeredUser)
router.get('/verify/:token',verifyUser)
router.post('/login',loginUser)
router.get('/profile',isLoggedIn,getMe)
router.get('/logout',isLoggedIn,logoutUser)
router.post('/forgotpassword',forgotPassword)
router.post('/resetpassword/:token',resetPassword)

export default router   