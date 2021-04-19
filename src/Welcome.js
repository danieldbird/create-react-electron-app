import React, { useEffect, useState } from "react";
import Home from "./Home";
const Store = window.require("electron-store");
const store = new Store();

const { ipcRenderer } = window.require("electron");

function Welcome() {
  const [
    showWelcomeMessageAtStartup,
    setShowWelcomeMessageAtStartup,
  ] = useState(null);
  useEffect(() => {
    setShowWelcomeMessageAtStartup(store.get("showWelcomeMessageAtStartup"));
  }, []);

  const handleClearStore = () => {
    ipcRenderer.send("clear-store");
  };
  const handleRemoveStore = () => {
    ipcRenderer.send("remove-store");
  };
  const handleOpenStoreDirectory = () => {
    ipcRenderer.send("open-store-directory");
  };
  const handleEditStore = () => {
    ipcRenderer.send("edit-store");
  };
  const handleShowWelcomeMessageAtStartup = () => {
    setShowWelcomeMessageAtStartup(!showWelcomeMessageAtStartup);
    store.set("showWelcomeMessageAtStartup", !showWelcomeMessageAtStartup);
  };
  // return showWelcomeMessageAtStartup ? <Welcome /> : <Home />;

  return (
    <div className="wrapper">
      <div className="inner">
        <h1 className="welcome-title">Welcome to Desky! </h1>
        <p>
          Desky is an application that lets you overlay any information you can
          imagine at a glance on your desktop.
        </p>
        <p>We call these Desklettes.</p>
        <p>We have added a simple example Desklette to your desktop. </p>
        {/* Add a switching carousel with desklette ideas such as: Webcams, Charts, Currency, Stock Prices, Maps, Weather, Rain Radar, Tide Chart, Wave Heights. */}
        <p>
          It's basic html, css, and javascript. But can be as complex as you
          like.
        </p>
        <p>
          You can add, edit, or remove Desklettes from your desktop as you
          please on the next screen.
        </p>
        <button style={{ width: "80%" }}>Get Started!</button>
        <p>
          <input
            type="checkbox"
            name="show-at-startup"
            checked={showWelcomeMessageAtStartup}
            onChange={handleShowWelcomeMessageAtStartup}
          />
          <label htmlFor="show-at-startup">Show this message at startup.</label>
        </p>
        <button onClick={handleEditStore}>Edit config.json</button>
        <button onClick={handleClearStore}>Clear config.json</button>
        <button onClick={handleRemoveStore}>Remove config.json</button>
        <button onClick={handleOpenStoreDirectory}>Open Store Directory</button>
      </div>
    </div>
  );
}

export default Welcome;
