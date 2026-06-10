---
layout: page.njk
lang: en
section: basic-workflows
slug: ideogram-4
navId: ideogram-4
title: "Ideogram 4.0"
created: 2026-06-10
updated: 2026-06-10
summary: "Image generation with Ideogram 4.0"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/cb9116562b7693e120aa63eafef11769.png"
tags: []
---

## What is Ideogram 4.0?

[Ideogram 4.0](https://ideogram.ai/models/4.0/) is a 9.3B DiT-based model.

Its main feature is that it uses JSON-style captions, allowing fairly detailed control over elements inside the image.

There was a similar model called [FIBO](https://github.com/Bria-AI/FIBO), but Ideogram 4.0 is stronger at BBOX coordinate instructions and color specification. It is suited to DTP-like design tasks such as posters, logos, UI, and packaging.

In exchange for that control, it may not be the most casual model. You need to write prompts in the expected format to get its intended performance.

---

## Model Download

- diffusion_models
  - [ideogram4_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_fp8_scaled.safetensors) (9.28 GB)
  - [ideogram4_nvfp4_mixed.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_nvfp4_mixed.safetensors) (5.49 GB)
  - [ideogram4_unconditional_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_unconditional_fp8_scaled.safetensors) (9.28 GB)
  - [ideogram4_unconditional_nvfp4_mixed.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_unconditional_nvfp4_mixed.safetensors) (5.49 GB)
- text_encoders
  - [qwen3vl_8b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/text_encoders/qwen3vl_8b_fp8_scaled.safetensors) (10.6 GB)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── ideogram4_fp8_scaled.safetensors
    │   ├── ideogram4_nvfp4_mixed.safetensors
    │   ├── ideogram4_unconditional_fp8_scaled.safetensors
    │   └── ideogram4_unconditional_nvfp4_mixed.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_8b_fp8_scaled.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

I will explain the details later, but because it loads two Diffusion models, it is quite heavy.

ComfyUI manages memory internally, so lack of VRAM does not always mean it cannot generate at all, but it can take a very long time.

`nvfp4` is an option to make it lighter, but quality drops.

The `unconditional` side has less impact on quality, so using `fp8` for the normal side and `nvfp4` for the `unconditional` side may be a good balance.

---

## Prompt

Plain natural language can generate images, but without following the expected JSON schema, the quality will not really come out.

The basic form looks like this.

```json
{
  "high_level_description": "Overall 1-2 sentence description of the image.",
  "style_description": {
    "aesthetics": "Mood and aesthetic direction.",
    "lighting": "Lighting.",
    "medium": "illustration / photograph / graphic_design, etc.",
    "art_style": "Art style for non-photographic images.",
    "color_palette": ["#FFFFFF", "#000000"]
  },
  "compositional_deconstruction": {
    "background": "Background and environment description.",
    "elements": [
      {
        "type": "obj",
        "bbox": [100, 200, 800, 700],
        "desc": "Description of an object, person, or element.",
        "color_palette": ["#FFFFFF", "#000000"]
      },
      {
        "type": "text",
        "bbox": [820, 200, 920, 800],
        "text": "HELLO",
        "desc": "Description of the text appearance.",
        "color_palette": ["#000000"]
      }
    ]
  }
}
```

The structure itself is simple: overall description, style, background, and descriptions for each element. Still, writing this by hand every time is not realistic.

The coordinates are especially annoying. You need to specify where each element should go using BBOX, and imagining that in your head is almost impossible.

So here are a few ways to create the prompt.

### Let an LLM Handle It

The easiest way is to pass the official [Prompting Guide](https://github.com/ideogram-oss/ideogram4/blob/main/docs/prompting.md) and a description of the image you want to an LLM, and have it convert the request into a JSON caption.

You can also give it reference images or a rough sketch you made.

Local models that can run inside ComfyUI usually are not strong enough for this, so it is better to rely on ChatGPT, Gemini, and similar tools.

![](https://gyazo.com/b314abc36bec096b81fb3231a2687064){gyazo=image}

- [Sample chat with ChatGPT](https://chatgpt.com/share/6a28f7cc-e934-8320-86d6-f790a5274389)

### Use a Dedicated Prompt Builder

Another option is to use a dedicated prompt builder and create the prompt visually.

For example, [ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes) includes a commonly used node called `Ideogram 4 Prompt Builder KJ`.

![](https://gyazo.com/a1c3a269983b478c1f605e2f0a5c6e4f){gyazo=image}

- Set the generated image size, then enter the background and style fields.
- Drag in the region field to create a BBOX, then set the prompt and color code for what you want drawn there.

---

## text2image

![](https://gyazo.com/c9a2cf1717e87cd1ba28c5d236a02b4d){gyazo=image}

[](/workflows/basic-workflows/ideogram-4/Ideogram_4.0_text2image.json)

Aside from the prompt, there are a few parts that are slightly different from a normal workflow, so let's look only at those.

{% mediaRow img="https://gyazo.com/c0d5e9131313e7c3c5255b4f54d55dbb {gyazo=image}", width=33, align="left" %}
**Load Diffusion Model**

Ideogram 4.0 loads two diffusion models for its slightly unusual CFG.

- In normal [CFG](/en/ai-capabilities/cfg/), the result with a prompt and the result without a prompt are compared, pushing the generation toward the prompt.
- Ideogram 4.0 does not use a simple empty prompt on the unconditional side. It uses the model side that has no text condition.
- It is easy to wonder what the difference is, but you can think of it as a trick for handling the positive prompt more delicately.

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/26ef78ed5bf868ab5ca9a62b643640ff {gyazo=image}", width=33, align="left" %}
**CFG**

This is an old small technique, but the CFG value changes between the first and second half of sampling.

- In this workflow, the first half is CFG 7, and the second half is CFG 3.
- Rather than applying high CFG from start to finish, weakening it partway through tends to be more stable.
- `CFG Override` is the node used for this.
- It overrides the CFG value only for the specified step range.
- In this workflow, `cfg` becomes 3 after 70% of the total steps.

{% endmediaRow %}
