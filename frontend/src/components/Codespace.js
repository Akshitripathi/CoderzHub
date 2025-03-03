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
import { FaFolderPlus, FaFileAlt, FaSave, FaPlay, FaMoon, FaSun, FaTrash, FaEdit } from 'react-icons/fa';
import '../styles/Codespace.css';
import { getAllProjectFiles, saveFileContent, compileCode, deleteFile, renameFile, getFileContent, fetchProfile } from "../api";
import { useAuth } from "../context/AuthContext"; 
import ChatIcon from "./ChatIcon.js";

function CodeEditor({ language = "JavaScript" }) {
  const { projectId } = useParams();
  const { user } = useAuth(); 
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);
  const [theme, setTheme] = useState("dark");
  const [output, setOutput] = useState("");
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileUsername, setProfileUsername] = useState(null);

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
        const projectFiles = await getAllProjectFiles(projectId);
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
      try {
        const response = await saveFileContent(projectId, currentFile, content);
        if (response.success) {
          console.log('File saved successfully');
        } else {
          console.error('Failed to save file:', response.message);
        }
      } catch (error) {
        console.error('Error saving file:', error);
      }
    }
  };

  const handleDeleteFile = async (file) => {
    await deleteFile(projectId, file);
    const newFiles = files.filter(f => f.filepath !== file);
    setFiles(newFiles);
    setCurrentFile(newFiles.length > 0 ? newFiles[0].filepath : null);
  };

  const handleRenameFile = async (oldFile, newFile) => {
    const oldFilename = oldFile.split('/').pop(); 
    const newFilename = newFile.split('/').pop(); 
    const newFilePath = oldFile.replace(oldFilename, newFilename); // Construct the new file path
    console.log("Old Filename:", oldFilename); // Debugging statement
    console.log("New Filename:", newFilename); // Debugging statement
    console.log("New File Path:", newFilePath); // Debugging statement
    
    await renameFile(projectId, oldFilename, newFilename);
    const newFiles = files.map(file => file.filepath === oldFile ? { ...file, filename: newFilename, filepath: newFilePath } : file);
    setFiles(newFiles);
    setCurrentFile(newFilePath);
  };

  const handleFileClick = async (filePath) => {
    try {
      console.log("Clicked file:", filePath); // Debugging statement
      const fileContent = await getFileContent(projectId, filePath);
      console.log("Fetched file content:", fileContent); // Debugging statement
      const updatedFiles = files.map(file => 
          file.filepath === filePath ? { ...file, content: fileContent.content } : file
      );
      setFiles(updatedFiles);
      setCurrentFile(filePath);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  useEffect(() => {
    if (currentFile && editorViewRef.current) {
      const file = files.find(file => file.filepath === currentFile);
      if (file) {
        const state = EditorState.create({
          doc: file.content || "// Start coding...",
          extensions: [
            keymap.of([...defaultKeymap, indentWithTab]),
            autocompletion(),
            lintGutter(),
            languageExtensions[language] || javascript(),
            theme === "dark" ? oneDark : [],
          ],
        });
        editorViewRef.current.setState(state);
      }
    }
  }, [currentFile, files, language, theme]);

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
              <div key={file.filepath} className={`file-item ${currentFile === file.filepath ? 'active' : ''}`} onClick={() => handleFileClick(file.filepath)}>
                {file.filename} 
                <FaEdit onClick={(e) => { e.stopPropagation(); handleRenameFile(file.filepath, prompt("Enter new file name", file.filename)) }} />
                <FaTrash onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.filepath) }} />
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
      <ChatIcon  projectId={projectId} username={profileUsername || user?.username}/>
    </div>
  );
}

export default CodeEditor;
