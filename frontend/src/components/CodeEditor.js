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
  const [loading, setLoading] = useState(false); // <-- Added loading state

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

  const handleSendMessage = async () => {
    if (chatInput.trim() !== "") {
      // Add user message to chat
      setChatMessages([...chatMessages, { text: chatInput, sender: "User" }]);

      // Set loading state to true
      setLoading(true);

      try {
        // Make a POST request to the server
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: chatInput }),
        });

        const data = await response.json();

        // Add AI response to chat
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

      // Clear the chat input field
      setChatInput("");
      // Set loading state to false after response
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid p-0"
      style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}
    >
      <div className="row m-0">
        {/* Logo at the Top */}
        <div
          className="col-12 text-center py-3"
          style={{ backgroundColor: "#1b263b" }}
        >
          <h1 className="text-light" style={{ fontFamily: "monospace" }}>
            CodeMate
          </h1>
        </div>

        <div className="col-lg-12 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <button type="button" className="btn text-light border-0">
                <i className="bi bi-sun-fill"></i>
              </button>
              <select
                className="form-select w-auto ms-3"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#f8f8f2",
                  borderColor: "#44475a",
                }}
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
              style={{
                backgroundColor: "#bd93f9",
                color: "#f8f8f2",
              }}
            >
              <i className="bi bi-play-fill"></i> Run
            </button>
          </div>

          {/* Code Editor and Chat Section */}
          <div className="row">
            <div className="col-lg-8">
              <CodeMirror
                value={code}
                height="400px"
                theme={dracula}
                extensions={[getLanguageSupport(language)]}
                onChange={(value) => setCode(value)}
                style={{
                  backgroundColor: "#0d1b2a",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              />
            </div>

            {/* Output Section */}
            <div className="col-lg-4">
              <div
                style={{
                  backgroundColor: "#1b263b",
                  padding: "20px",
                  borderRadius: "8px",
                  height: "400px",
                }}
              >
                <h6 className="text-light">Output</h6>
                <textarea
                  className="form-control"
                  rows="5"
                  value={output}
                  readOnly
                  style={{
                    resize: "none",
                    backgroundColor: "#0d1b2a",
                    color: "#00FF00",
                    borderColor: "#44475a",
                    height: "50%",
                    borderRadius: "8px",
                  }}
                ></textarea>
                <div className="mt-2">
                  <label className="text-light">Custom Input</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                      resize: "none",
                      backgroundColor: "#0d1b2a",
                      color: "#f8f8f2",
                      borderColor: "#44475a",
                      borderRadius: "8px",
                    }}
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
                  backgroundColor: "#1b263b",
                  padding: "20px",
                  borderRadius: "8px",
                  height: "340px",
                }}
              >
                <h5 className="text-light">Chat With AI Assistant</h5>
                <div
                  className="bg-secondary p-2 rounded mb-3"
                  style={{ height: "200px", overflowY: "auto" }}
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
                        style={{
                          backgroundColor:
                            msg.sender === "User" ? "#2d2d2d" : "#44475a",
                          padding: "10px",
                          borderRadius: "10px",
                          maxWidth: "70%",
                          textAlign: "left",
                        }}
                      >
                        {msg.sender === "User" ? (
                          <>
                            <i className="bi bi-person-circle me-2"></i>{" "}
                            {/* User Icon */}
                            <strong>{msg.sender}:</strong> {msg.text}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-robot me-2"></i> {/* AI Icon */}
                            <strong>{msg.sender}:</strong> {msg.text}
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Display loader when fetching AI response */}
                  {loading && (
                    <div className="text-light mb-1 d-flex justify-content-start">
                      <div
                        style={{
                          backgroundColor: "#44475a",
                          padding: "10px",
                          borderRadius: "10px",
                          maxWidth: "70%",
                          textAlign: "left",
                        }}
                      >
                        <i className="bi bi-robot me-2"></i> {/* AI Icon */}
                        <strong>AI:</strong>{" "}
                        <span className="spinner-border spinner-border-sm"></span>{" "}
                        Fetching response...
                      </div>
                    </div>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={{
                      backgroundColor: "#2d2d2d",
                      color: "#f8f8f2",
                      borderColor: "#44475a",
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSendMessage}
                  >
                    Send
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
