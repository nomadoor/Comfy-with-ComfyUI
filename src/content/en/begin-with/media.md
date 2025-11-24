---
layout: page.njk
lang: en
slug: media
navId: media
title: "Media"
summary: "About media"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## Images

### Load Image Node

Loads an image into ComfyUI.

- Click `choose file to upload` to select a file.
- Drag and drop an image onto the node.
- With an image in your clipboard, press `Ctrl + V` on the canvas to paste it as a `Load Image` node.

![](https://gyazo.com/9dd4bfe10197dddec18b0e7a1dc94f53){gyazo=loop}

> **Note**
> Uploaded images are copied to the `ComfyUI\input` folder and loaded from there. **The original file is not referenced directly.**
>
> Since these images remain in the input folder unless deleted, you can reuse an image as many times as you like once it's loaded.

### Preview Image Node

Displays the generated image on the spot. Since it doesn't save the image, use this to temporarily check intermediate processing steps or generation results.

> **Tip**
> As with other image-related nodes, you can right-click and select `Save Image` or `Copy Image` to save or copy the image.
> This is convenient as you don't have to search for the image in the output folder.

![](https://gyazo.com/9f5a3055bbb8ef271583545155f70371){gyazo=loop}

### Save Image Node

Saves the generated image.

- Default save location: `ComfyUI\output`
- Sequential numbers are automatically added to the filename. (e.g., `ComfyUI_00001_.png`)

You can control the save directory and filename format by entering values in `filename_prefix`.

Commonly used formats are as follows:

| Use Case | Format Example | Description |
|------|--------|------|
| Insert Date | `%date:yyyy-MM-dd%` | Inserts the date (e.g., `2025-11-23`) |
| Create Subfolder | Include `/` | Including `/` treats it as a folder hierarchy |

```text
%date:yyyy-MM-dd%/cat_project   #Example
ComfyUI/output/2025-11-23/cat_project_00001_.png    #Output Example
```

- There are many others, but for details see here: [ComfyUI Explanation (not wiki)/SaveImage](https://comfyui.creamlab.net/nodes/SaveImage)

If you want to change the default save location, set it using [Command Line Arguments](/en/begin-with/command-line-arguments/).
```powershell
main.py --output_dir --output-directory [path]
```

### Load Image (from Outputs) Node

The latest image saved by the `Save Image` node is loaded here.
It is sometimes used as a pseudo-loop process.

![](https://gyazo.com/1b344fc1baa844c784d53a9790e6aafb){gyazo=loop}

---

## Videos

### Load Video Node

In ComfyUI, many nodes treat video as a **sequence of images**.

However, the output of this node is of type `VIDEO`, so it cannot be used as is. You need to decompose the video into images, audio, and fps using the `Get Video Components` node.

Therefore, when handling videos, we recommend using the **Video Helper Suite** described below.

![](https://gyazo.com/96531a04d73333953691800babd073b9){gyazo=image}

> **Note:**
> Videos are basically compressed, but when loaded in ComfyUI, they are expanded as a sequence of images (uncompressed).
> Loading a 4K high-fps video can exhaust your PC's RAM in seconds and cause a crash.
>
> The **Video Helper Suite** nodes allow you to resize images and specify the number of frames to load, so they are also recommended from a memory management perspective.

### Save Video Node

Saves the generated video.

This time, conversely, you have to convert the sequence of images back to `VIDEO`, so use the Create Video node to combine images and audio.

![](https://gyazo.com/695faf8fda159e16dc56ef533e28eb8f){gyazo=image}

## 🎥Video Helper Suite

[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

A set of convenient nodes for handling videos.
It has existed longer than the core nodes, and because it is feature-rich and easy to use, it is often used.

![](https://gyazo.com/ebfd8a274dbdecb613f3fa232eb3dbb0){gyazo=image}

### Load Video (Upload/Path) Node

When loading, you can lower the FPS or resize it to be smaller.
If you load the video with the minimum parameters necessary for current video generation AI, you won't put unnecessary load on the system.

Like the Load Image node, you can also load videos by drag and drop.

The fps and frame count of the loaded video are obtained from the `Video Info` node.

| Parameter Name | Description |
| --- | --- |
| force_rate | Specify frame rate (0 to disable) |
| custom_width | Width when resizing (0 to disable) |
| custom_height | Height when resizing (0 to disable) |
| frame_load_cap | Maximum number of frames to load (0 for unlimited) |
| skip_first_frames | Number of frames to skip at the beginning |
| select_every_nth | Get 1 frame every N frames (decimation) |
| format | Output format (presets according to the model can be selected) |

### Video Combine Node

Directly inputs image sequences and audio to create a video.

| Parameter Name | Description |
| --- | --- |
| images | Input images (sequence) |
| audio | Input audio |
| frame_rate | Output frame rate |
| loop_count | Loop the input video in the output |
| filename_prefix | Same as `Save Image` node |
| format | Output format (mp4, gif, webp, etc.) |
| pingpong | Ping-pong playback (adds reverse playback after playback) |
| save_output | If off, it will not be saved and only previewed |

---

## Audio

### Load Audio Node

Loads an audio file.

### Preview Audio Node

Checks the audio on the spot.

### Save Audio Node

Saves the audio.

There are three types depending on the format you want to save:

- `Save Audio (FLAC)`
- `Save Audio (MP3)`
- `Save Audio (Opus)`
