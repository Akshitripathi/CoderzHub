import React, { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import axios from "axios";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";


import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/clike/clike.js"; 

const App = () => {
    const [code, setCode] = useState("// Write your code here...");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const runCode = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/run", { language, code });
            setOutput(res.data.output || res.data.error);
        } catch (error) {
            setOutput("Error executing code");
        } finally {
            setLoading(false);
        }
    };

    // Detect mode based on language
    const getMode = () => {
        switch (language) {
            case "javascript":
                return "javascript";
            case "python":
                return "python";
            case "c":
            case "cpp":
                return "text/x-csrc"; // Works for both C and C++
            default:
                return "javascript";
        }
    };

    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-4">💻 Online Code Compiler</h1>

            {/* Language Selector */}
            <div className="mb-3">
                <label className="mr-2 text-lg">Select Language:</label>
                <select
                    className="bg-gray-800 text-white p-2 rounded-lg border border-gray-600"
                    onChange={(e) => setLanguage(e.target.value)}
                    value={language}
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                </select>
            </div>

            {/* Code Editor */}
            <div className="w-full max-w-3xl border border-gray-700 rounded-lg overflow-hidden">
                <CodeMirror
                    value={code}
                    options={{
                        mode: getMode(),
                        theme: "dracula",
                        lineNumbers: true,
                    }}
                    onBeforeChange={(editor, data, value) => setCode(value)}
                    className="h-64"
                />
            </div>

            {/* Run Button */}
            <button
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white font-semibold disabled:opacity-50"
                onClick={runCode}
                disabled={loading}
            >
                {loading ? "Running..." : "Run Code"}
            </button>

            {/* Output Section */}
            <div className="w-full max-w-3xl mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-2">📌 Output:</h3>
                <pre className="bg-black p-3 rounded-md text-green-400 overflow-auto whitespace-pre-wrap">
                    {output || "No output yet"}
                </pre>
            </div>

          
        </div>
    );
};

export default App;
