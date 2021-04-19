const { app } = require("electron");

module.exports = function AboutPanelOptions() {
  app.setAboutPanelOptions({
    applicationName: "Desky",
    applicationVersion: app.getVersion(),
    version: "",
    copyright: "© Copyright Desky " + new Date().getFullYear(),
  });
};
