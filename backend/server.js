require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const errorMiddleware = require('./midddlewares/error');

// routes
const authRoutes = require('./routes/auth');
const constitutionRoutes = require('./routes/constitution');

const app = express();
connectDB();

// Middleware
// It's good practice to have a flexible CORS policy.
// The wildcard "*" is okay for development, but for production, you might want to restrict it.
// Example: app.use(cors({ origin: 'https://your-frontend-domain.com' }));
app.use(cors()); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send("welcome to ushauriAI!");
});

// API Routes
app.use('/api', authRoutes);
app.use('/api', constitutionRoutes);

// Error handling middleware should be last
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000; // Use a default port for local development

app.listen(PORT, () => {
  console.log(`Server is running for local development on port ${PORT}`);
});

// **IMPORTANT:** Export the app for Vercel to use
module.exports = app;
