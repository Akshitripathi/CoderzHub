import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Play, Square, Split, MessageCircle, Video, Sun, Moon, Plus, Trash2, Save } from "lucide-react";
import { Button } from "../ui/button";
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/xml/xml';

import "../styles/Codespace.css";

export default function Codespace() {
  const { projectId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const language = queryParams.get("lang") || "JavaScript"; // Default to JS if no language is provided

  // Define language-specific files
  const languageFiles = {
    JavaScript: ["index.js", "App.js", "styles.css"],
    Python: ["main.py", "utils.py", "requirements.txt"],
    C: ["main.c", "utils.h", "Makefile"],
    Java: ["Main.java", "Utils.java", "pom.xml"],
  };

  const [files, setFiles] = useState(languageFiles[language] || []);
  const [selectedFile, setSelectedFile] = useState(files[0]);
  const [code, setCode] = useState("// Write your code here...");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setFiles(languageFiles[language] || []);
    setSelectedFile(languageFiles[language]?.[0] || "");
  }, [language]);

  const runCode = () => {
    setOutput(`Output for: ${input}`);
  };

  const clearOutput = () => {
    setOutput("");
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const addFile = () => {
    const newFileName = prompt("Enter new file name:");
    if (newFileName) {
      setFiles([...files, newFileName]);
    }
  };

  const saveFile = () => {
    console.log(`Saving file: ${selectedFile}`);
    // Implement file saving logic here
  };

  return (
    <div className={`codespace-container ${theme}`}>
      <div className="toolbar">
        <Button className="toolbar-btn" onClick={runCode}>
          <Play size={18} /> Run
        </Button>
        <Button className="toolbar-btn" onClick={clearOutput}>
          <Trash2 size={18} /> Clear Output
        </Button>
        <Button className="toolbar-btn">
          <Square size={18} /> Terminate
        </Button>
        <Button className="toolbar-btn">
          <Split size={18} /> Split Screen
        </Button>
        <Button className="toolbar-btn">
          <MessageCircle size={18} /> Chat
        </Button>
        <Button className="toolbar-btn">
          <Video size={18} /> Video Call
        </Button>
        <Button className="toolbar-btn" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />} Theme
        </Button>
        <Button className="toolbar-btn" onClick={addFile}>
          <Plus size={18} /> Add File
        </Button>
        <Button className="toolbar-btn" onClick={saveFile}>
          <Save size={18} /> Save
        </Button>
      </div>

      <div className="codespace-layout">
        <div className="file-explorer">
          <h3>Explorer ({language})</h3>
          <ul>
            {files.map((file, index) => (
              <li
                key={index}
                className={selectedFile === file ? "selected" : ""}
                onClick={() => setSelectedFile(file)}
              >
                {file}
              </li>
            ))}
          </ul>
        </div>

        <div className="code-editor">
          <h3>{selectedFile}</h3>
          <CodeMirror
            value={code}
            options={{
              mode: language.toLowerCase(),
              theme: "material",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setCode(value);
            }}
          />
        </div>

        <div className="input-output">
          <h3>Input</h3>
          <input
            type="text"
            className="input-box"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <h3>Output</h3>
          <div className="output-box">{output}</div>
        </div>
      </div>
    </div>
  );
}
