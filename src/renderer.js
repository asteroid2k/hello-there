const fs = require("fs");
const { reminderpath, appIcon } = require("../setup");
const notifier = require("node-notifier");

const checkReminders = () => {
  const list = refreshList();
  list.forEach((l) => {
    if (Date.parse(l.time) <= new Date().getTime()) {
      console.log("NOTIF");
    }
  });
};

const storeItem = (item) => {
  fs.readFile(reminderpath, "utf8", (err, jsonString) => {
    if (err) {
      //TODO:Handle file not found Error
      console.log("File read failed:", err);
      return;
    }

    try {
      reminders = JSON.parse(jsonString);
      console.log(reminders);
      reminders.push(item);
      reminders = JSON.stringify(reminders);
      fs.writeFile(reminderpath, reminders, "utf8", (err) => {
        if (err) {
          console.log("Failed to write");
        }
        console.log("write successful");
      });
    } catch (error) {
      //TODO:Handle parse Error
      console.log(error);
    }
  });
};

const deleteItem = (idn) => {
  fs.readFile(reminderpath, "utf8", (err, jsonString) => {
    if (err) {
      //TODO:Handle file not found Error
      console.log("File read failed:", err);
      return;
    }

    try {
      let reminders = JSON.parse(jsonString);
      reminders.forEach((element) => {
        if (element.id === idn) {
          console.log("match found");

          i = reminders.indexOf(element);
          reminders.splice(i, 1);
        }
      });
      reminders = JSON.stringify(reminders);
      fs.writeFile(reminderpath, reminders, "utf8", (err) => {
        if (err) {
          console.log("Failed to write");
        }
        console.log("write successful");
      });
    } catch (error) {
      //TODO:Handle parse Error
      console.log(error);
    }
  });
};

const clearItems = () => {
  let obj = [];
  obj = JSON.stringify(obj);
  fs.writeFile(reminderpath, obj, "utf8", (err) => {
    if (err) {
      console.log("Failed to write");
    }
    console.log("write successful");
  });
};

const refreshList = () => {
  try {
    let reminders = fs.readFileSync(reminderpath, "utf8");
    reminders = JSON.parse(reminders);
    return reminders;
  } catch (err) {
    fs.writeFileSync(reminderpath, JSON.stringify([]), "utf8");
  }
};

const idgen = () => {
  return (
    new Date().valueOf().toString(36) + Math.random().toString(36).substr(2)
  );
};

module.exports = {
  checkReminders,
  refreshList,
  storeItem,
  deleteItem,
  idgen,
  clearItems,
};
