import usermodel from '../models/user.js';
import nodemailer from 'nodemailer';
import transporter from '../Config/emailconfig.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto, { sign } from 'crypto';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfmodel from '../models/files.js';
import { dirname } from 'path';
import mongoose from 'mongoose';
import express from 'express'
import { userInfo } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define the path to the 'uploads' directory in the root of the PEN_DOWN project
const uploadsDir = path.resolve(__dirname, '../uploads');




// Ensure 'uploads' directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use the correct directory path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Define PDF schema
const pdfSchema = new mongoose.Schema({
  pdf: String,
  title: String
}, { collection: 'pdfcollection' });

// Create PDF model
const Pdf = mongoose.model('Pdf', pdfSchema);

const upload = multer({
  storage: storage,
  fileFilter: pdfFilter
});

const uploadPdf = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(400).json({ status: 'failed', message: err.message });
    }

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ status: 'failed', message: 'No file uploaded' });
    }

    try {
      const title = req.body.title;
      const file = req.file.filename;

      // Save to MongoDB
      await Pdf.create({ title, pdf: file });

      res.status(200).json({ status: 'success', message: 'PDF uploaded successfully', file: req.file });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
    }


  });
};
// Fetch all PDF files from the database
const fetchPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find(); // Fetch PDFs from the database
    res.status(200).json({ status: 'success', data: pdfs });
  } catch (error) {
    console.error('Database fetch error:', error);
    res.status(500).json({ status: 'failed', message: 'Error fetching data' });
  }
};



class UserController {



  static userRegistration = async (req, res) => {
    const { name, email, password, tc, role } = req.body;

    if (!email || !name || !password || !tc || !role) {
      return res.status(400).send({ status: 'failed', message: 'Incomplete user details' });
    }

    try {
      const existingUser = await usermodel.findOne({ email });
      if (existingUser) {
        return res.status(409).send({ status: 'failed', message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new usermodel({
        name,
        email,
        password: hashedPassword,
        tc,
        role,
      });

      await newUser.save();

      const tokenExpirationDate = new Date();
tokenExpirationDate.setDate(tokenExpirationDate.getDate() + 1);
const token = jwt.sign(
  { userID: newUser._id, role: newUser.role },
  process.env.JWT_SECRET_KEY,
  { expiresIn: tokenExpirationDate }
);

      return res.status(201).send({ status: 'success', message: 'User registered successfully', token });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ status: 'failed', message: 'Registration failed' });
    }
  };

  static userlogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Ensure both email and password are provided in the request
      if (email && password) {
        const user = await usermodel.findOne({ email });

        if (user) {
          // Ensure user.password is not undefined or null
          if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
              const token = jwt.sign(
                { userID: user._id, role: user.role },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '2m' }
              );
              res.send({
                status: 'success',
                message: 'User authenticated',
                token,
                role: user.role,
                name: user.name
              });
            } else {
              res.status(401).send({ status: 'failed', message: 'Invalid email or password' });
            }
          } else {
            // If user.password is missing
            res.status(500).send({ status: 'failed', message: 'Password hash missing from the user record' });
          }
        } else {
          res.status(404).send({ status: 'failed', message: 'User not registered' });
        }
      } else {
        res.status(400).send({ status: 'failed', message: 'Incomplete login details' });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).send({ status: 'failed', message: 'Login failed due to a server error' });
    }
  };

  static userProfile = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user._id); // Assuming you have a user ID in the request
        const { name, email } = user;
        res.json({ name, email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};


  // static forgotPassword = async (req, res) => {
  //   const { email } = req.body;
  //   try {
  //     const user = await usermodel.findOne({ email });
  //     if (!user) {
  //       return res.send({ status: 'failed', message: 'User not found' });
  //     }

  //     // Generate a reset token
  //     const resetToken = crypto.randomBytes(20).toString('hex');

  //     // Set token and expiration on the user object
  //     user.resetPasswordToken = resetToken;
  //     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  //     await user.save();

  //     // Send email with the token (using nodemailer or any email service)
  //     const transporter = nodemailer.createTransport({
  //       service: 'Gmail',
  //       auth: {
  //         user: process.env.EMAIL_USER,
  //         pass: process.env.EMAIL_PASS
  //       }
  //     });

  //     const mailOptions = {
  //       to: user.email,
  //       from: process.env.EMAIL_USER,
  //       subject: 'Password Reset',
  //       text: `You are receiving this because you (or someone else) have requested to reset your password.\n\n
  //       Please click on the following link, or paste it into your browser to complete the process:\n\n
  //       http://${req.headers.host}/reset/${resetToken}\n\n
  //       If you did not request this, please ignore this email, and your password will remain unchanged.\n`
  //     };

  //     transporter.sendMail(mailOptions, (err) => {
  //       if (err) {
  //         console.log(err);
  //         return res.send({ status: 'failed', message: 'Error sending email' });
  //       }
  //       res.send({ status: 'success', message: 'Reset link sent to your email' });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.send({ status: 'failed', message: 'Error processing request' });
  //   }
  // };

  static resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
      const user = await usermodel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ status: 'failed', message: 'Password reset token is invalid or has expired' });
      }

      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.status(200).json({ status: 'success', message: 'Password has been updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'failed', message: 'Error resetting password' });
    }
  };

  static resetpassword = async (req, res) => {
    const { password } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log(req.user)
      res.send({ status: 'success', message: 'Password changed' });
    } else {
      return res.status(400).json({ status: 'failed', message: 'All fields are required' });
    }
  };
  static loggeduser = async (req, res) => {
    res.send = ({ "user": req.user })
  }
  static senduserpasswardemail = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ status: 'failed', message: 'Email is required' });
      }

      const user = await usermodel.findOne({ email: email });

      if (!user) {
        return res.status(400).json({ status: 'failed', message: 'Email does not exist' });
      }

      const secret = user._id + process.env.JWT_SECRET_KEY;
     
      const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '3600' });
      const decodedToken = jwt.decode(token);
      const expirationTime = new Date(decodedToken.exp * 1000);
console.log(expirationTime);
      // prints the expiration time in seconds
      //send email


      const link = `http://localhost:9029/api/user/reset/${user._id}/${token}`;
      console.log(link);
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM, // Sender address (e.g., '"Pen Down" <noreply@pendown.com>')
        to: user.email, // List of receivers
        subject: "Pen Down Password Reset", // Subject line
        html: `
          <p>Dear ${user.name},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p><a href="${link}">Reset Password</a></p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,</p>
          <p>The Pen Down Team</p>
        `, // HTML body
      });




      // Send email with the link here (using a mail service like nodemailer)
      res.send({ status: 'success', message: 'Email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'failed', message: 'An error occurred' });
    }
  };
  static userPassword = async (req, res) => {
    const { password } = req.body;
    const { id, token } = req.params;

    try {
      const user = await usermodel.findById(id);
      if (!user) {
        return res.status(404).json({ status: 'failed', message: 'User not found' });
      }

      const secret = user._id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, secret);

      if (password) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        await usermodel.findByIdAndUpdate(id, { $set: { password: hashedPassword } });

        return res.status(200).json({ status: 'success', message: 'Password changed successfully' });
      } else {
        return res.status(400).json({ status: 'failed', message: 'All fields are required' });
      }
    } catch (error) {
      return res.status(500).json({ status: 'failed', message: 'Invalid token or token has expired' });
    }
  };
  //send email

  // //sending pdf on  admin panel
  // const upload = multer({ dest: 'uploads/' })

  static downloadPdf = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the PDF in the database
        const pdf = await Pdf.findById(id);

        if (!pdf) {
            return res.status(404).json({ status: 'failed', message: 'PDF not found' });
        }

        // Construct the file path
        const filePath = path.join(__dirname, '../uploads', pdf.pdf);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Set the appropriate headers for file download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${pdf.title || 'download'}.pdf"`);

            // Create a read stream for the file
            const fileStream = fs.createReadStream(filePath);

            // Pipe the file stream to the response
            fileStream.pipe(res);

            // Handle errors
            fileStream.on('error', (error) => {
                console.error('Error reading file:', error);
                res.status(500).json({ status: 'failed', message: 'Error reading file' });
            });
        } else {
            res.status(404).json({ status: 'failed', message: 'File not found on server' });
        }
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ status: 'failed', message: 'Error downloading file' });
    }
};



static deletePdf = async(req, res) => {
 

  try {
      console.log('Before findById');
      const pdf = await pdfmodel.findOne({_id:req.params.id});
      console.log('After findById', pdf);

      if (!pdf) {
          return res.status(404).json({ message: 'PDF not found' });
      }

      // If the PDF exists, you can delete it
      const deletedPdf = await pdfmodel.findByIdAndDelete({_id:req.params.id});
      return res.status(200).json({ 
          message: 'PDF deleted successfully', 
          pdf: deletedPdf });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ 
          message: 'Error deleting PDF', 
          error: error.stack });
  }
}
static deleteuser = async (req, res) => {
  try {
    console.log('Before findById');
    const user = await usermodel.findOne({ _id: req.params.id });
    console.log('After findById', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user exists, delete it
    const deletedUser = await usermodel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error deleting user',
      error: error.stack,
    });
  }
};

static fetchAllUsers = async (req, res) => {
  try {
    const users = await usermodel.find();
    const userData = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
    res.status(200).json({ status: 'success', data: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'failed', message: 'Error fetching users' });
  }
};

}

export default UserController;
export { uploadPdf, fetchPdfs };