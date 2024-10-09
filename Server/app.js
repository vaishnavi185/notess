import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connect from './Config/database.js';
import router from './routes/userroots.js';
import path from 'path';
import { fileURLToPath } from 'url';
import UserController from './Controllers/UserController.js';
import pdfmodel from './models/files.js';

dotenv.config();

const app = express();

const Port = process.env.PORT || 9001;
const Database_url = process.env.DATABASE_URL;

// Enable CORS for your front-end
app.use(cors({
  origin: 'http://localhost:9006', // Change this to your front-end URL during production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Use middleware to parse JSON
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





// Database connection
connect(Database_url);


// Define routes
app.use('/api/user', router);

// Start the server
app.listen(Port, () => {
  console.log(`Server listening at http://localhost:${Port}`);
});

export { app };