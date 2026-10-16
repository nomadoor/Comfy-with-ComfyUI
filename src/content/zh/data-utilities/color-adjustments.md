---
layout: page.njk
lang: zh
section: data-utilities
slug: color-adjustments
navId: color-adjustments
title: "色调校正与特效"
created: 2026-02-06
updated: 2026-03-02
summary: "关于图像的亮度调整、模糊、特效"
seoTitle: "ComfyUI 色调校正与特效节点"
seoDescription: "ComfyUI 中调整图像亮度、颜色并添加特效的节点汇总：反相、锐化、模糊、减色、加噪、形态学变换，以及可进行专业调色的自定义节点。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/data-utilities/color-adjustments/legacy_gyazo_e1ecb574e0c11da63b0c6f8cee7a9f87.png"
---

## 色调校正与特效

把图像调亮、提高对比度、加上发光效果让画面更酷，这些对设计师和画师来说都是很熟悉的工序吧。

在图像生成中，有时会把这些功能当作“预处理”，把图像处理成 AI 好用的样子。

图像处理相关的自定义节点很多，也能做更高级的处理，但说实话，很多时候还是用自己用惯的绘图软件更省事。

**没有必要全部都在 ComfyUI 中完成。**

---

## 基本加工

### Invert image 节点

生成反转了 RGB 值的底片图像。

![](/media/data-utilities/color-adjustments/legacy_gyazo_79ea23575a35a9e8957853294e4f4e7e.png){media=image}

[](/workflows/data-utilities/color-adjustments/invert_image.json)


### Image Sharpen 节点

让轮廓变得清晰。

![](/media/data-utilities/color-adjustments/legacy_gyazo_0296ddc8958f0b0ee358afbdd449424b.png){media=image}

[](/workflows/data-utilities/color-adjustments/imagesharpen.json)


### Image Blur 节点

让图像变模糊。

![](/media/data-utilities/color-adjustments/legacy_gyazo_b3ae153b9b69063b83e3fb1eeb9bd335.png){media=image}

[](/workflows/data-utilities/color-adjustments/imageblur.json)


### Image Quantize 节点

减少颜色数量（色调分离）。

![](/media/data-utilities/color-adjustments/legacy_gyazo_08652b0b1815b616f8e644ed9067c56a.png){media=image}

[](/workflows/data-utilities/color-adjustments/imagequantize.json)


### ImageAddNoise 节点

向图像添加噪点。

![](/media/data-utilities/color-adjustments/legacy_gyazo_e57bf28e9d62134222cce8daaab0079e.png){media=image}

[](/workflows/data-utilities/color-adjustments/imageaddnoise.json)

有点小众：做 image2image 时，有一种技巧是故意加上噪点，这样即使 denoise 设得较低也能增加细节。

cf. [向像素图像添加噪点，在低 denoise 的 image2image 中增加细节](https://scrapbox.io/work4ai/%E3%83%94%E3%82%AF%E3%82%BB%E3%83%AB%E7%94%BB%E5%83%8F%E3%81%AB%E3%83%8E%E3%82%A4%E3%82%BA%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%97%E3%81%A6%E3%80%81%E4%BD%8Edenoise%E3%81%A7%E3%81%AEimage2image%E3%81%AE%E3%83%87%E3%82%A3%E3%83%86%E3%83%BC%E3%83%AB%E3%82%92%E5%A2%97%E3%82%84%E3%81%99)

---

## 形态学变换 (Morphology)

这个词可能有点陌生，它主要用于处理黑白蒙版图像。
可以做“加粗线条（膨胀）”“去除噪点（腐蚀）”这类处理。

![](/media/data-utilities/color-adjustments/legacy_gyazo_db828b756ce851d763f9589b267f6002.png){media=image}

[](/workflows/data-utilities/color-adjustments/imagemorphology.json)


cf. [OpenCV-Python/形态学变换](https://labs.eecs.tottori-u.ac.jp/sd/Member/oyamada/OpenCV/html/py_tutorials/py_imgproc/py_morphological_ops/py_morphological_ops.html#id5)

---

## 专业的色调校正（自定义节点）

能加入 Photoshop 那样更实用的图像编辑功能的自定义节点，多得数不过来。
这里介绍其中一个基本功能齐全、又简单好用的。

### ComfyUI-Image-Effects

- **[orion4d/ComfyUI-Image-Effects](https://github.com/orion4d/ComfyUI-Image-Effects)**

![](/media/data-utilities/color-adjustments/legacy_gyazo_e1ecb574e0c11da63b0c6f8cee7a9f87.png){media=image}

色相、饱和度、亮度的调整（HSV 调整），或者类似色调曲线的调整，以及各种滤镜等，人想手动调整的功能，大多都包含在内。
详细的功能列表请查看仓库的文档。
