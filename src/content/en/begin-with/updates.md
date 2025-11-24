---
layout: page.njk
lang: en
section: begin-with
slug: updates
navId: updates
title: "Updates"
summary: ""
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Stable Version and Nightly Version

When updating, you can choose which version to apply.

| Version | Features | Recommended Case |
| :--- | :--- | :--- |
| **Stable Version** | A confirmed version with guaranteed operation where noticeable bugs have been fixed. Official announcements usually refer to this. | When you want to prioritize stability. |
| **Nightly Version** | The latest version containing all newly implemented features and fixes. Operation verification is incomplete, so defects may occur. | When you want to try new features or support for the latest models immediately. |

> **Note:** If "I updated to the latest version but cannot use this feature/model", you may have selected the **Stable Version**. The latest features go into the **Nightly Version** first.

---

## Portable Version

The Windows portable version can be easily updated just by executing the provided `.bat` file.

Update starts when you execute the `.bat` file in the following hierarchy. Even if it looks like it has stopped during execution, it is often running, so wait until **`Done!`** is displayed.

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
    * After updating to the Nightly version, PyTorch (Python's core library) update is performed.
    * PyTorch updates are **very likely to cause custom nodes to stop working**, so it is better not to use it if there are currently no problems.

---

## Manual Installation Version

### Update to Nightly Version

Executing the following commands will update to the latest Nightly version.

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
Complex operations are required to switch the current Git HEAD to the latest stable tag. Usually, if you use the stable version with the manual installation version, it is easier to clone the Stable branch from the beginning or use Manager.

---

## ComfyUI Manager

If you have installed ComfyUI Manager, you can update from the UI.

![ComfyUI_Manager_Updates](https://i.gyazo.com/33cab8c113457ee1a54035612bea9c11.png){gyazo=image}

- 1.  Select the version you want to update (**Nightly Version** or **Stable Version**)
- 2.  Click the **`Update ComfyUI`** button

> **Note:** `Update All` is a button to update **all installed custom nodes**, not ComfyUI itself.

---

## Desktop Version

It updates automatically.

Basically, only the stable version can be used, so if you want to use the latest features, use the Portable version etc.
