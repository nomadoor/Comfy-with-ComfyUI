---
layout: page.njk
lang: en
section: notes
slug: seed-neighbor
navId: seed-neighbor
title: "Seed 1234 and 1235 are completely different"
created: 2026-02-11
updated: 2026-03-02
noteTags: ["concept", "seed"]
summary: "A nearby seed value does not mean a nearby result"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/9cc7e9a5752b2a65f4e8a76972b9b366.png"
---

## Seed 1234 and 1235 are completely different

You have probably seen this already: if you change the seed, the generated image also changes.

![](https://gyazo.com/69110725afae49631e11fff491cf6596){gyazo=image}

Now try generating with `seed=1234`, then run it again with `seed=1235`.  
Because the numbers are close, you might expect similar images, but the output is completely different.

Why does this happen?

---

## Relationship between noise and generated images

Diffusion models create images by starting from noise and gradually removing that noise.  
(See [Diffusion Models](/en/ai-capabilities/diffusion-models/) for details.)

So if the initial noise is different, the final image is naturally different as well.

---

## Relationship between noise and seed values

In text2image, noise must be created first.  
Random numbers are used when generating that noise.

The seed is the number that determines how those random numbers are initialized.

### A seed is the number that initializes random generation

Computers do not generate truly random numbers; they use a pseudo-random number generator (PRNG).

You might think "if seeds are close, random sequences should also be close." But that is not how it works.

- `1234` and `1235` look close to us because they differ by 1
- For a PRNG, they are different initialization inputs, and the generated random sequences are basically unrelated

A simple analogy: page 1234 and page 1235 in a dictionary are adjacent, but there is no guarantee the words on those pages are similar.

---

## Then how do you make similar images?

Now we know that seed proximity is not related to output similarity.  
So if `seed=1234` gives you a great image, how can you make similar variations?

### 1. Use image2image

This is the simplest method.

Use the generated image as input, then set a low `denoise` value to create a slightly changed result.

### 2. Blend noise

The idea is straightforward.

![](https://gyazo.com/313224ede32c9b07ac81fad2c1bc3a71){gyazo=image}

- 1. Create noise A with `seed_A`
- 2. Create noise B with `seed_B`
- 3. Use A as the base and blend in a small amount of B

By changing `seed_B` or the blend amount, you can produce small variations.

### 3. Inject noise

Another way is to add a small noise latent to the base latent.

![](https://gyazo.com/3330b48b010177e127ceb014a3da882f){gyazo=image}

- 1. Create noise A with `seed_A`
- 2. Add a small noise latent from another random value, with a coefficient like `0.01`

Because this injects noise, the total noise amount increases.

A small increase is usually fine, but if `strength` is set to `1.0` or `2.0`, the sampler may fail to denoise properly and output mostly noisy images.

## workflow

In a normal workflow, noise generation and injection are handled internally by `KSampler`.
In these techniques, you create and modify noise (latent) before feeding it into `KSampler`.

This is a bit more irregular for ComfyUI, so in many cases plain image2image may be the simpler option.

### Blend noise

![](https://gyazo.com/eee2f089f7ecf7f9b6541cf2f570266a){gyazo=image}

[](/workflows/notes/seed-neighbor/Latent_Blend.json)

- 🟩 With `Generate Noise` + `KSampler (Advanced)` (`add_noise=disable`), you can create noise outside the sampler.
- 🟪 This `Generate Noise` node creates the second noise (latent) to blend in.
- 🟨 Use `Latent Blend` to mix the two latents.
  - At `blend_factor=1.0`, you get only samples1; at `blend_factor=0.0`, only samples2.

### Inject noise

![](https://gyazo.com/a5162437aa43b07806a802d301a5df9d){gyazo=image}

[](/workflows/notes/seed-neighbor/Inject_Noise_To_Latent.json)

- 🟨 Increase `strength` in `Inject Noise To Latent` gradually to add a second noise into the base latent.
  - Raising `mix_randn_amount` adds yet another random component, but here it is kept at `0`.
