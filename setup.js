const path = require("path");
const fittxt = ["Burn dem Cals🔥🔥", "Get Sweatin'🌡🔥", "Eat Some Steel💪🏽🏋🏽‍♂️"];
const progtxt = [
  "R.I.P Keyboard🙏🏽",
  "Hello,World!🌎",
  "Did Someone say Stackoverflow??🤖",
];

const appIcon = path.join(__dirname, "assets/icons/iconl.png");
const trayIcon = path.join(__dirname, "assets/icons/trayicon.png");

const reminderpath = path.join(__dirname, "data/reminders.json");

module.exports = { trayIcon, appIcon, reminderpath, fittxt, progtxt };
