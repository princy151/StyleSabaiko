
const jwt = require('jsonwebtoken')

const authGuard = (req, res, next) => {
    // #. Check incomming data
    // console.log(req.headers)

    // 1. Get auth headers (content type, authorization ...)
    // 2. Get 'authorization'
    const authHeader = req.headers.authorization;

    // 3. if not found stop the process (res)
    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: 'Authorization header not found!'
        })
    }

    // 4. authorization format : 'Bearer tokensdfgdfghj'
    // 5. get only token by splitting by 'space' (0-Bearer,1-token)
    const token = authHeader.split(' ')[1]

    // 6. if token not found or mismatch (stop the process, res)
    if (!token || token === '') {
        return res.status(400).json({
            success: false,
            message: 'Token is missing!'
        })
    }

    // 7. verify the token
    // 8. if verified, next
    // 9. not : not authenticated
    try {

        // verify the token and get user information
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedUser;
        next()


    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Not Authenticated!"
        })

    }

}


// Admin Guard
const adminGuard = (req, res, next) => {
    
    // #. Check incomming data
    // 1. Get auth headers (content type, authorization ...)
    // 2. Get 'authorization'
    const authHeader = req.headers.authorization;
    console.log(req.params);
    

    // 3. if not found stop the process (res)
    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: 'Authorization header not found!'
        })
    }

    // 4. authorization format : 'Bearer tokensdfgdfghj'
    // 5. get only token by splitting by 'space' (0-Bearer,1-token)
    const token = authHeader.split(' ')[1]

    // 6. if token not found or mismatch (stop the process, res)
    if (!token || token === '') {
        return res.status(400).json({
            success: false,
            message: 'Token is missing!'
        })
    }

    // 7. verify the token
    // 8. if verified, next
    // 9. not : not authenticated
    try {

        // verify the token and get user information
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedUser;
       
        // check if user is admin or not
        if (!req.user.isAdmin) {
            return res.status(400).json({
                success: false,
                message: "Permission Denied!"
            })
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Not Authenticated!"
        })

    }

}



module.exports = {
    authGuard,
    adminGuard
}