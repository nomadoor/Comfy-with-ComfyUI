---
layout: page.njk
lang: zh
slug: insightface-install
section: notes
navId: insightface-install
title: "InsightFace 的安装方法"
created: 2025-12-09
updated: 2026-03-02
noteTags: ["troubleshoot", "install", "insightface", "reactor"]
summary: "InsightFace 的安装方法"
seoTitle: "为 ComfyUI 安装 InsightFace 的方法"
seoDescription: "ReActor 等使用 InsightFace 的自定义节点所需的额外安装步骤。在 Windows 便携版中确认 Python 版本并安装对应 wheel 的方法。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

本页整理了运行 [ReActor](/zh/basic-workflows/reactor/) 等使用 InsightFace 的自定义节点时，需要额外进行的安装步骤。

---

## Windows 便携版

### 1. 确认所用 ComfyUI 的版本

```powershell
cd path\to\ComfyUI_windows_portable
python_embeded\python.exe -V
```

### 2. 下载与版本对应的 InsightFace 包

请放在 `ComfyUI_windows_portable` 目录下。
> [!NOTE]
> **以下是直接下载链接。**

- Python 3.10  
  - [insightface-0.7.3-cp310-cp310-win_amd64.whl](https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp310-cp310-win_amd64.whl)
- Python 3.11  
  - [insightface-0.7.3-cp311-cp311-win_amd64.whl](https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp311-cp311-win_amd64.whl)
- Python 3.12  
  - [insightface-0.7.3-cp312-cp312-win_amd64.whl](https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp312-cp312-win_amd64.whl)
- Python 3.13  
  - [insightface-0.7.3-cp313-cp313-win_amd64.whl](https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp313-cp313-win_amd64.whl)

### 3. 更新 pip
```powershell
cd path\to\ComfyUI_windows_portable
python_embeded\python.exe -m pip install -U pip
```

### 4. 安装 InsightFace
- 使用 Python 3.10 时
  - ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp310-cp310-win_amd64.whl
    ```
- 使用 Python 3.11 时
  - ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp311-cp311-win_amd64.whl
    ```
- 使用 Python 3.12 时
  - ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp312-cp312-win_amd64.whl
    ```
- 使用 Python 3.13 时
  - ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp313-cp313-win_amd64.whl
    ```
### 5. 重启 ComfyUI
