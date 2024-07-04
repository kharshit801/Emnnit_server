const mongoose = require('mongoose');
const { connectClassSchedules } = require('./dbConfig'); // Adjust the path as needed

// Define the schema (make sure it matches your existing schema)
const classScheduleSchema = new mongoose.Schema({
  group: { type: String, required: true },
  semester: { type: String, required: true },
  subjectName: { type: String, required: true },
  venue: { type: String, required: true },
  time: { type: String, required: true },
}, { timestamps: true });

// Sample data
const sampleClasses = [
  {
    group: 'O1',
    semester: '3',
    subjectName: 'Mathematics',
    venue: 'Room 101',
    time: '09:00 AM - 10:30 AM'
  },
  {
    group: 'O1',
    semester: '3',
    subjectName: 'Physics',
    venue: 'Lab 201',
    time: '11:00 AM - 12:30 PM'
  },
  {
    group: 'O1',
    semester: '3',
    subjectName: 'Computer Science',
    venue: 'Room 305',
    time: '02:00 PM - 03:30 PM'
  },
  {
    group: 'O1',
    semester: '3',
    subjectName: 'English',
    venue: 'Room 102',
    time: '04:00 PM - 05:30 PM'
  }
];

async function uploadSampleClasses() {
  try {
    // Connect to the database
    const connection = await connectClassSchedules;
    console.log('Connected to the database');

    // Create the model
    const collectionName = 'O1_3_classSchedule'; // Adjust as needed
    const ClassSchedule = connection.model(collectionName, classScheduleSchema);

    // Insert the sample data
    const result = await ClassSchedule.insertMany(sampleClasses);
    console.log(`${result.length} sample classes uploaded successfully`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error uploading sample classes:', error);
  }
}

// Run the upload function
uploadSampleClasses();