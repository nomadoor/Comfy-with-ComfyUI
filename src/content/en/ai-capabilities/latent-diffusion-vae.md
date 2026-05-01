---
layout: page.njk
lang: en
section: ai-capabilities
slug: latent-diffusion-vae
navId: latent-diffusion-vae
title: Latent Diffusion Model & VAE
summary: The role of latent space and VAE.
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## What is a Latent Diffusion Model?

![](https://gyazo.com/22d5f654c3c598feb046cf71d4d8d4aa){gyazo=image}

The **Latent Diffusion Model** is one of the biggest innovations that allowed image generation AI to run on home PCs.

If you perform diffusion processing on ordinary images (pixels) as they are, the number of pixels is too large and the calculation becomes heavy.
Therefore, the image is first converted into a **compressed representation called "latent space" (latent)**, and noise is added or removed there.

As an example, Stable Diffusion 1.5 compresses a `512×512×3` image into a `64×64×4` "latent image" for handling.

Since the height and width become 1/8, the number of pixels is 1/64.
Thanks to "doing diffusion in a world with few pixels," image generation became possible at a realistic speed even at home!

---

## Why Process in Latent Space?

### 1. Saving Computational Cost and VRAM

When handling a 512×512 image, you have to calculate what color each of the 512×512 dots is.

With a compressed latent representation, it becomes 64×64, so the computational cost can be reduced significantly.

### 2. Processing with Meaningful Representations

In the latent space, high-level features such as "object shape," "texture," and "color tendency" are compressed rather than fine noise at the pixel level.

Also, latent representation is like "clay with unstable shape." Mixing pixel images together doesn't mean much, but combining them in the state of latent images can result in natural synthesis.

---

## What is VAE?

**VAE (Variational Autoencoder)** is a converter that converts images to latent space and back again.

- **Encoder**: Converts Image → Latent Image
- **Decoder**: Returns Latent Image → Image

The flow of generation is as follows:

- 1. The diffusion model starts from the noise of the latent image.
- 2. U-Net (the diffusion model itself) gradually reduces noise on the latent image.
- 3. Finally, convert "Latent Image → Ordinary Image" through the VAE Decoder.

When using an image as input, such as img2img or inpaint, convert the image to latent representation with the Encoder first, and then do the same.

---

## VAE is Lossy Compression

VAE is **lossy compression**.

Even if you convert an image to latent space and convert it back to an image, **it will not return completely to its original state**.
It may blur slightly, or the color and contrast may change.

![](https://gyazo.com/8741de326b196b666b2d0617502f3814){gyazo=image}

If you simply encode an image with VAE and decode it with the same VAE without using a diffusion model, you should see that it has deteriorated slightly.
This trade-off of "making it lighter to handle in exchange for slight deterioration" is a characteristic of latent representation.

---

## Which VAE Should I Use?

The latent representation used differs depending on the model, and the VAE for creating it is also different.

Basically, **you must use a VAE that matches the model.**

If you use the wrong VAE, you will get an image with strange colors or noise.
