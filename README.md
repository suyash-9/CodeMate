
# </> CodeMate

CodeMate is an online code editor designed to support multiple programming languages and provide AI assistance to help with code completion, syntax highlighting, and more. The platform allows users to write, execute, and test code in real-time, with the added ability to receive AI-powered code suggestions. 

## 🚀 Features

- **📝 Multiple Language Support**: CodeMate currently supports:
  - C++ (GCC 9.2.0)
  - Java (OpenJDK 11.0.8)
  - Python (Python 3.8.5)
  - JavaScript (Node.js 14.15.0)
  
- **🌈 Syntax Highlighting & Code Completion**: Powered by CodeMirror for an enhanced coding experience, including:
  - Automatic code completion ✨
  - Syntax highlighting for all supported languages 💡
  
- **⚙️ Custom Input & Output**: Users can provide custom input for their programs and view the corresponding output.

- **🤖 AI Assistant**: 
  - Integrated AI assistant that provides real-time help with code writing, debugging, and general coding advice.
  - Powered by **Ollama AI Models** to assist with code suggestions and solutions.

- **🏃‍♂️ Code Execution**:
  - Backed by **Judge0** for compiling and executing code in multiple languages.
  
## 🛠️ Tech Stack

### Frontend:
- **⚛️ React**: Handles the user interface and overall client-side logic.
- **📝 CodeMirror**: Used as the code editor, providing support for syntax highlighting, error checking, and code completion.

### Backend:
- **📡 Express.js**: The backend server that processes requests from the frontend.
- **⚙️ Judge0 API**: Used for running and executing code in various languages.
- **🤖 Ollama AI**: Provides intelligent code suggestions via the integrated AI assistant.

## 🔍 How It Works

1. **Code Input**: Users can type code in the editor with support for multiple languages. Syntax highlighting and auto-completion features enhance the experience.
   
2. **Custom Input**: Users can supply their own input for the program if required.

3. **Code Execution**: Once the "Run" button is clicked, the backend sends the code to the Judge0 API, which compiles and executes it. The output is then displayed in the designated output section.

4. **AI Assistance**: Users can interact with the AI Assistant for code-related help, including fixing errors, optimizing code, or general programming advice.

## ⚡ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/suyash-9/CodeMate
   cd CodeMate
   ```

2. Start the backend server:
  - Install dependencies

    ```bash
    cd backend
    npm install
    ```
  - Start Server - Runs at http://localhost:8000
    ```bash
    npm start
    ```

3. Start the frontend:
  - Install dependencies

    ```bash
    cd frontend
    npm install
    ```
  - Start Server
    ```bash
    npm start
    ```

4. The application will be accessible at:
   ```
   http://localhost:3000
   ```

5. Run the judge0 and ollama docker container:
  - Start the docker container
    ```bash
    cd judge0
    docker-compose up
    ```

## 🧑‍💻 Usage

1. Select a programming language from the dropdown (C++, Java, Python, JavaScript).
2. Write your code in the editor.
3. Optionally, provide custom input for your code in the "Custom Input" section.
4. Click "Run" to execute the code.
5. View the output in the "Output" section.
6. Use the AI Assistant to get help by chatting with it in the AI Assistant panel.

## 🌱 Future Improvements

- Support for more programming languages.
- Enhanced debugging capabilities.
- More powerful AI assistance with contextual code help.