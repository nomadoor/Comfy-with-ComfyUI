---
layout: page.njk
lang: en
section: data-utilities
slug: webcam-input
navId: webcam-input
title: "Webcam"
created: 2025-11-25
updated: 2026-03-02
summary: "Bringing webcam or OBS video into ComfyUI"
seoTitle: "Use a Webcam or OBS as Input in ComfyUI"
seoDescription: "Capture a webcam in ComfyUI with Webcam Capture, bring in your screen through OBS Virtual Camera, and rerun automatically for near-realtime results."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/webcam-input/legacy_gyazo_5c2f4a37547aa854b5dcc8d264ff962b.png"
---
## Webcam Input

ComfyUI can grab video from a camera connected to your PC as an image.

### Webcam Capture Node

![](/media/begin-with/media/legacy_gyazo_2a7ab2f8dc9179e6c02d15e74dedcea3.png){media=image}

- 1. Add a `Webcam Capture` node
- 2. If your browser asks for permission to use the camera, allow it.
- 3. Press `▷ Run`, and the camera frame at that moment is output as an image.

---

## Capturing Your PC Screen with OBS

With the **Virtual Camera** feature of **[OBS Studio](https://obsproject.com/download)**, the well-known streaming software, you can send your desktop or a specific window to ComfyUI as if it were a webcam.

This is really an OBS feature rather than a ComfyUI one, but it's handy, so I'm including it.

### 1. OBS Settings

Install OBS and set up the screen you want to capture.

- **Source Settings (Window Capture)**
  - Click `+` under Sources, choose `Window Capture`, and pick the app you want (e.g., Paint).
  - ![](/media/data-utilities/webcam-input/legacy_gyazo_3ae7154d9a7d58b54a5e331858a119ad.mp4){media=loop}
  - **Capture Method**: If the capture is black, switching to `Windows 10 (1903 or later)` may fix it (this often happens with drawing apps like Affinity).
  - **Cursor**: Uncheck "Capture Cursor" if you prefer.

- **Canvas Size**
  - Not required, but setting it under `Settings` → `Video` to match the resolution you generate at in ComfyUI makes the aspect ratio easier to manage.

### 2. Start Virtual Camera

Click **Start Virtual Camera** under `Controls` at the bottom right of OBS.
The OBS output will now show up as a webcam.


### 3. Loading in ComfyUI

Back in ComfyUI, change the `Webcam Capture` node's settings.

- 1. Select **`OBS Virtual Camera`** from the camera selection dropdown
    - *If it doesn't show up, reload ComfyUI (`F5`).
- 2. Run it, and the OBS screen is captured as an image.

### Real-time Execution (Auto Queue)

![](/media/data-utilities/webcam-input/legacy_gyazo_6b57f5d40d4c55b13d82bf6737a24e5a.mp4){media=loop}

A normal run is fine if you only need a single still, but if you want AI to transform your drawing in real time, use **`Run (Instant)`** from the `▷ Run` menu.
