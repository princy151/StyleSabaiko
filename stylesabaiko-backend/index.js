const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/database');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const morgan = require('morgan');
const { default: rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const session = require('express-session');
const path = require('path')
const fs = require('fs')

//2. creating an express app
const app = express();

// XSS Prevention
// app.use(helmet());

// josn config
app.use(express.json())

//file upload config
app.use(fileUpload())

// Make a public folder access to outside
app.use(express.static('./public'))

// app.use(morgan("dev"))

// Ensure the audit directory exists
const auditLogDir = path.join(__dirname, 'audit');
if (!fs.existsSync(auditLogDir)) {
  fs.mkdirSync(auditLogDir);
}

// Create a write stream for logs
const logStream = fs.createWriteStream(path.join(auditLogDir, 'access.log'), { flags: 'a' });

// Custom format with timestamp
morgan.token('timestamp', () => new Date().toISOString());

const logFormat = '[:timestamp] :method :url :status :response-time ms';

// Use Morgan with custom format
app.use(morgan(logFormat, { stream: logStream }));


// Rate limit
// const limiter = rateLimit({
// 	windowMs: 20 * 60 * 1000, // 20 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window`
// 	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// })


// app.use(limiter)

//cors config
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200

}
app.use(cors(corsOptions))

//configuration dotenv
dotenv.config()


//connecting to the databades
connectDB();

// Initialize session
app.use(session({
  secret: process.env['SESSION_SECRET'],
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 20 * 60 * 1000,
    httpOnly: true,
    secure: true,
  }
}));

// Middleware to reset session expiry on activity
app.use((req, res, next) => {
  if (req.session) {
    req.session._garbage = Date.now();
    req.session.touch();
  }
  next();
});

//3. deffining the port
const PORT = process.env.PORT;


// Configuring routes
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/product', require('./routes/productRoutes'))
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/order', require('./routes/orderRoutes'))

//4. starting the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server-app is running on port ${PORT}`)
})

//exporting
module.exports = app;