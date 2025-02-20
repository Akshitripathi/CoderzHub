import React, { useState } from "react";
import { Switch } from "@mui/material"; // Importing Material-UI for better styling
import "../styles/Settings.css";

const Settings = () => {
  const [theme, setTheme] = useState("dark");
  const [realTimeEditing, setRealTimeEditing] = useState(true);
  const [autoCommit, setAutoCommit] = useState(false);
  const [enableChat, setEnableChat] = useState(true);
  const [enableVideo, setEnableVideo] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    document.body.setAttribute("data-theme", e.target.value);
    showSaveStatus();
  };

  const toggleSetting = (setter) => {
    setter((prev) => !prev);
    showSaveStatus();
  };

  const showSaveStatus = () => {
    setSaveStatus("Settings saved!");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      {/* Status Notification */}
      {saveStatus && <p className="save-status">{saveStatus}</p>}

      <div className="settings-grid">
        {/* Theme Customization */}
        <div className="settings-card">
          <h3>Theme</h3>
          <select value={theme} onChange={handleThemeChange}>
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
          </select>
        </div>

        {/* Real-time Collaboration */}
        <div className="settings-card">
          <h3>Live Collaboration</h3>
          <div className="setting-option">
            <span>Enable Real-time Editing</span>
            <Switch
              checked={realTimeEditing}
              onChange={() => toggleSetting(setRealTimeEditing)}
            />
          </div>
        </div>

        {/* Version Control */}
        <div className="settings-card">
          <h3>Version Control</h3>
          <div className="setting-option">
            <span>Auto Commit on Save</span>
            <Switch
              checked={autoCommit}
              onChange={() => toggleSetting(setAutoCommit)}
            />
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="settings-card">
          <h3>Communication</h3>
          <div className="setting-option">
            <span>Enable Chat</span>
            <Switch checked={enableChat} onChange={() => toggleSetting(setEnableChat)} />
          </div>
          {/* <div className="setting-option">
            <span>Enable Video Calls</span>
            <Switch checked={enableVideo} onChange={() => toggleSetting(setEnableVideo)} />
          </div> */}
        </div>

        {/* Security Settings */}
        <div className="settings-card">
          <h3>Security</h3>
          <div className="setting-option">
            <span>Enable Two-Factor Authentication (2FA)</span>
            <Switch
              checked={twoFactorAuth}
              onChange={() => toggleSetting(setTwoFactorAuth)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
