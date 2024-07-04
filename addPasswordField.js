const { connectStudentDetails } = require('./dbConfig');
const StudentModel = require('./models/student');

const addPasswordField = async () => {
  try {
    // Wait for the database connection
    const connection = await connectStudentDetails;
    
    // Get the Student model
    const Student = StudentModel.getModel();
    
    // Check if Student model is available
    if (!Student) {
      throw new Error("Student model is not initialized");
    }

    // Update all documents to add the password field
    const result = await Student.updateMany(
      { password: { $exists: false } }, // Find documents where password doesn't exist
      { $set: { password: null } } // Set password to null for these documents
    );

    console.log(`Updated ${result.modifiedCount} documents`);
  } catch (err) {
    console.error("Error adding password field:", err);
  } finally {
    process.exit(0);
  }
};

addPasswordField();