---
layout: page.njk
lang: en
section: begin-with
slug: comfyui-manager
navId: comfyui-manager
title: "ComfyUI Manager"
created: 2026-05-27
updated: 2026-05-27
summary: "About ComfyUI Manager"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/76b47ed5d45cf694b436022589464255.png"
---

## What is ComfyUI Manager?

ComfyUI Manager is a tool developed by ltdrdata for managing custom node installation, updates, and related tasks in one place.

It became so common in many setups that it was almost treated like a default feature. As ComfyUI development moved under Comfy.Org, Manager has now also been incorporated as an official feature.

---

## New and Legacy Manager

![](https://gyazo.com/a0b09641bae0c8b02187e6c6b7bb9c5a){gyazo=image}

Confusingly, the current ComfyUI Manager has two versions: the **new Manager** and the **older Manager**, also called the legacy UI.

The new Manager has a cleaner UI and focuses on custom node management.
On the other hand, convenient features that existed in the legacy version, such as restarting ComfyUI itself, updating ComfyUI, and downloading models, have been removed.

Considering Comfy.Org's direction, the new Manager should be the recommended one, but many people may continue using the legacy version.

---

## Installation and Enabling

> Manager does not appear just because it is installed.  
> You also need to add a command line argument when launching ComfyUI.

### Desktop Version

If you use ComfyUI Desktop, ComfyUI Manager is already included.

No additional installation is required.

### Portable Version

1. Open the `ComfyUI_windows_portable` folder.
2. Right-click inside the folder and choose `Open in Terminal`.
3. Run the following command.

   ```powershell
   .\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt
   ```

   This installs the libraries required by ComfyUI Manager.

4. Right-click `run_nvidia_gpu.bat` and choose `Edit`.
5. Add `--enable-manager` to the end of the line that runs `main.py`.

   ```powershell
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager
   ```

ComfyUI Manager will be enabled the next time you launch ComfyUI.

### Manual Installation Version

For manual installation, work inside the ComfyUI folder with the virtual environment activated.

1. Activate the virtual environment.

   On Windows:

   ```powershell
   venv\Scripts\activate
   ```

   On Linux/macOS:

   ```bash
   . venv/bin/activate
   ```

2. Install the libraries required by ComfyUI Manager.

   ```bash
   pip install -r manager_requirements.txt
   ```

3. Add `--enable-manager` when launching ComfyUI.

   ```bash
   python main.py --enable-manager
   ```

### Opening ComfyUI Manager

![](https://gyazo.com/ff8b7cdae4aba2a086a9cfebe8019023){gyazo=image}

If installation and enabling succeeded, the `Extensions` button appears in the upper right.

Click it to open the Manager screen.

---

## Launching the Legacy UI

If you want to use the old ComfyUI Manager, add `--enable-manager-legacy-ui` together with `--enable-manager`.

For the portable version:

```powershell
.\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager --enable-manager-legacy-ui
```

For manual installation:

```bash
python main.py --enable-manager --enable-manager-legacy-ui
```

If the new Manager UI is enough, start with `--enable-manager` only.
If you need features that remain in the legacy version, such as update and model management, enable the legacy UI as needed.

---

## Installing Custom Nodes

### Current UI

![](https://gyazo.com/85ac7d6fb86580c06f252938e153a152){gyazo=loop}

1. Enter the node name in the search bar.
2. Click `Install`.
3. Click `Apply Changes`, or restart ComfyUI manually.

### Legacy UI

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

1. Click `Custom Nodes Manager`.
2. Enter the node name in the search bar.
3. Click `Install` (usually `latest` is fine for the version).
4. Click `Restart`, or restart ComfyUI manually.

---

## Updating Custom Nodes

### Current UI

![](https://gyazo.com/3f8316ae71333f2214173e9987346153){gyazo=image}

Go to the `Updates Available` tab.

Nodes that can be updated appear here.

- Use the `Update` button in the upper right to update them all at once.
- Select a target and use `Update` in the sidebar to update it individually.

### Legacy UI

![](https://gyazo.com/3eeb7b5df0d8567f0fdc37ec8c73fff1){gyazo=image}

1. Click `Custom Nodes Manager`.
2. Set Filter to `Installed` to show only installed nodes.
3. Click `Try Update` on the custom node you want to update.

---

### References

* [Installing ComfyUI Manager](https://docs.comfy.org/manager/install)
