// const { connectNotifications } = require('../dbConfig');
// const mongoose = require('mongoose');
// const notificationSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     message: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: String,
//         required: true
//     },
//     time: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true });

// const getNotificationModel = (department, semester) => {
//     const collectionName = `${department}_${semester}_Notifications`;
//     return connectNotifications.model(collectionName, notificationSchema);
// };

// module.exports = getNotificationModel;
// const mongoose = require('mongoose');
// const { connectNotifications } = require('../dbConfig');

// const notificationSchema = new mongoose.Schema({
//   group: { type: String, required: true },
//   semester: { type: Number, required: true },
//   title: { type: String, required: true },
//   message: { type: String, required: true },
//   date: { type: Date, default: Date.now },
// });

// let Notification;

// connectNotifications.then(connection => {
//   Notification = connection.model('Notification', notificationSchema);
// });

// module.exports = {
//   getModel: () => Notification
// };



const mongoose = require('mongoose');
const { connectNotifications } = require('../dbConfig');

const notificationSchema = new mongoose.Schema({
  group: { type: String, required: true },
  semester: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const getNotificationModel = async (group, semester) => {
  const connection = await connectNotifications;
  const collectionName = `${group}_${semester}_Notifications`;
  return connection.model(collectionName, notificationSchema);
};

module.exports = getNotificationModel;