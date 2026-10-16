---
layout: page.njk
lang: en
section: begin-with
slug: updates
navId: updates
title: "Updates"
created: 2025-11-24
updated: 2026-03-02
summary: "How to keep ComfyUI up to date"
seoTitle: "How to Update ComfyUI: Stable vs. Nightly"
seoDescription: "Update ComfyUI: Stable vs. Nightly, and update steps for the portable build, manual installs, ComfyUI Manager, and the desktop app."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Stable Version and Nightly Version

When you update, you can choose which version to install.

| Version | Features | Recommended Case |
| :--- | :--- | :--- |
| **Stable Version** | A finalized release with noticeable bugs fixed, confirmed to work. Official announcements usually refer to this version. | When you want to prioritize stability. |
| **Nightly Version** | The latest version, with every newly added feature and fix. It hasn't been fully tested, so you may run into bugs. | When you want to try new features or support for the latest models immediately. |

> [!WARNING]
> If you "updated to the latest version but still can't use this feature/model," you may have chosen the **Stable Version**. The latest features go into the **Nightly Version** first.

---

## Portable Version

The Windows portable version is easy to update: just run one of the included `.bat` files.

Run a `.bat` file in the folder below to start the update. Even if it looks stuck while running, it's usually still working, so wait until **`Done!`** appears.

```bat
📂ComfyUI_windows_portable/
└── 📂update/
    ├── update_comfyui.bat
    ├── update_comfyui_stable.bat
    └── update_comfyui_and_python_dependencies.bat
```

* **`update_comfyui.bat`**
    * Updates to the Nightly version.
* **`update_comfyui_stable.bat`**
    * Updates to the Stable version.
* **`update_comfyui_and_python_dependencies.bat` ⚠️**
    * Updates to the Nightly version, then also updates PyTorch (a core Python library).
    * Updating PyTorch is **very likely to break custom nodes**, so if nothing is wrong right now, it's better not to use this one.

---

## Manual Installation Version

### Update to Nightly Version

Run the following commands to update to the latest Nightly version.

**Windows**

```powershell
# 1. Activate virtual environment
.\venv\Scripts\activate

# 2. Update ComfyUI core with Git
git pull --ff-only

# 3. Update necessary Python libraries
pip install -r requirements.txt
```

**Mac / Linux**

```bash
# 1. Activate virtual environment
source venv/bin/activate

# 2. Update ComfyUI core with Git
git pull --ff-only

# 3. Update necessary Python libraries
pip install -r requirements.txt
```


### Switching to Stable Version
Switching the current Git HEAD to the latest stable tag takes some fiddly steps. If you want the stable version on a manual install, it's usually easier to clone the Stable branch from the start or to use Manager.

---

## ComfyUI Manager

If you have ComfyUI Manager installed, you can update from the UI.

![ComfyUI_Manager_Updates](/media/begin-with/updates/legacy_gyazo_33cab8c113457ee1a54035612bea9c11.png){media=image}

- 1.  Select the version you want to update to (**Nightly Version** or **Stable Version**)
- 2.  Click the **`Update ComfyUI`** button

> [!WARNING]
> `Update All` is a button to update **all installed custom nodes**, not ComfyUI itself.

---

## Desktop Version

It updates automatically.

As a rule, it only runs the stable version, so if you want the latest features, use something like the Portable version.
