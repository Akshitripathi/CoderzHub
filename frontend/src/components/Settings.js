import React, { useState, useEffect } from "react";
import { Switch, Tooltip } from "@mui/material";
import { FaCode, FaPalette, FaCog, FaLock, FaUsers, FaKeyboard } from "react-icons/fa";
import "../styles/Settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: "dark",
    fontSize: "14",
    tabSize: "2",
    autoSave: true,
    liveCollaboration: true,
    autoComplete: true,
    lineNumbers: true,
    bracketMatching: true,
    syntaxHighlighting: true,
    chatNotifications: true,
    keyboardShortcuts: true,
    twoFactorAuth: false
  });

  const [saveStatus, setSaveStatus] = useState("");

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    showSaveStatus();
  };

  const showSaveStatus = () => {
    setSaveStatus("Settings saved successfully!");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  return (
    <div className="settings-container">
      <h2>CoderzHub Settings</h2>
      {saveStatus && <div className="save-status">{saveStatus}</div>}

      <div className="settings-grid">
        {/* Editor Appearance */}
        <div className="settings-card">
          <div className="card-header">
            <FaPalette />
            <h3>Editor Appearance</h3>
          </div>
          <div className="setting-option">
            <label style={{color:"white", marginRight:"1rem"}}>Theme</label>
            <select 
              value={settings.theme} 
              onChange={(e) => updateSetting("theme", e.target.value)}
            >
              <option value="dark">Dark Theme</option>
              <option value="light">Light Theme</option>
              <option value="dracula">Dracula</option>
              <option value="monokai">Monokai</option>
            </select>
          </div>
          <div className="setting-option">
            <label style={{color:"white"}}>Font Size</label>
            <select 
              value={settings.fontSize}
              onChange={(e) => updateSetting("fontSize", e.target.value)}
            >
              {[12, 14, 16, 18, 20].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
        </div>

        {/* Editor Behavior */}
        <div className="settings-card">
          <div className="card-header">
            <FaCode />
            <h3>Editor Behavior</h3>
          </div>
          <div className="setting-option">
            <Tooltip title="Automatically save your work">
              <span>Auto Save</span>
            </Tooltip>
            <Switch 
              checked={settings.autoSave}
              onChange={(e) => updateSetting("autoSave", e.target.checked)}
            />
          </div>
          <div className="setting-option">
            <Tooltip title="Show line numbers in editor">
              <span>Line Numbers</span>
            </Tooltip>
            <Switch 
              checked={settings.lineNumbers}
              onChange={(e) => updateSetting("lineNumbers", e.target.checked)}
            />
          </div>
        </div>

        {/* Collaboration Features */}
        <div className="settings-card">
          <div className="card-header">
            <FaUsers />
            <h3>Collaboration</h3>
          </div>
          <div className="setting-option">
            <Tooltip title="Enable real-time collaboration">
              <span>Live Collaboration</span>
            </Tooltip>
            <Switch 
              checked={settings.liveCollaboration}
              onChange={(e) => updateSetting("liveCollaboration", e.target.checked)}
            />
          </div>
          <div className="setting-option">
            <Tooltip title="Enable chat notifications">
              <span>Chat Notifications</span>
            </Tooltip>
            <Switch 
              checked={settings.chatNotifications}
              onChange={(e) => updateSetting("chatNotifications", e.target.checked)}
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-card">
          <div className="card-header">
            <FaLock />
            <h3>Security</h3>
          </div>
          <div className="setting-option">
            <Tooltip title="Enable two-factor authentication">
              <span>Two-Factor Authentication</span>
            </Tooltip>
            <Switch 
              checked={settings.twoFactorAuth}
              onChange={(e) => updateSetting("twoFactorAuth", e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
