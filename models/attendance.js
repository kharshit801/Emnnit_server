const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    studentRegNo:{
        type: String,
        required: true
    },

    studentName:{
        type: String,
        required: true
    },

    date:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        required: true
    }



});

const Attendance = mongoose.model('Attendance', attendanceSchema, 'ECMS1');
module.exports = Attendance;