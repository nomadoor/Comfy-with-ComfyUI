---
layout: page.njk
lang: zh
slug: insightface-install
section: notes
navId: insightface-install
title: "InsightFace 的安装方法"
summary: "InsightFace 的安装方法"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

这是总结为了让使用 [ReActor](/zh/basic-workflows/reactor/) 等 InsightFace 的自定义节点动的追加安装步骤的页面。

---

## Windows 便携版

### 1. 确认使用的 ComfyUI 的版本

```powershell
cd path\to\ComfyUI_windows_portable
python_embeded\python.exe -V
```

### 2. 下载对应版本的 InsightFace 的包

请放在 `ComfyUI_windows_portable` 的正下方。
> **是直链。**

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
- Python 3.10 的情况
  - ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp310-cp310-win_amd64.whl
    ```
- Python 3.11 的情况
  - ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp311-cp311-win_amd64.whl
    ```
- Python 3.12 的情况
  - ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp312-cp312-win_amd64.whl
    ```
- Python 3.13 的情况
  - ```powershell
    python_embeded\python.exe -m pip install insightface-0.7.3-cp313-cp313-win_amd64.whl
    ```
### 5. 重启 ComfyUI
