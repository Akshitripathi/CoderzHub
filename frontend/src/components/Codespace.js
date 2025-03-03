import { autocompletion } from "@codemirror/autocomplete";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { xml } from "@codemirror/lang-xml";
import { lintGutter } from "@codemirror/lint";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, keymap } from "@codemirror/view";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaFileAlt, FaMoon, FaPlay, FaSave, FaSun, FaTrash } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import { compileCode, deleteFile, fetchProfile, getProjectFiles, renameFile, saveFileContent } from "../api";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import '../styles/Codespace.css';
import ChatIcon from './ChatIcon'; // Import ChatIcon component

export default function CodeEditor({ language = "JavaScript" }) {
  const { projectId } = useParams();
  const { user } = useAuth(); // Get the user from the AuthContext
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);
  const [theme, setTheme] = useState("dark");
  const [output, setOutput] = useState("");
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileUsername, setProfileUsername] = useState(""); // Store username from profile

  const languageExtensions = {
    JavaScript: javascript(),
    Python: python(),
    C: cpp(),
    Java: cpp(),
    XML: xml(),
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetchProfile();
        if (response.success) {
          setProfileUsername(response.user.username); // Extract username from profile
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log("Fetching files for project:", projectId);
        const projectFiles = await getProjectFiles(projectId);
        console.log("Fetched files:", projectFiles);
        setFiles(Array.isArray(projectFiles) ? projectFiles : []);
        if (projectFiles.length > 0) {
          setCurrentFile(projectFiles[0].filepath);
        }
      } catch (error) {
        console.error("Error fetching project files:", error);
        setError(error.message || "Failed to load project files.");
      } finally {
        setLoading(false);
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
      doc: currentFile ? files.find(file => file.filepath === currentFile)?.content || "// Start coding..." : "// Start coding...",
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
    const filePath = `projects/${projectId}/${fileName}`;
    setFiles([...files, { filename: fileName, filepath: filePath, content: "" }]);
    setCurrentFile(filePath);
  };

  const handleSaveFile = async () => {
    if (currentFile) {
      const content = editorViewRef.current.state.doc.toString();
      setFiles(files.map(file => file.filepath === currentFile ? { ...file, content } : file));
      await saveFileContent(projectId, currentFile, content);
    }
  };

  const handleDeleteFile = async (file) => {
    await deleteFile(projectId, file);
    const newFiles = files.filter(f => f.filepath !== file);
    setFiles(newFiles);
    setCurrentFile(newFiles.length > 0 ? newFiles[0].filepath : null);
  };

  const handleRenameFile = async (oldFile, newFile) => {
    await renameFile(projectId, oldFile, newFile);
    const newFiles = files.map(file => file.filepath === oldFile ? { ...file, filename: newFile, filepath: newFile } : file);
    setFiles(newFiles);
    setCurrentFile(newFile);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

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
            {files.map(file => (
              <div key={file.filepath} className={`file-item ${currentFile === file.filepath ? 'active' : ''}`} onClick={() => setCurrentFile(file.filepath)}>
                {file.filename} 
                <FaEdit onClick={() => handleRenameFile(file.filepath, prompt("Enter new file name", file.filename))} />
                <FaTrash onClick={() => handleDeleteFile(file.filepath)} />
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
      <ChatIcon projectId={projectId} username={profileUsername || user?.username} /> {/* Use profile username */}
    </div>
  );
}
