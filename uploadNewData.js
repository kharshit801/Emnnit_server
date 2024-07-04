const {connectStudenDetails} = require("./dbConfig");
const StudentModel = require("./models/student");
const studentDataNew = require("../csvjson.json");

const uploadStudentDetails = async () => {
    try {
        const connection = await connectStudenDetails;
        console.log("connection insitiated");
        const student  = StudentModel.getModel();
        if (!student){
            throw new Error("Student model is not initialized");
        }
        await student.insertMany(studentDataNew);
        console.log("Student data uploaded successfully");

        
    } catch (error) {
        console.log("Error in uploading student dettails : ", error);
        
    }
    finally{
        process.exit(0);
    }
}
console.log("uploading student data...");
uploadStudentDetails();
