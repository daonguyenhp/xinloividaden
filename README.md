# ICEAM: AI-Driven Assistant for E-Commerce Optimization

**Project:** Specialized Project Report (Báo cáo chuyên môn)
**Team:** Xin loi vi da den
**Institution:** Faculty of Computer Science and Engineering - HCMUT
**Date:** May 2025

---

## 1. Project Overview

<div align="center">
<img width="736" height="418" alt="Screenshot 2026-01-13 000617" src="https://github.com/user-attachments/assets/7e2712e4-c313-47af-8da8-76ec046d7277" />
</div>

**ICEAM** (Intelligent Chatbot & E-commerce Assistant Model) is a software solution designed to automate customer support and centralize data management for Small and Medium-sized Enterprises (SMEs). The system leverages Generative AI (LLMs) via the OpenRouter/DeepSeek API to provide natural language processing capabilities, integrated with a local Knowledge Base managed through Excel.


The primary objectives of the system are:
* **Natural Language Understanding (NLU):** Interpret user intent beyond keyword matching.
* **Contextual Retention:** Maintain long-term memory of user identity and purchase history.
* **Data Synchronization:** Real-time retrieval of product inventory and pricing from static files.
* **Analytics:** Automated logging of conversation history for behavioral analysis.

---

## 2. System Architecture

The project follows a **Client-Server architecture** utilizing RESTful communication.

### 2.1. High-Level Design
* **Frontend (Client):** Handles user interface and input capture. Uses Fetch API to communicate with the backend.
* **Backend (Server):** Node.js runtime environment. Manages API requests, business logic, and file I/O operations.
* **Data Layer:** Local file system utilizing Microsoft Excel (`.xlsx`) as a lightweight database for product data and logs.
* **AI Engine:** External integration with OpenRouter API (DeepSeek/GPT-3.5) for response generation.

### 2.2. Data Flow
1.  **Input Processing:** User input is transmitted from Client to Server.
2.  **Information Retrieval:** Server queries `products.xlsx` for relevant stock/pricing data.
3.  **Prompt Engineering:** Retrieved data is combined with user input and conversation history (`chat_log.xlsx`).
4.  **Generation:** The composite prompt is sent to the LLM API.
5.  **Response:** The generated response is returned to the Client and logged.

> **[Figure 1]:** System Architecture Diagram.

<div align="center">
<img width="722" height="480" alt="Screenshot 2026-01-12 235237" src="https://github.com/user-attachments/assets/a09116e9-1811-486a-86e5-f07ff16d6ea8" />
</div>

---

## 3. Repository Structure

The source code is organized as follows:

```text
iceam-web/
├── backend/                  # Server-side logic
│   ├── index.js              # Entry point, API routes configuration
│   ├── products.xlsx         # Product Knowledge Base (Read-only)
│   ├── chat_log.xlsx         # Conversation logs (Append-only)
│   ├── package.json          # Dependency definitions
│   └── .env                  # Environment variables
│
├── frontend/                 # Client-side presentation
│   ├── css/                  # Stylesheets
│   ├── js/                   # Client logic (main.js, chat.js)
│   ├── index.html            # Main application interface
│   └── navigation.html       # Component fragments
│
└── README.md                 # Technical documentation
```

---

## 4. Implementation & Setup

### 4.1. Prerequisites
Ensure the following are installed in the development environment:
* **Node.js** (v14 or higher).
* **npm** (Node Package Manager).
* **Live Server** extension for VS Code **or** the global `live-server` package.

### 4.2. API Configuration (DeepSeek via OpenRouter)
The system requires an API Key to communicate with the DeepSeek LLM. We utilize **OpenRouter** as the gateway to access open-source models.

1.  **Generate API Key:**
    * Visit [OpenRouter.ai](https://openrouter.ai/).
    * Sign up or Log in to your account.
    * Navigate to **Keys** settings and select **"Create Key"**.
    * Name your key (e.g., `ICEAM-Project`) and copy the generated string starting with `sk-or-...`.

2.  **Environment Setup:**
    * Navigate to the `backend/` directory.
    * Duplicate the example config file:
        ```bash
        cp .env.example .env
        ```
        *(Or manually create a file named `.env`)*.
    * Open `.env` and paste your API key:
        ```ini
        PORT=3000
        KB_FILE=products.xlsx
        LOG_FILE=chat_log.xlsx
        OPENROUTER_API_KEY=sk-or-your-generated-key-here
        ```

### 4.3. Running the Backend (Express.js API)
The backend must be running first to handle API requests.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node index.js
    ```
    *Successful Output:* `Server started at port: 3000`

### 4.4. Running the Frontend (Live Server)
Choose **one** of the following options to serve the client-side application.

**Option A: VS Code Live Server (Recommended)**
1.  Open the `frontend/` folder in Visual Studio Code.
2.  Install the **Live Server** extension (if not already installed).
3.  Right-click on `index.html` file in the file explorer.
4.  Select **"Open with Live Server"**.
5.  The browser will automatically open at `http://127.0.0.1:5500`.

**Option B: CLI (Command Line Interface)**
1.  Install the package globally (one-time setup):
    ```bash
    npm install -g live-server
    ```
2.  Run from the project root:
    ```bash
    cd frontend
    live-server --port=5500
    ```
