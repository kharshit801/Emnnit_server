// const { connectClassSchedules } = require('../dbConfig');

// const mongoose = require('mongoose');
// const classScheduleSchema = new mongoose.Schema({

//     group:{
//         type: String,
//         required: true
//     },
//     semester:{
//         type: Number,
//         required: true
//     },
//     subjectName:{
//         type: String,
//         required: true
//     },
//     venue:{
//         type: String,
//         required: true
//     },
//     time:{
//         type: String,
//         required: true
//     }
// }, { timestamps: true });
// const getclassScheduleModel =(group,semester) => {
//     const collectionName = `${group}_${semester}_classSchedule`;
//     return connectClassSchedules.model(collectionName, classScheduleSchema);
// };

// module.exports = getclassScheduleModel;
const mongoose = require('mongoose');
const { connectClassSchedules } = require('../dbConfig');

const classScheduleSchema = new mongoose.Schema({
  group: { type: String, required: true },
  semester: { type: String, required: true },
  day: { type: String, required: true },
  subjectName: { type: String, required: true },
  venue: { type: String, required: true },
  time: { type: String, required: true },
}, { timestamps: true });

// let ClassSchedule;

// connectClassSchedules.then(connection => {
//   ClassSchedule = connection.model('ClassSchedule', classScheduleSchema);
// });


// //28/6/24
// const getclassScheduleModel = (group, semester) => {
//   const collectionName = `${group}_${semester}_classSchedule`;
//   return connectClassSchedules.model(collectionName, classScheduleSchema);
// };

// module.exports = getclassScheduleModel;

const getclassScheduleModel = async (group, semester) => {
  const connection = await connectClassSchedules;
  const collectionName = `${group}_${semester}_classSchedule`;
  return connection.model(collectionName, classScheduleSchema);
};

module.exports = getclassScheduleModel;

// module.exports = {
//   getModel: () => ClassSchedule
// };