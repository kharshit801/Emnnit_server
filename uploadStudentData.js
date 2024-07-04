const { connectStudentDetails } = require('./dbConfig');
const StudentModel = require('./models/student');
const studentData = require('../csvjson.json');

const uploadData = async () => {
  try {
    // Wait for the database connection
    const connection = await connectStudentDetails;
    
    // Get the Student model
    const Student = StudentModel.getModel();
    
    // Check if Student model is available
    if (!Student) {
      throw new Error("Student model is not initialized");
    }

    // Insert the data
    await Student.insertMany(studentData);
    console.log("Students data uploaded successfully");
  } catch (err) {
    console.error("Error uploading student data:", err);
  } finally {
    process.exit(0);
  }
};

uploadData();

