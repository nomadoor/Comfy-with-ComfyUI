---
layout: page.njk
lang: ja
section: basic-workflows
slug: reactor
navId: reactor
title: "ReActor"
summary: "FaceSwapする技術"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
tags: ["id-transfer"]
---

## ReActorとは？

[face swap](顔の入れ替え)は[deepfake]として何年も前から存在しますが、当時は同じ人間の顔が何百枚と必要でした

ReActor(というかそのコアであるInsightFace)は、1枚の顔写真だけで、別の画像や動画に映っている顔を差し替えられます。

現在では拡散モデルをベースにした、より柔軟性の高いID転送手段がありますが、軽量さ、そして逆にReActorの柔軟性の無さによる安定感により、未だによく使われている技術です。


## カスタムノード

- [Gourieff/ComfyUI-ReActor](https://github.com/Gourieff/ComfyUI-ReActor?tab=readme-ov-file#installation)

### インストール方法

このノードは少し厄介で、ComfyUI Managerからインストールするだけでは使えません。

- 1. ComfyUI Managerからインストール
- 2. 以下の場所にある `install.bat` をクリック
  -  ```text
      📂ComfyUI/
        └── 📂custom_nodes/
            └── install.bat
    ```
- 3. Windowsの方は多分失敗するのでInsightFaceのインストールをします
  - 1. [ComfyUI]で使われている[Python]のバージョンを確認する
 $ cd path\to\ComfyUI_windows_portable
 $ python_embeded\python.exe -V
 たぶん3.11
2. それぞれのバージョンに対応する[InsightFace]のパッケージをダウンロード (直リンク)
　3.10
　 https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp310-cp310-win_amd64.whl
　3.11
　 https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp311-cp311-win_amd64.whl
　3.12
　 https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp312-cp312-win_amd64.whl
　3.13
　	https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp313-cp313-win_amd64.whl
　以下の場所に置きます
　　$ path\to\ComfyUI_windows_portable
3. pipのアップデート
　$ python_embeded\python.exe -m pip install -U pip
4. InsightFaceのインストール
　3.10
　 $ python_embeded\python.exe -m pip install insightface-0.7.3-cp310-cp310-win_amd64.whl
　3.11
　 $ python_embeded\python.exe -m pip install insightface-0.7.3-cp311-cp311-win_amd64.whl
　3.12
　 $ python_embeded\python.exe -m pip install insightface-0.7.3-cp312-cp312-win_amd64.whl
　3.13
　 $ python_embeded\python.exe -m pip install insightface-0.7.3-cp313-cp313-win_amd64.whl
- 4. 再起動

## FaceSwap (insightface)


## 別のFaceSwapモデルを使う

insightfaceは