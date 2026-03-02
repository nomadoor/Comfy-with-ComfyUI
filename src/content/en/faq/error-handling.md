---
layout: page.njk
lang: en
section: faq
slug: error-handling
navId: error-handling
title: "What to do when an error occurs"
summary: "Checklist for troubleshooting errors"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What to do when an error occurs

When you start ComfyUI... or when you execute a workflow... seeing an error screen is an everyday occurrence.
Don't panic, just keep in mind "where to look" first.

Basically, errors are displayed in the following two places with the same content.

- On the ComfyUI screen (red error window)
- In the launched terminal window (text log)

The error window on the screen disappears when you press Close, but the content remains in the terminal.
Even if you close it in a hurry, you can check the same error message by scrolling through the terminal later.

---

## Where to look in the error message

The first thing to look at for runtime errors is the first two lines of the error message.

- `Error occurred when executing KSampler:`
  → Which node the error is occurring in
- `mat1 and mat2 shapes cannot be multiplied (154x2048 and 768x320)`
  → What is causing the failure (shape / channel / dtype etc.)

If you keysearch these two lines, you can usually reach the cause.

---

## How to investigate errors

- **Google Search**
  - Often, just pasting the error message directly will hit overseas forums and GitHub issues.

- **Ask ChatGPT or Gemini**
  - Recently they are quite smart, so they will answer with a high probability. However, ComfyUI information changes frequently, so do not place absolute trust in them.
  - If suggestions like "Let's install this Python library" or "Let's delete this and reinstall it" come up, stop once.
  - If you proceed exactly as told, you might destroy your environment instead.

- **Search related GitHub repository issues**
  - Check if there is the same error in the ComfyUI main repo and each custom node repo.
  - If you remove `is:open` which is attached to the search bar from the beginning and search including resolved issues, the hit rate will increase.

- **If you still don't know, ask somewhere**
  - Try asking on Twitter / X, reddit, etc.
  - There is also a Marshmallow for the work4ai community I participate in, so it's okay to throw it here if you want to ask anonymously.
    - [Marshmallow/work4ai](https://marshmallow-qa.com/gbyrz1zwnewy7gj?t=2ACPWh&utm_medium=url_text&utm_source=promotion)
  - Even then, the two points "which node" and "what error message" are important.

---

## Last resort: Before writing an issue

If it still doesn't solve, you will have to create an issue on ComfyUI main or custom node GitHub.

However, please do not post as much as possible except for cases where you can be sure it is really a bug.
Issues that really need to be fixed will be buried.

First, please try to isolate the cause yourself according to the procedure on this page.
