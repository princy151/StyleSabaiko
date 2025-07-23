// make a function (Logic)
const userModel = require('../models/userModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const path = require('path')
const fs = require('fs')

// 1. Creating user function
const createUser = async (req, res) => {
    //1. Get data from the user (Fname,lname, email,pp)

    //#.Dstructuring
    const { fullName, phone, email, password } = req.body;

    //2. validation 
    if (!fullName || !phone || !email || !password) {
        return res.json({
            "success": false,
            "message": "Please enter all fields!"
        })
    }                                                        // != first name xaina vanye hunxa meaning 
    //try- catch (error Handling)
    try {
        //check if the user is already exist
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "User Already Exists!"
            })
        }

        // Hash /encrypt the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, randomSalt)

        const otp = await generateOtp();
        //Save the user in database 
        const newUser = new userModel({
            //Fields:Values received from user 
            fullName: fullName,
            phone: phone,
            email: email,
            password: hashPassword,
            otp: otp
        })

        //Actually save the user in database 
        await newUser.save()             //certain time launa sakxa VANYE Await launye ho

        // sendOtp(phone, `The OTP is ${otp}`).then((res) => { }).catch((error) => { });
        
        // Send the success response
        res.json({
            "success": true,
            "message": "User created successfully"
        })


    } catch (error) {
        console.log(error)                               //resposce pathai ra ko ho catch ma 
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error!"

        })

    }

}
// 2.login user function 
const loginUser = async (req, res) => {
    // res.send('Login user api in working!')
    // check incomming data
    console.log(req.body)
    // destructuring 
    const { email, password } = req.body;
    ///validation
    if (!email || !password) {
        return res.status(400).json({
            "success": false,
            "message": "Please enter all fields!"
        })
    }
    try {
        //1. find user, if not :stop the process
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                "success": false,
                "message": "User not found!"
            })
        }
        //2.compare the password, if not :stop the process
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(400).json({
                "success": false,
                "message": "Incorrect password!"
            })
        }

        //3.generate JWT token
        //3.1 secret decryption key(.env)
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env['JWT_SECRET']
        )

        res.cookie(user.id, user.id, {
            // httpOnly: true,
            // secure: true,
            // sameSite: 'strict'
        });

        ///4. send the token, userdata,message to the user 
        return res.json({
            "success": true,
            "message": "Login Successful",
            "token": token,
            "userData": user
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "internal server error!"
        })
    }


}



const getUser = async (req, res) => {
    const user = req.user;
    const existedUser = await userModel.findById(user.id)

    if (!existedUser) {
        return res.status(400).json({
            success: false,
            message: 'User was not found.'
        })
    }
    return res.status(201).json({
        success: true,
        message: 'User details has been fetched.',
        user: existedUser
    })
}

const updateUser = async (req, res) => {

    const user = req.user;
    // if there is files, upload new & delete old
    if (req.files && req.files.image) {

        // 1. Destructure file
        const { image } = req.files;

        // 1. Generate unique name for each file
        const imageName = `${Date.now()}-${image.name}`;

        // 2. define specific path
        const imageUploadPath = path.join(__dirname, `../public/users/${imageName}`)

        // move to folder
        await image.mv(imageUploadPath)

        req.body.imageUrl = imageName;

        // # Delete Old image
        const existingUser = await userModel.findById(user.id)
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User does not exist.'
            })
        }
        // Search that image in directory
        if (req.body.image) { // if new image is uploaded, then only remove old image
            const oldImagePath = path.join(__dirname, `../public/users/${existingUser.imageUrl}`)
            if (fs.existsSync(oldImagePath)) {
                // delete from file system
                fs.unlinkSync(oldImagePath)
            }
        }
    }

    const updateParams = req.body
    delete updateParams.password; // Delete unwanted password param
    delete updateParams.email // Delete unwanted email param

    const finalUpdateParams = await removeNullUndefinedWithReduce(updateParams);
    try {
        const updatedUser = await userModel.findOneAndUpdate({ _id: user.id }, finalUpdateParams, {
            new: true
        });
        return res.status(201).json({
            success: true,
            message: 'User has been updated.',
            user: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const changePassword = async (req, res) => {
    const user = req.user;
    const {oldPassword, newPassword} = req.body
    try {
        // Find the user by ID
        const existedUser = await userModel.findById(user.id);
        if (!existedUser) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist.'
            })
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, existedUser.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect Old Password!'
            })
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        existedUser.password = hashedPassword;
        await existedUser.save();

        return res.status(201).json( { success: true, message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        })
    };
}



function removeNullUndefinedWithReduce(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
            acc[key] = typeof value === 'object' ? removeNullUndefinedWithReduce(value) : value;
        }
        return acc;
    }, {});
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(201).json({
            success: true,
            users: users,
            message: 'Users has been fetched.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        })
        
    }
}

const deleteUser = async (req, res) => {
    const existingUser = await userModel.findById(req.params.id)
    if (!existingUser) {
        return res.status(404).json({
            success: false,
            message: 'User does not exist.'
        })
    }

    const oldImagePath = path.join(__dirname, `../public/users/${existingUser.imageUrl}`)

    if (fs.existsSync(oldImagePath)) {
        // delete from file system
        fs.unlinkSync(oldImagePath)
    }

    try {
        await userModel.findOneAndDelete({ _id: req.params.id })
        return res.status(201).json({
            success: true,
            message: "User has been deleted."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const sendOtp = async (to, message) => {
    const url = 'https://api.managepoint.co/api/sms/send';
    const apiKey = process.env['SMS_API_KEY'];
    const payload = {
      apiKey,
      to,
      message,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
}

const generateOtp = async (length = 6) => {
    const characters = '0123456789'; // OTP will only contain numbers
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
}

// exporting 
module.exports = {
    createUser,
    loginUser,
    getUser,
    updateUser,
    changePassword,
    getUsers,
    deleteUser
}
