---
layout: page.njk
lang: en
section: basic-workflows
slug: reactor
navId: reactor
title: "ReActor"
summary: "FaceSwap Technology"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
tags: ["id-transfer"]
---

## What is ReActor?

[Face swap] has existed as [deepfake] for years, but back then hundreds of pictures of the same person's face were required.

ReActor (or rather its core, InsightFace) allows you to replace the face in another image or video with just one face photo.

Currently, there are more flexible ID transfer methods based on diffusion models, but due to its lightness and conversely stability due to ReActor's lack of flexibility, it is still a widely used technology.


## Custom Node

- [Gourieff/ComfyUI-ReActor](https://github.com/Gourieff/ComfyUI-ReActor?tab=readme-ov-file#installation)

### Installation Method

This node is a bit tricky and cannot be used just by installing it from ComfyUI Manager.

- 1. Install from ComfyUI Manager
- 2. Click `install.bat` in the following location
  -  ```text
      📂ComfyUI/
        └── 📂custom_nodes/
            └── install.bat
    ```
- 3. Windows users will probably fail, so install InsightFace
  - 1. Check the version of [Python] used in [ComfyUI]
 $ cd path\to\ComfyUI_windows_portable
 $ python_embeded\python.exe -V
 Probably 3.11
2. Download the [InsightFace] package corresponding to each version (direct link)
　3.10
　 https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp310-cp310-win_amd64.whl
　3.11
　 https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp311-cp311-win_amd64.whl
　3.12
　 https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp312-cp312-win_amd64.whl
　3.13
　	https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp313-cp313-win_amd64.whl
　Place it in the following location
　　$ path\to\ComfyUI_windows_portable
3. Update pip
　$ python_embeded\python.exe -m pip install -U pip
4. Install InsightFace
　3.10
　 $ python_embeded\python.exe -m pip install insightface-0.7.3-cp310-cp310-win_amd64.whl
　3.11
　 $ python_embeded\python.exe -m pip install insightface-0.7.3-cp311-cp311-win_amd64.whl
　3.12
　 $ python_embeded\python.exe -m pip install insightface-0.7.3-cp312-cp312-win_amd64.whl
　3.13
　 $ python_embeded\python.exe -m pip install insightface-0.7.3-cp313-cp313-win_amd64.whl
- 4. Restart

## FaceSwap (insightface)


## Use another FaceSwap model

insightface 
