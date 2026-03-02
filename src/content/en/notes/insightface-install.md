---
layout: page.njk
lang: en
slug: insightface-install
section: notes
navId: insightface-install
title: "How to Install InsightFace"
summary: "Installation guide for InsightFace"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

This page summarizes the additional installation steps required to run custom nodes that use **InsightFace**, such as [ReActor](/en/basic-workflows/reactor/).

---

## For Windows Portable Version

### 1. Check your ComfyUI Python Version

Run the following command in your terminal (or command prompt) from the ComfyUI directory:

```powershell
cd path\to\ComfyUI_windows_portable
python_embeded\python.exe -V
```

### 2. Download the InsightFace Package

Download the package corresponding to your Python version and place it directly under `ComfyUI_windows_portable`.

> **Direct Download Links:**

- **Python 3.10**
  - [insightface-0.7.3-cp310-cp310-win_amd64.whl](https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp310-cp310-win_amd64.whl)
- **Python 3.11**
  - [insightface-0.7.3-cp311-cp311-win_amd64.whl](https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp311-cp311-win_amd64.whl)
- **Python 3.12**
  - [insightface-0.7.3-cp312-cp312-win_amd64.whl](https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp312-cp312-win_amd64.whl)
- **Python 3.13**
  - [insightface-0.7.3-cp313-cp313-win_amd64.whl](https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp313-cp313-win_amd64.whl)

### 3. Update pip

```powershell
cd path\to\ComfyUI_windows_portable
python_embeded\python.exe -m pip install -U pip
```

### 4. Install InsightFace

Run the command corresponding to your Python version:

- **Python 3.10**
    ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp310-cp310-win_amd64.whl
    ```
- **Python 3.11**
    ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp311-cp311-win_amd64.whl
    ```
- **Python 3.12**
    ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp312-cp312-win_amd64.whl
    ```
- **Python 3.13**
    ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp313-cp313-win_amd64.whl
    ```

### 5. Restart ComfyUI

Close and restart ComfyUI to apply changes.
