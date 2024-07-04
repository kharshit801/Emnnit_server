const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const { connectNotifications, connectStudentDetails, connectClassSchedules } = require('./dbConfig');
const ClassScheduleRouter = require("./routes/classSchedule");
const NotificationRouter = require("./routes/notification");
const UploadStudentsRouter = require("./routes/uploadStudents");
const getclassScheduleModel = require("./models/classSchedule");
const LoginRouter = require("./routes/login");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = 8000;
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Establish database connections
Promise.all([
  connectNotifications,
  connectStudentDetails,
  connectClassSchedules
]).then(() => {
  console.log("All database connections established");

//Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected',socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected',socket.id);
  });
});

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}


//Routes

app.use('/api/classSchedule', ClassScheduleRouter);

app.use('/notifications', NotificationRouter);

app.use("/uploadStudents", UploadStudentsRouter);

app.use('/login',LoginRouter );

app.post('/api/upload-weekly-schedule', upload.single('file'), async (req, res) => {
  try {
    const { group, semester, weeklySchedule } = req.body;
    let schedules = JSON.parse(weeklySchedule);

    if (req.file) {
      const filePath = req.file.path;
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

      if (fileExtension === 'csv') {
        schedules = await parseCSV(filePath);
      } else if (fileExtension === 'json') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        schedules = JSON.parse(fileContent);
      }

      fs.unlinkSync(filePath); // Delete the uploaded file after processing
    }

    const ClassSchedule = await getclassScheduleModel(group, semester);

    // Clear existing schedules for this group and semester
    await ClassSchedule.deleteMany({ group, semester });

    // Convert the weekly schedule to the format your database expects
    const formattedSchedules = Object.entries(schedules).flatMap(([day, timeSlots]) =>
      Object.entries(timeSlots).map(([time, { subject, venue }]) => ({
        group,
        semester,
        day,
        subjectName: subject,
        venue,
        time,
      }))
    );

    await ClassSchedule.insertMany(formattedSchedules);
    console.log('Emitting scheduleUpdate', { group, semester });

    // Emit the update event
    io.emit('scheduleUpdate', { group, semester });

    res.json({ message: 'Weekly schedule uploaded successfully' });
  } catch (error) {
    console.error('Error uploading weekly schedule:', error);
    res.status(500).json({ error: 'Failed to upload weekly schedule' });
  }
});







server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
}).catch((err) => {
console.error("Error connecting to databases:", err);
});
