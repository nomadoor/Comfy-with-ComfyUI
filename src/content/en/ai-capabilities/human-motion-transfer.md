---
layout: page.njk
lang: en
section: ai-capabilities
slug: human-motion-transfer
navId: human-motion-transfer
title: "Human Motion Transfer"
summary: "Techniques for transferring a source person's movements to a target character or video."
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## What is Human Motion Transfer?

Human motion transfer applies the pose and movement from a source person to a different target character or subject. It is useful for puppet-style animation, reenactment, and stabilizing motion between takes.

---

## Typical Approaches

- Pose/keypoint based pipelines (e.g., OpenPose → motion-aware models)
- Video-to-video diffusion models that condition on optical flow or keyframes
- Tracking + depth/segmentation to keep the target identity stable

---

## Workflows

- [](/workflows/ai-capabilities/human-motion-transfer/MimicMotion.json)
