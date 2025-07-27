const router = require('express').Router()
const { body } = require('express-validator')
const userControllers = require('../controllers/userControllers')
const { authGuard, adminGuard } = require('../middleware/authGuard')

// Make a create user API
router.post('/create', userControllers.createUser)
//login user api
router.post('/login',  [
  // Validate the email
  body('email').isEmail().withMessage('Invalid email format')
               .normalizeEmail(), // sanitize email

  // Validate the password (must be at least 8 characters)
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[\W_]/).withMessage('Password must contain at least one special character')
    .trim(), // sanitize password

], userControllers.loginUser)

router.get('/me', authGuard, userControllers.getUser)

router.patch('/update/me', authGuard, userControllers.updateUser)

router.patch('/change-password', authGuard, userControllers.changePassword)

router.get('/admin/get-all', adminGuard, userControllers.getUsers)

router.delete('/admin/:id', adminGuard, userControllers.deleteUser)

router.post('/verify-otp', userControllers.verifyOtp);

// --- Forgot password routes added below ---

// Step 1: Request OTP to email
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail()
], userControllers.forgotPassword);

// Step 2: Reset password using OTP
router.post('/reset-password', [
  body('email').isEmail().withMessage('Email is required').normalizeEmail(),
  body('otp').notEmpty().withMessage('OTP is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Must contain a lowercase letter')
    .matches(/\d/).withMessage('Must contain a number')
    .matches(/[\W_]/).withMessage('Must contain a special character')
    .trim()
], userControllers.resetPasswordWithOtp);

module.exports = router;
