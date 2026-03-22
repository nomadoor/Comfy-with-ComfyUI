---
layout: page.njk
lang: en
section: faq
slug: sd15-sdxl-asset-compatibility
navId: sd15-sdxl-asset-compatibility
title: "Can't use SD1.5 LoRA / ControlNet with SDXL?"
summary: "Compatibility between models and why SD1.5 assets cannot be used with SDXL."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Can't use SD1.5 LoRA / ControlNet with SDXL?

In conclusion, **no, you cannot.**
And this is not limited to SD1.5 and SDXL; it is safe to assume that **there is almost no compatibility between different models**.

It is like electrical outlets.
- SD1.5 is a Japanese outlet (Type A)
- SDXL is a US outlet (Type B)

Appliances (LoRA / ControlNet) for that country can only be used in that country.
Even if the functions are similar, the shape of the connection part is different, so they cannot be physically plugged in.

---

## Why is there no compatibility?

Roughly summarized, the technical reasons are as follows:

- **The prerequisite models are different**
  - SD1.5 and SDXL have different UNet structures, channel counts, latent resolutions, etc., so the premise of LoRA / ControlNet on "which layer to add what difference to" does not match.

- **Text encoders are also different**
  - SD1.5 uses CLIP, while SDXL uses a text encoder with a different configuration. The learning result of "how to move this word" does not apply to another model as is.


You can assume that adapters are dedicated to that model.

- LoRA / ControlNet for SD1.5 → **Dedicated to SD1.5 based models**
- LoRA / ControlNet for SDXL → **Dedicated to SDXL based models**
- LoRA / ControlNet for Flux → **Dedicated to Flux based models**

---

## Does it actually cause an error?

![](https://gyazo.com/3d13852e4d5921d17dd6e6c1835bfafa){gyazo=image}

If you connect a ControlNet model for SDXL to a ControlNet workflow for SD1.5, an error like the one above will be displayed:

```
y is None, did you try using a controlnet for SDXL on SD1?
```

In this way, the system detects that there is no compatibility and returns an error.
