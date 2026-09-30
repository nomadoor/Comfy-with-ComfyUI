---
layout: page.njk
lang: en
slug: typed-decision
section: notes
navId: typed-decision
title: "ComfyUI-TypedDecision"
created: 2026-09-30
updated: 2026-09-30
noteTags: ["project", "custom-nodes", "concept"]
summary: "A node that answers one question about images or text, with a probability attached"
seoTitle: "ComfyUI-TypedDecision: an MLLM that only decides"
seoDescription: "A ComfyUI custom node that answers questions about images and text with probabilities, in three shapes: noul, choice and score. Workflows using imajev-4b."
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/typed-decision/typed_decision_noul.png"
---

## ComfyUI-TypedDecision

Jev started it, and **MLLMs that only decide** are having a moment. Instead of writing prose, you ask "is there a person in this image?" and get back `yes` / `no` along with how sure it is. The task has come to be called **typed decision**.

There are a few local alternatives to Jev. [imajev](https://github.com/mohit67890/imajev) fit ComfyUI's core system unusually well, so that is the one I built a custom node for first.

Let's look at what typed decision can do, and what you can do with it in ComfyUI.

---

## Install

[nomadoor/ComfyUI-TypedDecision](https://github.com/nomadoor/ComfyUI-TypedDecision)

- Search for `TypedDecision` in `ComfyUI Manager` and install it.

---

## Downloading the models

- text_encoders
  - [qwen3.5_4b_int8_convrot.safetensors](https://huggingface.co/nomadoor/Qwen3.5/blob/main/text_encoders/qwen3.5_4b_int8_convrot.safetensors) (5.76 GB)
  - or the original [qwen3.5_4b_bf16.safetensors](https://huggingface.co/Comfy-Org/Qwen3.5/blob/main/text_encoders/qwen3.5_4b_bf16.safetensors) (9.32 GB)
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

## The three modes

There are three shapes a question can take. The one you pick changes both the input fields and the type of the answer.

> [!NOTE]
> The output sockets are the same across all three modes, but what they mean changes with the mode.


### noul (Yes or No)

Answers a question with true or false.

![](/media/notes/typed-decision/typed_decision_noul.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul.json)

**Input**

- `instructions` takes the claim to judge, or a question that can be answered yes / no
- `criteria_true` / `criteria_false` are optional. Use them to say when the answer should be yes or no

**Output**

- `value` is the probability of true
  - Whatever it cannot decide is split evenly between true and false, so an uncertain answer lands near 0.5
- `label` is `yes` / `no`
- `pass` is a `Boolean`: `value >= threshold`, and the model did not abstain

Here the claim is "many people are in the image", judged true or false.

How many counts as "many" is vague, though. So the criteria spell it out: yes for five or more, no for four or fewer.

### choice

Picks one of the options you supply.

![](/media/notes/typed-decision/typed_decision_choice.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_choice.json)

**Input**

- `criteria` takes the options, one per line
  - When the name alone is not enough, add a description after `:`, as in `landscape: scenery with no clear main subject`

**Output**

- `label` is the chosen option
- `index` is the line it came from
  - The third line counts as `index` 2, since counting starts at 0

### score

Rates something on the scale you define.

![](/media/notes/typed-decision/typed_decision_score.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_score.json)

**Input**

- `criteria` takes the levels, one per line, **lowest first**

**Output**

- `value` is the expected level
  - The first line counts as `0`, so five levels give a range of `0.0` to `4.0`

Here it rates how usable a photo is for a training dataset, on five levels.

`value` is an average weighted by the probability of each level, so it lands between levels, like `3.4`. That reads as "between good and excellent, closer to good".

---

## Two images at once

imajev takes up to two images.
**The first is the reference, the second is the one being judged.**

> [!WARNING]
> ComfyUI will keep offering a third socket and beyond. imajev only takes two, so connecting more is an error.

![](/media/notes/typed-decision/typed_decision_noul_two_images.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul_two_images.json)

Ask "are the first and second images the same person?" and you have a same-person check.

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

## In practice

### Picking a resolution from the prompt

Everything above took an image, but text alone works too.

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

The best thing about typed decision is how fast it is.

Which makes sorting a large pile of images a promising use for it.

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

> [!NOTE]
> The `abstained` output lets you separate out the ones it could not decide on. A way to narrow down what a human needs to look at.

---

{% outputs "samples" %}
![noul](/media/notes/typed-decision/typed_decision_noul_input.png){media=image} ![choice](/media/notes/typed-decision/typed_decision_choice_input.png){media=image} ![score](/media/notes/typed-decision/typed_decision_score_input.png){media=image} ![two images, first](/media/notes/typed-decision/typed_decision_noul_two_images_input1.png){media=image} ![two images, second](/media/notes/typed-decision/typed_decision_noul_two_images_input2.png){media=image}
{% endoutputs %}
