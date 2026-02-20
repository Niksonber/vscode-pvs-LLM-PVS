# LLM-PVS

This guide covers the installation of the VS Code extension and the setup of the local LLM for PVS proof-command suggestions

## Virtual Machine

You can try LLM-PVS using the VirtualBox VM downloadable from 
[here](https://drive.google.com/drive/folders/1yvyq5Y9mGQVm653u98g0CBUZKIZZoD2l?usp=sharing)

## Prerequisites

* **Python 3.10+**
* **Git**

---

## Installation Steps

### 1. Install Visual Studio Code

Download and install **Visual Studio Code**:

* [Download VS Code](https://code.visualstudio.com/)

### 2. Install the Extension (.vsix)

The extension is provided as a compiled `.vsix` file located in the `releases` folder of this repository [.vsix](releases/vscode-pvs-1.0.70-eta-202509201656-llama.vsix).

1. Open Visual Studio Code.
2. Go to the **Extensions** view by clicking the square icon on the left sidebar (or press `Ctrl+Shift+X`).
3. Click the **three dots (...)** in the top-right corner of the Extensions pane.
4. Select **Install from VSIX...**.
5. Navigate to the `release` folder in the cloned repository and select the `.vsix` file.
6. Restart VS Code if prompted.

The **extension** will install **PVS** if it is not installed

### 3. Create a Python Environment

It is recommended to use a virtual environment to manage dependencies for the LLM server.

1. Open your terminal and navigate to the project directory.
2. Create the environment:
```bash
python -m venv venv

```


3. Activate the environment:

```bash
source venv/bin/activate

```

### 4. Install llama-cpp-server Dependencies

The backend relies on `llama-cpp-python` to serve the language model.

1. Ensure your virtual environment is active.
2. Install the package with server support:
```bash
pip install -r llama-cpp-server/requirements.txt

```

*Note: If you have an NVIDIA GPU, you may want to install with CUDA support for better performance. Check the [llama-cpp-python documentation](https://github.com/abetlen/llama-cpp-python) for specific hardware acceleration flags.*

### 5. Start the LLM Server

Before starting the server, you need a model file in **GGUF** format (e.g., Llama-3, Mistral, or CodeLlama).

1. Download a GGUF model and place it in a known directory.

* [GGUF model](https://drive.google.com/file/d/1K1HkS3M5J-kX0t6bnrBtJXEGQXbZlp5e/view?usp=drive_link)


2. Start the server using the following command:
```bash
uvicorn server:app --port 8085

```


3. By default, the server will run at `http://localhost:8000`.

---

## How to Use

2. **Open PVS Project:** Open your PVS files (`.pvs`) in VS Code. (prefered some sorting file from nasalib sorting)
3. **Interact:** Use the provided commands or sidebar interface (if applicable) to send snippets to the LLM for proof assistance or explanation.
4. **Configuration:** If the server is running on a different port or host, update the extension settings in VS Code (`File > Preferences > Settings > LLM-PVS`).

## Troubleshooting

* **Server Connection:** If the extension cannot communicate with the LLM, check if `http://localhost:8000/docs` is accessible in your browser.
* **Performance:** If the LLM is slow, ensure you are using a model size appropriate for your RAM/VRAM.
* **PVS Errors:** Ensure that the `pvs` executable is in your system PATH.
