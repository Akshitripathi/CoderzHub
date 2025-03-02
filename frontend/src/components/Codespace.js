import { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { xml } from "@codemirror/lang-xml";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import { FaFolderPlus, FaFileAlt, FaSave, FaPlay, FaMoon, FaSun, FaTrash } from 'react-icons/fa';
import '../styles/Codespace.css';

export default function CodeEditor({ language = "JavaScript" }) {
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);
  const [theme, setTheme] = useState("dark");
  const [output, setOutput] = useState("");
  const [files, setFiles] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [folders, setFolders] = useState({});
  const [activePath, setActivePath] = useState("/");

  const languageExtensions = {
    JavaScript: javascript(),
    Python: python(),
    C: cpp(),
    Java: cpp(),
    XML: xml(),
  };

  useEffect(() => {
    if (!editorRef.current) return;

    if (editorViewRef.current) {
      editorViewRef.current.destroy();
    }

    const startState = EditorState.create({
      doc: currentFile ? files[currentFile].content : "// Start coding...",
      extensions: [
        keymap.of([...defaultKeymap, indentWithTab]),
        autocompletion(),
        lintGutter(),
        languageExtensions[language] || javascript(),
        theme === "dark" ? oneDark : [],
      ],
    });

    editorViewRef.current = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => {
      editorViewRef.current?.destroy();
    };
  }, [language, theme, currentFile]);

  const compileCode = async () => {
    const code = editorViewRef.current.state.doc.toString();
    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const result = await response.json();
      setOutput(result.output);
    } catch {
      setOutput("Error compiling code");
    }
  };

  const addFile = (fileName) => {
    if (!fileName) return;
    const filePath = `${activePath}${fileName}`;
    setFiles({ ...files, [filePath]: { content: "" } });
    setCurrentFile(filePath);
  };

  const saveFile = () => {
    if (currentFile) {
      setFiles({ ...files, [currentFile]: { content: editorViewRef.current.state.doc.toString() } });
    }
  };

  return (
    <div className="codespace-container">
      <div className="navbar">
        <h1>CoderzHub Editor</h1>
        <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>
      <div className="codespace-layout">
        <div className="file-explorer">
          <h3>Explorer</h3>
          <button onClick={() => addFile(prompt("Enter file name"))}><FaFileAlt /> New File</button>
          <div className="file-list">
            {Object.keys(files).map(file => (
              <div key={file} className={`file-item ${currentFile === file ? 'active' : ''}`} onClick={() => setCurrentFile(file)}>
                {file} <FaTrash onClick={() => setFiles(prev => { const newFiles = { ...prev }; delete newFiles[file]; return newFiles; })} />
              </div>
            ))}
          </div>
        </div>
        <div className="code-editor">
          <button className="toolbar-btn" onClick={saveFile}><FaSave /> Save</button>
          <button className="toolbar-btn" onClick={compileCode}><FaPlay /> Run</button>
          <div ref={editorRef} className={`editor-wrapper ${theme}-theme`}></div>
        </div>
        <div className="output-panel">
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}
