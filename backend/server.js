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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); 


app.use(cors({
  origin: "*",
}));



app.get("/", (req, res) => {
  res.send("welcome to ushauriAI!");
});

// Routes
app.use('/api', authRoutes);
app.use('/api', constitutionRoutes);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
