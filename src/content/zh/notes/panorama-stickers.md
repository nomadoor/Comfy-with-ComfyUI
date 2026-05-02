---
layout: page.njk
lang: zh
slug: panorama-stickers
section: notes
navId: panorama-stickers
title: "ComfyUI Panorama Stickers"
created: 2026-03-02
updated: 2026-03-22
noteTags: ["project", "erp", "lora", "flux"]
summary: "用于在 ERP 上贴参考图像，并用 outpaint 补完剩余区域的专用 UI"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/0732762b1efdf916b6a5836a9078e90e.png"
---

## ComfyUI Panorama Stickers

![](https://gyazo.com/748e50cd59976f45acabd7cf39d45bc6){gyazo=player}

这是一个专用于 **FLUX.2 Klein 4B/9B 360 ERP Outpaint LoRA** 的 UI，可以根据参考图像制作 360 度全景图像。

这个 LoRA 的基本思路是 outpainting。  
把全景图展开成矩形后的图像，叫做 **ERP**（equirectangular panorama，等距柱状全景），而这里的思路就是把任意图像贴到空白 ERP 上，再把剩余部分 outpaint 掉，这样就能做出全景图像。

不过，只是把图像贴到矩形上，并不会让它自然地看起来像 ERP。  
ERP 本身是把全景展开后的形式，所以不同位置的畸变方式会变化。另外，一边看着 ERP 一边去想象“完成后的全景”，再制作 control 图像，作为 UX 来说并不理想。

这个自定义节点

- **可以让你进入全景内部，**
- **按照真的在看风景时的感觉去摆放参考图像，**
- **并把结果输出为 ERP。**

这样一来，制作 control 图像就会轻松很多。  
再让 FLUX.2 Klein 直接编辑输出的 ERP，全景图像就完成了。

---

## 节点构成

这个自定义节点由 4 个节点组成。

- `Panorama Stickers`：在 ERP 画布上放置图像
- `Panorama Cutout`：从全景内切出任意视角（相当于拍摄）
- `Panorama Preview`：在节点上进行预览
- `Panorama Seam Prep`：整理左右边缘的接缝

---

## 安装

[nomadoor/ComfyUI-Panorama-Stickers](https://github.com/nomadoor/ComfyUI-Panorama-Stickers/tree/main)

- 请通过 `ComfyUI Manager` 安装。

---

## 画布的基本操作

为了在 Legacy / Node2.0 两边都保持稳定运行，基本上是以专用的模态 UI 作为主要操作方式。

> 只有 `Panorama Preview` 也可以在节点上预览，不过操作还是以前提使用模态 UI 为主。

{% mediaRow img="https://gyazo.com/fc789c1056b38005c59d1e5be6c3095d{gyazo=loop}", width=60, align="left" %}

**打开模态 UI**

- 点击 `Open Stickers Editor` 按钮（`Cutout` / `Preview` 也是一样）

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/18d7795a35504cf58fe4813ed364a00e{gyazo=loop}", width=60, align="left" %}

**视角移动 / 缩放**

- 左键拖动 / 中键拖动来移动视角
- 用鼠标滚轮修改 FOV（放大 / 缩小）

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/02163c2018590f8b022623f9e711878d{gyazo=loop}", width=60, align="left" %}

**右下按钮**

- 重置视角
- 切换引导线显示

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ec0a8aaafab38c71dd23bdb075f224d5{gyazo=loop}", width=60, align="left" %}

**切换绘制方式**

- 用左上角的切换按钮在 `Panorama` / `ERP`（展开）之间切换

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/0873609554f60abe700f435144d23936{gyazo=loop}", width=60, align="left" %}

**拖动方向**

- 在 Inspector 的 `UI Setting` → `Inverted` 中反转

{% endmediaRow %}


## Panorama Stickers

这是一个用于把参考图像放到 ERP 画布上的 Editor。

{% mediaRow img="https://gyazo.com/217f50a8bb037ca6c10ce55cd230bf8d{gyazo=loop}", width=60, align="left" %}

**添加图像**

- 用 `+ Image` 按钮添加，或者直接拖放添加
- 刚添加后会放在当前视角中心附近

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e9907e0255952679f448d7796dd9d719{gyazo=loop}", width=60, align="left" %}

**移动 / 缩放 / 旋转图像**

- 拖动图像即可移动
- 选中图像后会出现控制柄，可以拖动各个点来变形
  - 按住 `Shift` 旋转时，会以 45 度为单位旋转
- 也可以在 Inspector 的滑块里调整

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e7ca94b114093b218c82a333761021a3{gyazo=loop}", width=60, align="left" %}

**层级 / 复制**

- 选中图像后，图像下方会显示 UI
- 可以用按钮移动到最前面或最后面
- 也可以用复制按钮添加同一张图像

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/6080f7006f8dfdfcd1e15fd30a394e50{gyazo=loop}", width=60, align="left" %}

**删除图像**

- 可以用图像下方的删除按钮，或者按 `Delete` 键
- 也可以用画布底部的 `Clear all` 按钮全部删除

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ba80aed93898c33f2f2588f7245723eb{gyazo=loop}", width=60, align="left" %}

**从 Inspector 选择图像**

- 在 Inspector 的 `Image` 中选择图像后，视角会移动，让那张图像来到中心

{% endmediaRow %}


## Panorama Cutout

这是一个可以进入全景内部，并像相机拍摄一样切出任意视角的 Editor。

{% mediaRow img="https://gyazo.com/e7e7075770cd2693e94334bf09743fac{gyazo=loop}", width=60, align="left" %}

**添加 frame**

- 用底部的 `+ Add frame` 添加
- 右上角会显示预览

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/033ef3fd91b9bb4cc283906ae53b7269{gyazo=loop}", width=60, align="left" %}

**移动 / 缩放 / 旋转 frame**

- 基本和 `Panorama Stickers` 一样
- 还可以通过拖动边缘来改变纵横比

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/da133d6d6fc2c17e7f4a59f716b92fec{gyazo=loop}", width=60, align="left" %}

**切换到预设纵横比**

- 在选中 frame 时显示的 UI 里，可以选择 `1:1`、`3:2` 等比例
- 旁边的 `Rotate 90°` 可以切换横竖方向

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a6d69406f8888c84cbbdcbd42a184107{gyazo=loop}", width=60, align="left" %}

**移动视角到 frame 位置**

- 用底部 UI 的 `📷` 按钮，就可以把视角移动到该 frame 位置

{% endmediaRow %}


## Panorama Preview

这是一个可以直接在节点上查看预览的节点。模态 UI 和其他节点共用，不过功能做了精简。

{% mediaRow img="https://gyazo.com/fe09e529eea57ebf960f97b0d7720514{gyazo=loop}", width=60, align="left" %}

**节点上预览**

- 基本上可以像模态 UI 那样，通过拖动和鼠标滚轮来操作

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/c98e12d762e11fb8922ffa3991912d6b{gyazo=image}", width=60, align="left" %}

**全屏显示**

- 用右下按钮可以切换到全屏显示
- 用 `Esc` 退出

{% endmediaRow %}


## Panorama Seam Prep

无论学习得多好，全景图像左右两端（seam）要做到完全一致，还是很难。  
这个节点是在把图像平移，让接缝来到图像中心后，再对这条接缝做 inpainting 后处理时使用的。

![](https://gyazo.com/09deac88400d8e8d1f9301eda07c7b13){gyazo=image}

[](/workflows/notes/panorama-stickers/PanoramaSeamPrep.json)

- `seam_width_px`：指定遮罩宽度
- `seam_center_offset_px`：让边界从中心位置偏移
- `mask_blur_px`：模糊遮罩两端
  - 在把 inpainting 的结果合成回原图时使用

---

## workflow

下面实际使用这个 LoRA，试着根据参考图像做一个 ERP 全景。

> 这是已知问题，Distilled 模型上这个 LoRA 几乎不起作用。现在还在找对策，所以目前请以 base model 为前提使用。

### 模型的下载

- diffusion_models

  - [flux-2-klein-base-9b-fp8.safetensors](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-9b-fp8/blob/main/flux-2-klein-base-9b-fp8.safetensors)
  - [flux-2-klein-base-4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-base-4b.safetensors)

- loras

  - [flux-2-klein-9B-360-erp-outpaint-lora_V1.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-360-erp-outpaint-lora/blob/main/flux-2-klein-9B-360-erp-outpaint-lora_V1.safetensors)
  - [flux-2-klein-4B-360-erp-outpaint-lora_V1.safetensors](https://huggingface.co/nomadoor/flux-2-klein-4B-360-erp-outpaint-lora/blob/main/flux-2-klein-4B-360-erp-outpaint-lora_V1.safetensors)

- text_encoders

  - [qwen_3_8b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/text_encoders/qwen_3_8b.safetensors)
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/text_encoders/qwen_3_4b.safetensors)

- vae

  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-base-9b-fp8.safetensors
    │   └── flux-2-klein-base-4b.safetensors
    ├── 📂loras/
    │   ├── flux-2-klein-9B-360-erp-outpaint-lora_V1.safetensors
    │   └── flux-2-klein-4B-360-erp-outpaint-lora_V1.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_3_8b.safetensors
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

### flux-2-klein-9B-360-erp-outpaint

![](https://gyazo.com/fc52e8eca49723f6ca9fd426abadc636){gyazo=image}
[](/workflows/notes/panorama-stickers/flux-2-klein-9B-360-erp-outpaint.json)

- 用 `Panorama Stickers` 放置参考图像，先做出 ERP
- 提示词用“触发词 + 一点补充”就可以

```text
Fill the green spaces according to the image. Outpaint as a seamless 360 equirectangular panorama (2:1). Keep the horizon level. Match left and right edges.
```

> 生成出来的是 ERP（2:1）图像。直接看会不太直观，所以请用 `Panorama Preview` 或 `Panorama Cutout` 来确认或截取视角。

### flux-2-klein-4B-360-erp-outpaint

![](https://gyazo.com/fa6b005b1c0389c38728310e5b7a3085){gyazo=image}
[](/workflows/notes/panorama-stickers/flux-2-klein-4B-360-erp-outpaint.json)
