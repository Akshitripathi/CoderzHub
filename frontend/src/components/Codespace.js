import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
import { getProjectFiles, saveFileContent, compileCode } from "../api";

export default function CodeEditor({ language = "JavaScript" }) {
  const { projectId } = useParams();
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);
  const [theme, setTheme] = useState("dark");
  const [output, setOutput] = useState("");
  const [files, setFiles] = useState({});
  const [currentFile, setCurrentFile] = useState(null);

  const languageExtensions = {
    JavaScript: javascript(),
    Python: python(),
    C: cpp(),
    Java: cpp(),
    XML: xml(),
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log("Fetching files for project:", projectId);
        const projectFiles = await getProjectFiles(projectId);
        console.log("Fetched files:", projectFiles);
        setFiles(projectFiles);
        if (Object.keys(projectFiles).length > 0) {
          setCurrentFile(Object.keys(projectFiles)[0]);
        }
      } catch (error) {
        console.error("Error fetching project files:", error);
      }
    };

    fetchFiles();
  }, [projectId]);

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
  }, [language, theme, currentFile, files]);

  const handleCompileCode = async () => {
    await handleSaveFile();
    const code = editorViewRef.current.state.doc.toString();
    const result = await compileCode(language, code);
    setOutput(result.output);
  };

  const handleAddFile = (fileName) => {
    if (!fileName) return;
    const filePath = `${projectId}/${fileName}`;
    setFiles({ ...files, [filePath]: { content: "" } });
    setCurrentFile(filePath);
  };

  const handleSaveFile = async () => {
    if (currentFile) {
      const content = editorViewRef.current.state.doc.toString();
      setFiles({ ...files, [currentFile]: { content } });
      await saveFileContent(projectId, currentFile, content);
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
          <button onClick={() => handleAddFile(prompt("Enter file name"))}><FaFileAlt /> New File</button>
          <div className="file-list">
            {Object.keys(files).map(file => (
              <div key={file} className={`file-item ${currentFile === file ? 'active' : ''}`} onClick={() => setCurrentFile(file)}>
                {file} <FaTrash onClick={() => setFiles(prev => { const newFiles = { ...prev }; delete newFiles[file]; return newFiles; })} />
              </div>
            ))}
          </div>
        </div>
        <div className="code-editor">
          <div className="editor-toolbar">
            <button className="toolbar-btn" onClick={handleSaveFile}><FaSave /> Save</button>
            <button className="toolbar-btn" onClick={handleCompileCode}><FaPlay /> Run</button>
          </div>
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
