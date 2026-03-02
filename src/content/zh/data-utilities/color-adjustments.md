---
layout: page.njk
lang: zh
section: data-utilities
slug: color-adjustments
navId: color-adjustments
title: "色调校正与特效"
summary: "关于图像的亮度调整、模糊、特效"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/e1ecb574e0c11da63b0c6f8cee7a9f87.png"
---

## 色调校正与特效

让画像变亮、提高对比度、添加发光效果让画面更帅气，这对于设计师和画师来说是熟悉的工序。

在图像生成中，有时也会使用这些功能作为“预处理”，将图像调整为 AI 易于处理的状态。

虽然有很多关于图像处理的自定义节点，也能进行更高级的处理，但老实说，在很多场合下，使用习惯的绘图工具会觉得更轻松。

**没有必要全部都在 ComfyUI 中完成。**

---

## 基本加工

### Invert image 节点

生成反转了 RGB 值的底片图像。

![](https://gyazo.com/79ea23575a35a9e8957853294e4f4e7e){gyazo=image}

[](/workflows/data-utilities/color-adjustments/Invert_Image.json)


### Image Sharpen 节点

让轮廓变得清晰。

![](https://gyazo.com/0296ddc8958f0b0ee358afbdd449424b){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageSharpen.json)


### Image Blur 节点

模糊图像。

![](https://gyazo.com/b3ae153b9b69063b83e3fb1eeb9bd335){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageBlur.json)


### Image Quantize 节点

减少颜色数量（色调分离）。

![](https://gyazo.com/08652b0b1815b616f8e644ed9067c56a){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageQuantize.json)


### ImageAddNoise 节点

向图像添加噪点。

![](https://gyazo.com/e57bf28e9d62134222cce8daaab0079e){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageAddNoise.json)

稍微有点小众，但在进行 image2image 时，有一种技巧是特意添加噪点，从而在低 denoise 设置下增加细节。

cf. [向像素图像添加噪点，在低 denoise 的 image2image 中增加细节](https://scrapbox.io/work4ai/%E3%83%94%E3%82%AF%E3%82%BB%E3%83%AB%E7%94%BB%E5%83%8F%E3%81%AB%E3%83%8E%E3%82%A4%E3%82%BA%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%97%E3%81%A6%E3%80%81%E4%BD%8Edenoise%E3%81%A7%E3%81%AEimage2image%E3%81%AE%E3%83%87%E3%82%A3%E3%83%86%E3%83%BC%E3%83%AB%E3%82%92%E5%A2%97%E3%82%84%E3%81%99)

---

## 形态学转换 (Morphology)

可能不太熟悉这个词，主要是针对黑白蒙版图像进行处理。
可以进行“加粗线条（膨胀）”、“去除噪点（收缩）”等处理。

![](https://gyazo.com/db828b756ce851d763f9589b267f6002){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageMorphology.json)


cf. [OpenCV-Python/形态学转换](https://labs.eecs.tottori-u.ac.jp/sd/Member/oyamada/OpenCV/html/py_tutorials/py_imgproc/py_morphological_ops/py_morphological_ops.html#id5)

---

## 专业的色调校正（自定义节点）

像 Photoshop 那样，添加更实用的图像编辑功能的自定义节点多如繁星。
其中，我推荐一个涵盖了基本功能，并且简单易用的。

### ComfyUI-Image-Effects

- **[orion4d/ComfyUI-Image-Effects](https://github.com/orion4d/ComfyUI-Image-Effects)**

![](https://i.gyazo.com/e1ecb574e0c11da63b0c6f8cee7a9f87.png){gyazo=image}

色相、饱和度、亮度的调整（HSV 调整），或者类似色调曲线的调整，以及各种滤镜等，只要是人类想要调整的功能，大多都包含在内。
详细的功能列表请查看仓库的文档。
