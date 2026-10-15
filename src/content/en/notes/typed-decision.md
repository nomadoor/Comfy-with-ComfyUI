---
layout: page.njk
lang: en
slug: typed-decision
section: notes
navId: typed-decision
title: "ComfyUI-TypedDecision"
created: 2026-09-30
updated: 2026-10-16
noteTags: ["project", "custom-nodes", "concept"]
summary: "A node that answers one question about images, video or text, with a probability attached"
seoTitle: "ComfyUI-TypedDecision: an MLLM that only decides"
seoDescription: "A ComfyUI custom node that answers questions about images, video and text with probabilities, in three shapes: noul, choice and score. Workflows using d3-mini."
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/typed-decision/typed_decision_d3_mini_noul.png"
---

## ComfyUI-TypedDecision

Having a multimodal LLM make a decision instead of writing text is sometimes called "Typed Decision".
Jev is the well-known one, but several models can do the same thing locally, so I built them into a ComfyUI custom node.

Since the shape of the answer is fixed, it may come in handy for branching or for processing datasets. And above all, it's fast.

Let's look at what Typed Decision can do, and what you can do with it in ComfyUI.

---

## Install

[nomadoor/ComfyUI-TypedDecision](https://github.com/nomadoor/ComfyUI-TypedDecision)

- Search for `TypedDecision` in `ComfyUI Manager` and install it.

---

## Supported models

| Model | Base | int8 size | Images | Video |
| --- | --- | --- | --- | --- |
| [d3-flash](https://huggingface.co/vllm-sr/d3-flash) | Qwen3.5-9B | 9.88 GB | any number | ○ |
| [d3-mini](https://huggingface.co/vllm-sr/d3-mini) | Qwen3.5-4B | 5.52 GB | any number | ○ |
| [d3-nano](https://huggingface.co/vllm-sr/d3-nano) | Qwen3.5-2B | 3.06 GB | any number | ○ |
| [d3-lite](https://huggingface.co/vllm-sr/d3-lite) | Qwen3.5-0.8B | 1.21 GB | any number | ○ |
| [Clef-flash](https://huggingface.co/Cloudflare/clef-flash) | Qwen3.5-9B | 12.2 GB | any number | ○ |
| [imajev-4b](https://huggingface.co/mohit67890/imajev-4b) | Qwen3.5-4B + LoRA | 5.76 GB + 490 MB | up to 2 | × |

Everything in this article uses **d3-mini**. It performs well and is light on top of that, so I recommend it.

---

## Downloading the models

### d3 / Clef-flash

Put the ones you use in `text_encoders`.

- text_encoders
  - [d3_mini_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_mini_int8_convrot.safetensors) (5.52 GB)
  - [d3_flash_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_flash_int8_convrot.safetensors) (9.88 GB)
  - [d3_nano_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_nano_int8_convrot.safetensors) (3.06 GB)
  - [d3_lite_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_lite_int8_convrot.safetensors) (1.21 GB)
  - [clef_flash_int8_convrot.safetensors](https://huggingface.co/nomadoor/clef/blob/main/text_encoders/clef_flash_int8_convrot.safetensors) (12.2 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂text_encoders/
        └── d3_mini_int8_convrot.safetensors
```

### imajev

imajev combines Qwen3.5-4B with the imajev-4b files.

- text_encoders
  - [qwen3.5_4b_int8_convrot.safetensors](https://huggingface.co/nomadoor/Qwen3.5/blob/main/text_encoders/qwen3.5_4b_int8_convrot.safetensors) (5.76 GB)
- typed_decision
  - [mohit67890/imajev-4b](https://huggingface.co/mohit67890/imajev-4b/tree/main) (490 MB for the files below)
    - Put these files in an `imajev-4b` folder. Downloading the whole repository also works.

```text
📂ComfyUI/
└── 📂models/
    ├── 📂text_encoders/
    │   └── qwen3.5_4b_int8_convrot.safetensors
    └── 📂typed_decision/
        └── 📂imajev-4b/
            ├── adapter_config.json
            ├── adapter_model.safetensors
            ├── calibration-rot4-modality.json
            ├── decision_readout.json
            └── decision_readout.safetensors
```

---

## Load Typed Decision Model

Pick the model file in `backbone`, and the kind of model in `adapter`.

| Model | `backbone` | `adapter` |
| --- | --- | --- |
| d3 | a d3 file | `d3` |
| Clef-flash | a Clef-flash file | `clef` |
| imajev | a Qwen3.5-4B file | `imajev-4b` |

Once you pick an `adapter`, the settings that model supports appear.

- `debias` (d3, imajev): judges with the options in different orders and averages the results. Less bias from the order, but slower
  - d3 also judges in reverse order, for choice only
  - imajev judges up to four orders, in every mode
- `fps` (d3, Clef-flash): how many video frames to read per second (default 2)
- `calibration` (imajev): applies temperature calibration

---

## The three modes

There are three shapes a question can take. The one you pick changes both the input fields and the type of the answer. Write the questions and options in English.

> [!NOTE]
> The output sockets are the same across all three modes, but what they mean changes with the mode.

### noul (Yes or No)

Answers a question with true or false.

![](/media/notes/typed-decision/typed_decision_d3_mini_noul.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_noul.json)

**Input**

- `instructions` takes the claim to judge, or a question that can be answered yes / no
- `criteria_true` / `criteria_false` are optional. Use them to say when the answer should be yes or no

**Output**

- `value` is the probability of true
- `label` is `yes` / `no`
- `pass` is a `Boolean`: `value >= threshold`

Here the claim is "many people are in the image", judged true or false.

How many counts as "many" is vague, though. So the criteria spell it out: yes for five or more, no for four or fewer.

### choice

Picks one of the options you supply.

![](/media/notes/typed-decision/typed_decision_d3_mini_choice.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_choice.json)

**Input**

- `criteria` takes the options, one per line
  - When the name alone is not enough, add a description after `:`, as in `landscape: scenery with no clear main subject`

**Output**

- `value` is the probability of the chosen option
- `label` is the chosen option
- `index` is the line it came from
  - The third line counts as `index` 2, since counting starts at 0

### score

Rates something on the scale you define.

![](/media/notes/typed-decision/typed_decision_d3_mini_score.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_score.json)

**Input**

- `criteria` takes the levels, one per line, **lowest first**

**Output**

- `value` is the expected level
  - The first line counts as `0`, so five levels give a range of `0.0` to `4.0`

Here it rates how usable a photo is for a training dataset, on five levels.

`value` is an average weighted by the probability of each level, so it lands between levels, like `1.35`. That reads as "between poor and acceptable, closer to poor".

---

## Any number of images

d3 and Clef-flash take any number of images, so you can ask questions that compare several of them.

imajev takes up to two, and **the first is the reference, the second is the one being judged.**

![](/media/notes/typed-decision/typed_decision_d3_mini_noul_two_images.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_noul_two_images.json)

Ask "are the first and second images the same person?" and you have a same-person check.

---

## Video works too

With d3 and Clef-flash, connect a video to `videos` and it answers questions about the video.

![](/media/notes/typed-decision/typed_decision_d3_mini_noul_visible.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_noul_visible.json)

The whole video is read at the `fps` set in Load Typed Decision Model, and all the frames are judged together in one go. A one-minute video at 2 fps is 120 frames.

At 2 fps it only looks every 0.5 seconds, so something that appears for just an instant may be missed.

---

## Passing context with state

If `instructions` is the question, `state` is **the context for answering it**. Anything the image cannot tell you goes here as text.

Say you want to judge whether the product in a photo matches the colour in a listing. Nothing in the question says which colour is correct.

Put the listing in `state` and the model has something to compare against.

- `state`: `The listing says: red suede boat shoes.`
- `instructions`: `The shoes in the photo match the color in the listing.`

> [!TIP]
> `state` can be JSON. Then `instructions` can name a field directly, as in `listing.color`.

---

## Typed Decision Moment Search

A node that finds the stretches of a video where a condition holds. It suits conditions a single frame can show, such as "a dog is visible" or "this person is visible". By design, it cannot judge the direction of a motion, such as "walking to the right".

![](/media/notes/typed-decision/typed_decision_moment_search_d3_mini.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_moment_search_d3_mini.json)

Here it finds where the person in the reference image appears, and joins those stretches into one video.

**Input**

- `instructions` / `criteria_true` / `criteria_false` / `state` work as in Typed Decision's noul
- Connect a reference image to `images` to find that person or thing in the video
- `window` is how many frames are judged together at first (default 8, which is 4 seconds at 2 fps)
- `threshold` is the probability a frame needs to pass

**Output**

- `intervals` is JSON with the start and end time of each stretch found, and more
- `videos` holds the video cut out for each stretch
  - When nothing is found, the video nodes after it do not run

{% outputs %}
![input](/media/notes/typed-decision/typed_decision_moment_search_d3_mini_input_video.mp4){media=loop} ![reference image](/media/notes/typed-decision/typed_decision_moment_search_d3_mini_input_image.png){media=image} ![output](/media/notes/typed-decision/typed_decision_moment_search_d3_mini_output.mp4){media=loop}
{% endoutputs %}

### Writing the question

With a reference image, ask **about the video**.

- ○ `The video shows the same person as the image.`
- × `The person in the image is visible.`

The second one is true of the reference image itself, so every frame passes.

> [!NOTE]
> Stretches are cut exactly where the model says. Someone half out of frame may already count as "not visible", so write the question for what you want to count.

---

## In practice

### Picking a resolution from the prompt

The examples above took images or video, but text alone works too.

Let's have it read the prompt and decide which shape to generate — portrait, landscape or square.

![](/media/notes/typed-decision/typed_decision_choice_resolution_from_prompt_krea2.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_choice_resolution_from_prompt_krea2.json)

Three resolutions are prepared as a [List](/en/data-utilities/list/), and the `index` output of `choice` switches between them.

1. Put the prompt into `state`
2. Have `choice` pick `portrait` / `landscape` / `square`
   - `index` is an `INT`, so portrait = 0, landscape = 1, square = 2
3. Pass `index` to `Get Item From List` to pull a width and a height
4. Feed both into `Empty Latent Image` and generate

This prompt chose `square`, and sure enough the image came out 1024 × 1024.

{% outputs %}
![](/media/notes/typed-decision/typed_decision_choice_resolution_from_prompt_krea2_output.png){media=image}
{% endoutputs %}

### Sorting a dataset

Making use of the speed, sorting a large pile of images looks like a good fit.

![](/media/notes/typed-decision/typed_decision_noul_dataset_sort.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul_dataset_sort.json)

This sorts a folder of images into the ones that match a condition and the ones that do not.

1. `Load Image (from Folder)` reads the folder as a List
2. `noul` judges whether a person is visible
3. `pass` goes to `If/Else Switch`, which switches the save path
   - A `typed_decision` folder appears in ComfyUI's output folder, with `accepted` and `rejected` inside it

Let's feed it a folder holding two photos of people and three of something else.

{% outputs %}
![input](/media/notes/typed-decision/typed_decision_noul_dataset_sort_input.png){media=image} ![output (accepted)](/media/notes/typed-decision/typed_decision_noul_dataset_sort_output_accepted.png){media=image} ![output (rejected)](/media/notes/typed-decision/typed_decision_noul_dataset_sort_output_rejected.png){media=image}
{% endoutputs %}

The images with a person land in `accepted`, the rest in `rejected`.

---

{% outputs "samples" %}
![noul](/media/notes/typed-decision/typed_decision_noul_input.png){media=image} ![choice](/media/notes/typed-decision/typed_decision_choice_input.png){media=image} ![score](/media/notes/typed-decision/typed_decision_score_input.png){media=image} ![two images, first](/media/notes/typed-decision/typed_decision_noul_two_images_input1.png){media=image} ![two images, second](/media/notes/typed-decision/typed_decision_noul_two_images_input2.png){media=image} ![video](/media/notes/typed-decision/typed_decision_d3_mini_noul_input.mp4){media=loop}
{% endoutputs %}
