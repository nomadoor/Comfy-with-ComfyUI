---
layout: page.njk
lang: ja
slug: insightface-install
section: notes
navId: insightface-install
title: "InsightFaceのインストール方法"
summary: "InsightFaceのインストール方法"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---


## Windowsポータブル版

### 1. 使っているComfyUIのバージョン確認

```powershell
cd path\to\ComfyUI_windows_portable
python_embeded\python.exe -V
```

### 2. バージョンに対応するInsightFaceのパッケージをダウンロード

`ComfyUI_windows_portable` の直下に置きます。

- Python 3.10  
  [insightface-0.7.3-cp310-cp310-win_amd64.whl](https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp310-cp310-win_amd64.whl)
- Python 3.11  
  `https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp311-cp311-win_amd64.whl`
- Python 3.12  
  `https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp312-cp312-win_amd64.whl`
- Python 3.13  
  `https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp313-cp313-win_amd64.whl`


- 4. pip をアップデートする
  - ```text
    cd path\to\ComfyUI_windows_portable
    python_embeded\python.exe -m pip install -U pip
    ```
- 5. InsightFace をインストールする
  - Python 3.10 の場合
    - ```text
      python_embeded\python.exe -m pip install insightface-0.7.3-cp310-cp310-win_amd64.whl
      ```
  - Python 3.11 の場合
    - ```text
      python_embeded\python.exe -m pip install insightface-0.7.3-cp311-cp311-win_amd64.whl
      ```
  - Python 3.12 の場合
    - ```text
      python_embeded\python.exe -m pip install insightface-0.7.3-cp312-cp312-win_amd64.whl
      ```
  - Python 3.13 の場合
    - ```text
      python_embeded\python.exe -m pip install insightface-0.7.3-cp313-cp313-win_amd64.whl
      ```
- 6. ComfyUI を再起動する
