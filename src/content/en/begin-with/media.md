---
layout: page.njk
lang: en
section: begin-with
slug: media
navId: media
title: "Media"
created: 2025-11-24
updated: 2026-03-02
summary: "Nodes for loading and saving images, video, and audio"
seoTitle: "Load and Save Images, Video, and Audio in ComfyUI"
seoDescription: "Core ComfyUI media nodes: Load Image, Save Image, and other image nodes, video nodes including Video Helper Suite, audio nodes, and quick ways to load files."
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## Images

### Load Image Node

Loads an image into ComfyUI.

![](/media/begin-with/media/legacy_gyazo_9dd4bfe10197dddec18b0e7a1dc94f53.mp4){media=loop}

Besides searching for the node and adding it, there are a few handy ways:
- a. Click `choose file to upload` to select a file.
- b. Drag and drop an image onto the node.
- c. With an image in your clipboard, press `Ctrl + V` on the canvas to paste it as a `Load Image` node.

> [!NOTE]
> Uploaded images are copied to the `ComfyUI\input` folder and loaded from there. **The original file is not referenced directly.**
>
> These images stay there unless you delete them from the input folder, so once you've loaded an image, you can reuse it as many times as you like.

### Preview Image Node

Lets you check generated images right there.
It doesn't save anything, so use it when you want a quick look at intermediate steps or results.

![](/media/begin-with/media/legacy_gyazo_9f5a3055bbb8ef271583545155f70371.mp4){media=loop}

- As with other image-related nodes, you can right-click and select `Save Image` or `Copy Image` to save or copy the image.
- It's handy because you don't have to dig through the output folder for the image.


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

- There are plenty more; see here for details: [ComfyUI Explanation (not wiki)/SaveImage](https://comfyui.creamlab.net/nodes/SaveImage)

If you want to change the default save location, set it using [Command Line Arguments](/en/begin-with/command-line-arguments/).
```powershell
main.py --output_dir --output-directory [path]
```

### Load Image (from Outputs) Node

The latest image saved by the `Save Image` node is loaded here.
It's sometimes used to fake a loop.

![](/media/begin-with/media/legacy_gyazo_1b344fc1baa844c784d53a9790e6aafb.mp4){media=loop}

### Image Comparer (rgthree) Node

You can compare two images with a slider.

![](/media/begin-with/media/legacy_gyazo_a3ac0fe532474c1447a2f9cd33b31649.mp4){media=loop}

[](/workflows/begin-with/media/image_comparer_rgthree.json)

- It is added by [rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy).

---

## Videos

### Load Video Node

Loads a video.

![](/media/begin-with/media/legacy_gyazo_96531a04d73333953691800babd073b9.png){media=image}

In ComfyUI, many nodes treat video as a **sequence of images**.
This node, however, outputs the `VIDEO` type, so you can't use it as is. You need to split the video into images, audio, and fps with the `Get Video Components` node.

That's why I recommend the **Video Helper Suite**, covered below, for working with video.

> [!WARNING]
> Videos are normally compressed, but ComfyUI expands them into an uncompressed sequence of images when it loads them.
> Loading something like a high-fps 4K video can use up all your PC's RAM and crash it, even if the clip is only a few seconds long.
>
> The **Video Helper Suite** nodes let you resize frames and limit how many are loaded, so they're also the better choice for keeping memory use in check.

### Save Video Node

Saves the generated video.

![](/media/begin-with/media/legacy_gyazo_695faf8fda159e16dc56ef533e28eb8f.png){media=image}

This time it's the other way around: the image sequence has to be turned back into `VIDEO`, so use the Create Video node to combine the images and audio.

## 🎥Video Helper Suite

[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

A set of handy nodes for working with video.
It's been around longer than the core nodes, and since it's feature-rich and easy to use, it's often used instead.

![](/media/begin-with/media/legacy_gyazo_ebfd8a274dbdecb613f3fa232eb3dbb0.png){media=image}

### Load Video (Upload/Path) Node

You can lower the FPS or shrink the video as you load it.
If you load it at just the settings today's video generation AI needs, you avoid putting extra load on your system.

Like the Load Image node, you can also load videos by drag and drop.

Get the fps, frame count, and so on of the loaded video from the `Video Info` node.

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

Creates a video directly from an image sequence and audio.

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

Lets you listen to the audio right there.

### Save Audio Node

Saves the audio.

There are three versions, one for each save format:

- `Save Audio (FLAC)`
- `Save Audio (MP3)`
- `Save Audio (Opus)`

## Webcam

![](/media/begin-with/media/legacy_gyazo_2a7ab2f8dc9179e6c02d15e74dedcea3.png){media=image}

You can capture webcam input as an image.

For details, please see [Webcam Input](/en/data-utilities/webcam-input/).
