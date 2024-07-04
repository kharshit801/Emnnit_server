const express = require('express');
const router = express.Router();
const {getModel} = require("../models/student");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login route
router.post('/', async (req, res) => {
    try {
        const { regNo, password } = req.body;
        
        console.log('Login request body:', req.body);
        console.log('Attempting to find student with regNo:', regNo);
    
        const StudentModel = getModel();
        
        if (!StudentModel) {
            console.error('StudentModel is not initialized');
            return res.status(500).json({ message: "Database not ready" });
        }
    
        // Find the student in the database
        const student = await StudentModel.findOne({ regNo: parseInt(regNo) });
        
        console.log('Student found:', student);
    
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
    
        let isValidPassword;
        if (student.password) {
            // Check against stored password
            isValidPassword = await bcrypt.compare(password, student.password);
        } else {
            const lastName = student.name.split(' ').pop();
            const expectedPassword = lastName.toLowerCase() + student.regNo.toString().slice(-4);
            isValidPassword = (password === expectedPassword);
        }

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    
        // If credentials are valid, create a JWT token
        const token = jwt.sign({ regNo: student.regNo }, 'Team_Auxin_was_here', { expiresIn: '1h' });
        console.log('Token created:', token);

        // Send the token and some user info back to the client
        console.log('Login successful:', student.regNo, student.name, student.group, student.semester, student.email);
        res.json({
            token,
            user: {
                regNo: student.regNo,
                name: student.name,
                group: student.group,
                semester: student.semester,
                email: student.email
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});

// Password reset route
router.post('/reset-password', async (req, res) => {
    try {
        const { regNo, currentPassword, newPassword } = req.body;
        
        const StudentModel = getModel();
        if (!StudentModel) {
            return res.status(500).json({ message: "Database not ready" });
        }

        const student = await StudentModel.findOne({ regNo: parseInt(regNo) });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check current password
        let isValidPassword;
        if (student.password) {
            isValidPassword = await bcrypt.compare(currentPassword, student.password);
        } else {
            const lastName = student.name.split(' ').pop();
            const expectedPassword = lastName.toLowerCase() + student.regNo.toString().slice(-4);
            isValidPassword = (currentPassword === expectedPassword);
        }

        if (!isValidPassword) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        student.password = hashedPassword;
        await student.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: "An error occurred during password reset" });
    }
});

// Token verification route
router.post('/verify-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, 'Team_Auxin_was_here', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        res.json({ user: decoded });
    });
});

module.exports = router;