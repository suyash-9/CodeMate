import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons

const CodeEditor = () => {
  const [language, setLanguage] = useState("Cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outputLoading, setOutputLoading] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true); // Theme state

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

  const handleRun = async () => {
    const payload = {
      code,
      input,
      lang: language,
    };
    setOutputLoading(true);
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
    } finally {
      setOutputLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() !== "") {
      setChatMessages([...chatMessages, { text: chatInput, sender: "User" }]);
      setLoading(true);

      try {
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: code + '\n' + chatInput }),
        });

        const data = await response.json();
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response || "AI response unavailable.", sender: "AI" },
        ]);
      } catch (error) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: "Error: Unable to get a response from AI.", sender: "AI" },
        ]);
      }

      setChatInput("");
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  // Styles based on theme
  const styles = {
    container: {
      backgroundColor: darkTheme ? "#0d1b2a" : "#ffffff",
      minHeight: "100vh",
    },
    header: {
      backgroundColor: darkTheme ? "#1b263b" : "#f8f9fa",
    },
    text: {
      color: darkTheme ? "#f8f8f2" : "#212529",
    },
    button: {
      backgroundColor: darkTheme ? "#8a40f5" : "#007bff",
      color: "#f8f8f2",
    },
    editor: {
      backgroundColor: darkTheme ? "#0d1b2a" : "#ffffff",
      borderColor: darkTheme ? "#44475a" : "#ced4da",
      color: darkTheme ? "#f8f8f2" : "#212529",
      textAlign: "left"
    },
    output: {
      backgroundColor: darkTheme ? "#0d1b2a" : "#e9ecef",
      color: darkTheme ? "#00FF00" : "#000000",
      borderColor: darkTheme ? "#44475a" : "#ced4da",
      height: 180
    },
    custom_input: {
      backgroundColor: darkTheme ? "#0d1b2a" : "#ffffff",
      color: darkTheme ? "#f8f8f2" : "#212529",
      borderColor: darkTheme ? "#44475a" : "#ced4da",
      height: 100
    },
    input: {
      backgroundColor: darkTheme ? "#0d1b2a" : "#ffffff",
      color: darkTheme ? "#f8f8f2" : "#212529",
      borderColor: darkTheme ? "#44475a" : "#ced4da",
    },
    icon: {
      user: {
        color: darkTheme ? "#d7f6fc" : "#e6edf5",
      },
      ai: {
        color: darkTheme ? "#ff79c6" : "#2c96f5",
      },
    },
  };

  const renderMessage = (message) => {
    const parts = message.split(/```/g); // Splits the message by the code block delimiters
    return parts.map((part, index) => {
      part = part + "\n";
      const isCode = index % 2 === 1; // Odd-indexed parts are code blocks
      return isCode ? (
        <pre
          key={index}
          style={{
            backgroundColor: darkTheme ? "#2d2d2d" : "#f1f1f1",
            color: darkTheme ? "#50fa7b" : "#333333",
            borderRadius: "8px",
            padding: "15px",
            margin: "20px 0", // Margin to separate from other parts
            fontFamily: "'Courier New', monospace",
            whiteSpace: "pre-wrap",
            fontSize: "14px",
            lineHeight: "1.5",
            overflowX: "auto", // Allows horizontal scrolling if needed,
            textAlign: "left"
          }}
        >
          {part}
        </pre>
      ) : (
        <p
          key={index}
          style={{
            color: darkTheme ? "#f8f8f2" : "#212529",
            fontSize: "16px",
            marginTop: "20px", // Margin ensures space above each paragraph
            lineHeight: "1.5",
          }}
        >
          {part}
        </p>
      );
    });
  };
  
  

  return (
    <div className="container-fluid p-0" style={styles.container}>
      <div className="row m-0">
        <div className="col-12 text-center py-3" style={styles.header}>
          <h1 style={{ fontFamily: "monospace", color: styles.text.color }}>
            <i className="bi bi-code-square"></i> CodeMate
          </h1>
        </div>

        <div className="col-lg-12 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn text-light border-0"
                onClick={toggleTheme}
              >
                <i
                  className={`bi ${darkTheme ? "bi-sun-fill" : "bi-moon-fill"}`}
                  style={{ color: darkTheme ? "#f8f8f2" : "#212529" }}
                ></i>
              </button>
              <select
                className="form-select w-auto ms-3"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={styles.editor}
              >
                <option value="Cpp">C++ (GCC 9.2.0)</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="Javascript">Javascript</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleRun}
              className="btn"
              style={styles.button}
              disabled={outputLoading}
            >
              {outputLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Executing...
                </>
              ) : (
                <>
                  <i className="bi bi-play-fill"></i> Run
                </>
              )}
            </button>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <CodeMirror
                value={code}
                height="400px"
                theme={darkTheme ? dracula : undefined} // Default theme if not dark
                extensions={[getLanguageSupport(language)]}
                onChange={(value) => setCode(value)}
                style={styles.editor}
              />
            </div>

            <div className="col-lg-4">
              <div style={{ padding: "20px", borderRadius: "8px", height: "400px", backgroundColor: styles.output.backgroundColor }}>
                <h6 style={styles.text}>Output</h6>
                <textarea
                  className="form-control"
                  rows="5"
                  value={output}
                  readOnly
                  style={styles.output}
                ></textarea>
                <div className="mt-2">
                  <label style={styles.text}>Custom Input</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={styles.custom_input}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="row mt-4">
            <div className="col-lg-12">
              <div
                style={{
                  backgroundColor: darkTheme ? "#1b263b" : "#e9ecef",
                  padding: "20px",
                  borderRadius: "8px",
                  height: "340px",
                }}
              >
                <h5 style={styles.text}>Chat With AI Assistant</h5>
                <div
                  className="p-2 rounded mb-3"
                  style={{ height: "200px", overflowY: "auto", backgroundColor: darkTheme ? "#0d1b2a" : "#f1f1f1" }}
                >
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`text-light mb-1 d-flex ${
                        msg.sender === "User"
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{
                          backgroundColor: msg.sender === "User" ? (darkTheme ? "#8a40f5" : "#007bff") : "#6c757d",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          maxWidth: "70%",
                        }}
                      >
                        <i
                          className={`bi ${
                            msg.sender === "User" ? "bi-person-circle" : "bi-robot"
                          } me-2`}
                          style={msg.sender === "User" ? styles.icon.user : styles.icon.ai}
                        ></i>
                        {renderMessage(msg.text)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ask something..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="btn"
                    style={styles.button}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill"></i> Send
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
