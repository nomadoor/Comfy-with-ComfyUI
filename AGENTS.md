# AGENTS.md 窶・Comfy with ComfyUI (Docs) / Agent Principles

**Motto**  
> Small, clear, safe steps 窶・one source of truth in /ops (update /ops after every verbal change).

**Live directives trump docs**  
蜿｣鬆ｭ縺ｧ謖・､ｺ縺輔ｌ縺滉ｻ墓ｧ倥′譛蜆ｪ蜈医よ欠遉ｺ繧貞女縺代◆繧・`/ops` 繧貞叉蠎ｧ縺ｫ譖ｴ譁ｰ縺励√◎繧後°繧牙ｮ溯｣・☆繧九％縺ｨ縲・
---

## 1. Purpose
- 譛ｬ繝ｪ繝昴ず繝医Μ縺ｯ **ComfyUI 縺ｮ蜈･髢縲懷ｮ溯ｷｵ繝峨く繝･繝｡繝ｳ繝・*繧帝撕逧・し繧､繝医→縺励※謠蝉ｾ帙☆繧九・
- AI繧ｨ繝ｼ繧ｸ繧ｧ繝ｳ繝医・ **莠ｺ髢薙→蜷後§荳谺｡雉・侭**・・ops・峨ｒ蜿ら・縺励∝享謇九↑莉墓ｧ倩ｿｽ蜉繧定｡後ｏ縺ｪ縺・・

## 2. Scope / Non-Scope
**蜷ｫ繧**
- Eleventy(11ty) 縺ｫ繧医ｋ髱咏噪逕滓・・・A/EN縲ゞRL 縺ｯ `/<lang>/<section>/<slug>/`・・
- 縲後・繝ｼ繧ｸ・昴ち繧ｰ縲肴婿蠑擾ｼ医ち繧ｰID=窶懺沒ら函謌植I縺ｮ莉慕ｵ・∩縺ｨ蜃ｺ譚･繧九％縺ｨ窶晏・縺ｮ slug・・
- Workflow 險倅ｺ九・閾ｪ逕ｱ蠖｢蠑上る未騾｣ Workflow 縺ｯ **蜷後ち繧ｰ蜈ｨ莉ｶ繧ｫ繝ｼ繝芽｡ｨ遉ｺ**・医・繝ｼ繧ｸ繝阪・繧ｷ繝ｧ繝ｳ・・
- 險隱槫挨讀懃ｴ｢・・A竊谷A縺ｮ縺ｿ・拾N竊脱N縺ｮ縺ｿ・・
- JS 縺ｯ **ESM 髯仙ｮ・*縲√い繧､繧ｳ繝ｳ縺ｯ `currentColor` 驕狗畑縺ｮ SVG

**蜷ｫ縺ｾ縺ｪ縺・*
- 繧ｵ繝ｼ繝舌・繧ｵ繧､繝吋B縲・㍾縺ЙS繝輔Ξ繝ｼ繝繝ｯ繝ｼ繧ｯ縲∝ｸｸ譎ゅヨ繝ｩ繝・く繝ｳ繧ｰ
- 繝｢繝・け螟悶・螟ｧ謾ｹ騾・医ョ繧ｶ繧､繝ｳ繝医・繧ｯ繝ｳ螟悶・螟画峩・・

## 3. Ground Rules
- **UI/デザイン変更は必ず人間レビューアの許可を得てから。合意後は即コミットし、無断で追加変更しないこと。**


- 隕冗ｯ・・ **/ops 縺ｫ髮・ｴ・*縲ょｮ溯｣・燕縺ｫ /ops 繧呈峩譁ｰ・医さ繝ｼ繝牙・陦檎ｦ∵ｭ｢・・
- 螟画峩縺ｯ譛蟆上・蜿ｯ騾・よ尠譏ｧ縺輔・ **/ops 繧呈峩譁ｰ**縺励※隗｣豸・
- ID 縺ｯ險隱樣撼萓晏ｭ倥り｡ｨ遉ｺ縺ｨ繝ｪ繝ｳ繧ｯ縺ｧ險隱槫・譖ｿ
- 萓晏ｭ倥・譛蟆上∬ｻｽ驥繍S蜆ｪ蜈医よ悴鄙ｻ險ｳ繝ｻ譛ｪ貅門ｙ縺ｮ Workflow JSON 縺ｯ險ｱ螳ｹ

## 4. Information Architecture・郁ｦ∫ｴ・ｼ・- 蟾ｦ・壹し繧､繝峨ヰ繝ｼ・井ｸ企Κ縺ｫ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ繧ｿ繝悶√ち繝悶ｒ蛻・ｊ譖ｿ縺医ｋ縺ｨ隧ｲ蠖薙そ繧ｯ繧ｷ繝ｧ繝ｳ縺ｮ繝翫ン縺・繧ｫ繝ｩ繝縺ｧ陦ｨ遉ｺ縺輔ｌ繧具ｼ・- 荳ｭ・壽悽譁・ｼ・1逶ｴ荳九↓**繧ｿ繧ｰ繝√ャ繝・*・・
- 蜿ｳ・啜OC・・2/H3・・
- 縲後〒縺阪ｋ縺薙→縲・ 縲詣orkflow縲阪そ繧ｯ繧ｷ繝ｧ繝ｳ繝壹・繧ｸ荳矩Κ・・*蜷後ち繧ｰ縺ｮ 繧ｫ繝ｼ繝牙・莉ｶ**

## 5. Tagging・医・繝ｼ繧ｸ・昴ち繧ｰ・・
- 繧ｿ繧ｰID縺ｯ **險隱樣撼萓晏ｭ・slug**・遺懺沒ら函謌植I縺ｮ莉慕ｵ・∩縺ｨ蜃ｺ譚･繧九％縺ｨ窶晞・荳九・ slug・・
- 陦ｨ遉ｺ繝ｩ繝吶Ν繝ｻ繝ｪ繝ｳ繧ｯ縺ｯ **迴ｾ蝨ｨUI險隱・*縺ｧ隗｣豎ｺ・医Μ繝ｳ繧ｯ縺ｯ `/<lang>/ai-capabilities/<slug>/` 遲会ｼ・
- 1險倅ｺ九・繧ｿ繧ｰ荳企剞・・*5**

## 6. URL & Identity
- 蜈ｬ蠑酋RL・啻/<lang>/<section>/<slug>/`  
  - `lang` 窶ｦ `ja` / `en`  
  - `section` 窶ｦ `begin-with` / `ai-capabilities` / `basic-workflows` / `faq`・域圻螳夲ｼ・ 
  - `slug` 窶ｦ 險隱樣撼萓晏ｭ倥・闍ｱ隱・kebab
- **蜷御ｸ section 蜀・〒 slug 縺ｮ驥崎､・ｒ遖∵ｭ｢**・郁ｨ隱槫挨縺ｫ蜷後§ slug 縺ｯ蜿ｯ・・

- **謠蝉ｾ帙Δ繝・け**・医Ξ繧､繧｢繧ｦ繝医・驟崎牡繝ｻ菴咏區繝ｻ隗剃ｸｸ繝ｻ蠅・阜・峨ｒ譛蜆ｪ蜈医ゅ◆縺縺励ヴ繧ｯ繧ｻ繝ｫ蜊倅ｽ阪・荳閾ｴ縺ｯ荳崎ｦ√・峅蝗ｲ豌励→讒矩繧貞粋繧上○繧九・- src/assets/mock縺ｮ繝｢繝・け繧｢繝・・逕ｻ蜒上ｒ蜿り・↓縺吶ｋ
- 蛟､縺ｯ **/ops/style-design.md** 縺ｮ繝医・繧ｯ繝ｳ縺ｧ螳夂ｾｩ縲∝ｮ溯｣・・繝医・繧ｯ繝ｳ蜿ら・縺ｮ縺ｿ
- 蠖ｱ縺ｯ蜴溷援縺ｪ縺励・嚴螻､縺ｯ border + surface 蟾ｮ

## 8. ESM / Assets・域婿驥晢ｼ・
- 繝輔Ο繝ｳ繝・S縺ｯ **ESM 髯仙ｮ・*・・ommonJS 荳榊庄縲～type="module"`・・
- 繧｢繧､繧ｳ繝ｳ・啻src/assets/icons/*.svg`・・viewBox`蠢・医・`currentColor`・・

## 9. CI / Quality Gates・郁ｦ∵葎・・
- **sectionﾃ耀lug 縺ｮ荳諢乗ｧ**・郁ｨ隱樊ｨｪ譁ｭ縺ｧ蜷御ｸ section 蜀・・驥崎､・ｦ∵ｭ｢・・
- `nav.*.yml` 縺ｮ slug 螳溷惠
- tags[] 縺瑚ｨｱ蜿ｯ髮・粋縺ｫ蜷ｫ縺ｾ繧後ｋ繝ｻ荳企剞5雜・・隴ｦ蜻・
- 逕ｻ蜒・width/height 譛ｪ謖・ｮ夂紫縺ｮ隴ｦ蜻・

## 10. ADR Cadence・医＞縺､ADR繧呈嶌縺上°・・
**PR 蜑阪↓ ADR 繧定ｵｷ譯医＠謇ｿ隱榊ｾ後↓螳溯｣・*
- **IA 縺ｮ蛻晄悄螳夂ｾｩ・丞・驛ｨ蜃ｦ逅・・螟画峩**・・RL險ｭ險医√ち繧ｰ謚ｽ蜃ｺ縲∬ｨｱ蜿ｯ髮・粋縺ｮ豎ｺ繧∵婿・・
- 繧ｳ繝ｳ繝昴・繝阪Φ繝医・譁ｰ險ｭ繝ｻ遐ｴ螢顔噪螟画峩・医Λ繧､繝医・繝・け繧ｹ縲・・蟶・ヰ繝ｼ縲∵､懃ｴ｢UI・・
- 繝・じ繧､繝ｳ繝医・繧ｯ繝ｳ蜀榊ｮ夂ｾｩ・郁牡菴鍋ｳｻ繝ｻ菴咏區繧ｹ繧ｱ繝ｼ繝ｫ繝ｻ繧ｿ繧､繝晢ｼ・
- CI/蜩∬ｳｪ繧ｲ繝ｼ繝医・霑ｽ蜉繝ｻ髢ｾ蛟､螟画峩
- 讀懃ｴ｢譁ｹ蠑丞､画峩・医う繝ｳ繝・ャ繧ｯ繧ｹ莉墓ｧ倥・蟇ｾ雎｡遽・峇・・
- 騾ｱ谺｡縺ｮ蟆丞､画峩縺ｯ **Weekly rollup ADR** 繧定ｨｱ螳ｹ

## 11. MCP Agents・域怙蟆上Ν繝ｼ繝ｫ・・
- 隱ｭ縺ｿ蜿悶ｊ蜆ｪ蜈茨ｼ啻/ops`, `/src/_data`, `/src/layouts`
- 譖ｸ縺崎ｾｼ縺ｿ・・*`/src/**` 縺ｮ縺ｿ**・・/ops` 螟画峩縺ｯ PR 縺ｧ莠ｺ髢捺価隱搾ｼ・
- 1 PR = 1 諢丞峙・磯ｪｨ邨・∩・上せ繧ｿ繧､繝ｫ・乗､懃ｴ｢縺ｪ縺ｩ豺ｷ蝨ｨ遖∵ｭ｢・・
- 螳御ｺ・擅莉ｶ・咾I 邱托ｼ九Δ繝・け貅匁侠繧ｹ繧ｯ繧ｷ繝ｧ

## 12. Collaboration
- 隕冗ｯ・→螳溯｣・・荳堺ｸ閾ｴ縺ｯ螳溯｣・●豁｢ 竊・/ops 譖ｴ譁ｰ繧貞・謠先｡・
- 遒ｺ菫｡蠎ｦ < 80% 縺ｯ Issue 襍ｷ逾ｨ竊・ops 縺ｫ逍大撫繧定ｿｽ險倥＠蜷域э


**Rule:** In each command, **define → use**. Do **not** escape . Use generic 'path/to/file.ext'.

---

## 1) READ (UTF‑8 no BOM, line‑numbered)

r?

---

## 2) WRITE (UTF‑8 no BOM, atomic replace, backup)

nYOUR_TEXT_HERE
# Command Text Format

**Rule:** In each command, **define → use**. Do **not** escape `$`. Use generic 'path/to/file.ext'.

---

## 1) READ (UTF‑8 no BOM, line‑numbered)

```bash
bash -lc 'powershell -NoLogo -Command "
$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false);
Set-Location -LiteralPath (Convert-Path .);
function Get-Lines { param([string]$Path,[int]$Skip=0,[int]$First=40)
  $enc=[Text.UTF8Encoding]::new($false)
  $text=[IO.File]::ReadAllText($Path,$enc)
  if($text.Length -gt 0 -and $text[0] -eq [char]0xFEFF){ $text=$text.Substring(1) }
  $ls=$text -split "`r?`n"
  for($i=$Skip; $i -lt [Math]::Min($Skip+$First,$ls.Length); $i++){ "{0:D4}: {1}" -f ($i+1), $ls[$i] }
}
Get-Lines -Path "path/to/file.ext" -First 120 -Skip 0
"'
```

---

## 2) WRITE (UTF‑8 no BOM, atomic replace, backup)

```bash
bash -lc 'powershell -NoLogo -Command "
$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false);
Set-Location -LiteralPath (Convert-Path .);
function Write-Utf8NoBom { param([string]$Path,[string]$Content)
  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  $tmp = [IO.Path]::GetTempFileName()
  try {
    $enc = [Text.UTF8Encoding]::new($false)
    [IO.File]::WriteAllText($tmp,$Content,$enc)
    Move-Item $tmp $Path -Force
  }
  finally {
    if (Test-Path $tmp) {
      Remove-Item $tmp -Force -ErrorAction SilentlyContinue
    }
  }
}
$file = "path/to/your_file.ext"
$enc  = [Text.UTF8Encoding]::new($false)
$old  = (Test-Path $file) ? ([IO.File]::ReadAllText($file,$enc)) : ''
Write-Utf8NoBom -Path $file -Content ($old+"`nYOUR_TEXT_HERE`n")
"'
```
