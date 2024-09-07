import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const CodeEditor = () => {
  const [language, setLanguage] = useState("Cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");

  // Function to get the appropriate language support based on the selected language
  const getLanguageSupport = (lang) => {
    switch (lang) {
      case "Java":
        return java();
      case "Python":
        return python();
      case "Javascript":
        return javascript({ jsx: true });
      default:
        return cpp();
    }
  };

  // Function to handle the run button click
  const handleRun = async () => {
    const payload = {
      code,
      input,
      lang: language,
    };
    try {
      const response = await fetch("http://localhost:8000/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      setOutput(result.output);
    } catch (error) {
      setOutput("Error: Unable to compile code.");
    }
  };

  return (
    <div className="row m-3">
      <div className="col">
        <div className="d-flex justify-content-between mb-2 bg-dark rounded p-2">
          <div className="col-12 w-25">
            <select
              className="form-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="Cpp">Cpp</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="Python">Javascript</option>
            </select>
          </div>
          <div>
            <button type="button" className="btn btn-success">
              Online IDE
            </button>
            <button
              type="button"
              onClick={handleRun}
              className="btn btn-success"
            >
              <i className="bi bi-play-fill"></i>
            </button>
          </div>
        </div>
        <CodeMirror
          value={code}
          height="500px"
          theme={dracula}
          extensions={[getLanguageSupport(language)]}
          onChange={(value) => setCode(value)}
        />
      </div>
      <div className="col d-flex flex-column rounded bg-dark px-4">
        <div className="h-50">
          <label htmlFor="input" className="text-light mt-4 mb-2">
            Input
          </label>
          <textarea
            id="input"
            className="form-control h-75"
            style={{
              textAlign: "left", // Ensures text aligns left
              padding: "0.5rem", // Adds padding around the text
              margin: "0", // Removes any default margin
              boxSizing: "border-box", // Ensures padding does not affect width
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>
        <div className="h-50">
          <label htmlFor="output" className="text-light mb-2">
            Output
          </label>
          <textarea
            id="output"
            className="form-control h-75"
            style={{
              textAlign: "left", // Ensures text aligns left
              padding: "0.5rem", // Adds padding around the text
              margin: "0", // Removes any default margin
              boxSizing: "border-box", // Ensures padding does not affect width
            }}
            value={output}
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
