---
layout: page.njk
lang: en
section: notes
slug: error-handling
navId: error-handling
title: "What to do when an error occurs"
created: 2025-12-13
updated: 2026-03-02
noteTags: ["troubleshoot", "error"]
summary: "A checklist for when you hit an error"
seoTitle: "What to Do When ComfyUI Shows an Error"
seoDescription: "A checklist for ComfyUI errors: where to look on screen and in the terminal, how to read and search error messages, and what to check before an issue."
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## What to do when an error occurs

You start ComfyUI... you run a workflow... and up pops an error. It happens all the time.
Don't panic. First, just get a handle on where to look.

Errors basically show up in two places, with the same content:

- On the ComfyUI screen (red error window)
- In the terminal window ComfyUI was launched from (text log)

The error window disappears when you press Close, but the same content stays in the terminal.
Even if you close it in a hurry, you can scroll back through the terminal later and find the same error.

---

## Where to look in the error message

For errors during a run, start with the first two lines of the error message.

- `Error occurred when executing KSampler:`
  → Which node the error happened in
- `mat1 and mat2 shapes cannot be multiplied (154x2048 and 768x320)`
  → Why it failed (shape / channel / dtype, etc.)

Search for these two lines and you can usually track down the cause.

---

## How to investigate errors

- **Google Search**
  - Just pasting the error message as-is often turns up forum threads and GitHub issues.

- **Ask ChatGPT or Gemini**
  - They're pretty smart these days and will usually have an answer. But ComfyUI changes often, so don't trust them blindly.
  - If they suggest things like "Let's install this Python library" or "Let's delete this and reinstall it," stop for a moment.
  - Following those steps carelessly can end up breaking your environment instead.

- **Search issues in the related GitHub repositories**
  - Check whether the same error has come up in the ComfyUI repo or the repo of each custom node.
  - Remove the `is:open` that's in the search bar by default so closed issues are included too, and you'll find a lot more.

- **If you still can't figure it out, ask somewhere**
  - Try asking on Twitter / X, Reddit, and so on.
  - The work4ai community I'm part of also has a Marshmallow (anonymous question box), so feel free to send your question there if you'd rather ask anonymously.
    - [Marshmallow/work4ai](https://marshmallow-qa.com/gbyrz1zwnewy7gj?t=2ACPWh&utm_medium=url_text&utm_source=promotion)
  - Here too, the key things to include are which node failed and what the error message said.

---

## Last resort: Before writing an issue

If nothing else works, the next step is opening an issue on the GitHub repo for ComfyUI or the custom node.

But unless you're confident it's really a bug, please avoid posting one if at all possible.
Otherwise, the problems that genuinely need fixing get buried.

First, try narrowing down the cause yourself by following the steps on this page.
