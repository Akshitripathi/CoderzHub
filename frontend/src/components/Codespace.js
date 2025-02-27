import { useState, useEffect } from "react";
import { useParams,useLocation } from "react-router-dom";
import { Play, Square, Split, MessageCircle, Video } from "lucide-react";
import { Button } from "../ui/button";
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

  useEffect(() => {
    setFiles(languageFiles[language] || []);
    setSelectedFile(languageFiles[language]?.[0] || "");
  }, [language]);

  const runCode = () => {
    setOutput(`Output for: ${input}`);
  };

  return (
    <div className="codespace-container">
      <div className="toolbar">
        <Button className="toolbar-btn" onClick={runCode}>
          <Play size={18} /> Run
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
          <textarea
            className="editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
