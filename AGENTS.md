AGENTS.md — Comfy with ComfyUI (Docs) / Agent Principles
Motto

Small, clear, safe steps — and one source of truth in /ops.
Any verbal agreement must be reflected in /ops immediately.

Live Directives Trump Docs

If there is a conflict between an older document and a newer verbal / written directive from the owner, the newer directive wins.
Once a decision is made, you must update /ops so that the docs stop drifting from reality.

1. Purpose

Provide a systematic, reproducible documentation set for ComfyUI and its workflows.

Treat /ops as the single source of truth for IA, writing rules, design tokens, and contribution rules.

Keep the implementation (11ty, layouts, components, content) aligned with /ops at all times.

2. Scope / Non-Scope
In Scope

The documentation site built with Eleventy (11ty).
Canonical URL pattern: /<lang>/<section>/<slug>/.

IA structure (sections, page types, navigation) as defined in /ops.

Content and examples for:

Local ComfyUI setup and usage.

AI capabilities (models, depth, video, etc.).

Basic and advanced workflows with JSON examples.

Design system and UI behavior as defined in:

/ops/style-design.md (visual / layout tokens)

/ops/style-writing.md (writing rules, headings, examples)

JavaScript written as ES Modules only.
SVG icons that inherit currentColor.

Out of Scope

Maintaining external project-management tools (Notion, Scrapbox, etc.).

Supporting legacy themes, deprecated UI, or third-party skins that are not aligned with /ops.

“Random experiments” that are not tied to a concrete doc or ADR.

3. Ground Rules

No silent UX / UI changes.
Any UI or design change must be:

Proposed and agreed with the human owner.

Implemented as a focused change (branch + PR).

Not extended or “improved” further without explicit agreement.

/ops first.

If you change behavior, IA, naming, or conventions, you start by updating /ops.

Code and content are then updated to match /ops.

Persistent IDs.

IDs, slugs, and major URLs must be stable.

Renames require an ADR and nav updates, not ad-hoc edits.

Reproducible workflows only.

Workflow JSONs must be complete enough for a third party to reproduce results.

4. Information Architecture & Writing

The detailed rules for IA (headings, page templates, narrative structure, examples, etc.) are not duplicated here.

Canonical reference: /ops/style-writing.md

IA and writing decisions are made there; this file only enforces that those rules are treated as binding.

Do not invent your own heading patterns or page layouts: always follow /ops/style-writing.md.

5. Tagging

Every page must have tags that are:

Consistent with its slug and topic.

Specific but not spammy.

AI-capability pages under /<lang>/ai-capabilities/<slug>/ must have tags that describe:

Task (e.g., depth, video, controlnet)

Modality (e.g., image, video, 3d)

Maximum 5 tags per page.
More than 5 is a signal that the scope is too broad.

6. URL & Identity

Canonical URL format

/<lang>/<section>/<slug>/

lang ∈ { ja, en }

section ∈ { begin-with, ai-capabilities, basic-workflows, faq }

slug is a kebab-case, permanent identifier

Slug rules

No duplicate (section, slug) pairs across the site.

No “temporary” slugs; treat slugs as stable IDs.

Slug changes require: nav update + ADR.

Assets

Mockups and illustrations live under src/assets/mock/ or other agreed subfolders.

All visual tokens (colors, radii, shadows, spacing) are defined in /ops/style-design.md.

7. Design Tokens & Assets

Colors, typography, border radii, spacing, and shadows are defined in /ops/style-design.md.

Any change to design tokens:

Must be proposed in /ops/style-design.md first.

Then implemented in CSS / utility classes.

Layout / component variations must align with:

Existing token names.

Previously agreed responsive behavior.

8. JS / ESM

All JavaScript is written as ESM:

No new CommonJS modules.

Use "type": "module" where appropriate.

Icons:

Stored in src/assets/icons/*.svg.

Must define a viewBox.

Must use fill="currentColor" or inherit currentColor.

9. CI / Quality Gates

Before merging any PR:

section + slug uniqueness is preserved.

nav.*.yml slugs match the actual file structure and IA.

Each page:

Has ≤ 5 tags.

Uses the correct section and template as per /ops.

All images:

Have explicit width and height.

Use appropriate formats and sizes (no unbounded raw dumps).

If these gates cannot be satisfied, the PR is not ready.

10. ADR Cadence

Any change that affects IA, URL structure, or design system requires an ADR.

ADR is required when:

Changing IA (sections, page types, navigation patterns).

Introducing or removing major components or layouts.

Changing authoring rules in /ops/style-writing.md.

Modifying CI / quality criteria.

Minor changes can be batched into a weekly rollup ADR, but must still be documented.

11. MCP & Tool Usage

The goal is to use MCP servers aggressively and intelligently, not to restrict them.

At startup or on first use, an agent should:

Enumerate available MCP servers and their capabilities.

Cache or summarize what each MCP can do (file access, search, browsing, etc.).

When performing tasks (e.g., reading/writing files, searching, formatting), the agent should:

Prefer MCP tools over custom shell commands whenever they are safer and more structured.

Use the most specialized MCP for each job (e.g., “code edit MCP” for code, “docs MCP” for ops files).

If a task can be expressed as:

“Read/Write a project file”

“Search in docs”

“Format / lint content”

then the agent should attempt to route it through MCP first, falling back to raw shell only when strictly necessary.

Agents must not ignore available MCPs. Discover them and use them to the maximum extent compatible with safety and clarity.

12. Collaboration & Git Workflow
12.1 General Collaboration

Verbal agreement → /ops update → implementation → PR → review → merge.

If the spec in /ops is ambiguous:

Open an Issue.

Propose a clarification in /ops before pushing large changes.

12.2 New Feature Rule (Commit / Branch Before Work)

Before implementing any new feature on your own initiative:

Do not work directly on main (or the primary trunk) without structure.

Instead, you must:

Create a dedicated feature branch that clearly states the intent in its name, and

Commit at least a minimal, explicit change that:

Updates /ops with the planned feature, or

Adds a small, reversible scaffold (e.g., empty layout, stub page, or TODO section).

The idea is:

“First record the intent in Git, then expand it.”

This makes it obvious what you are trying to do, and allows easy rollback or review at any stage.
No large, untracked, or half-hidden feature work is allowed.
Do not merge to main (or the primary trunk) without explicit owner approval; always keep feature work on its branch until reviewed.

13. File I/O Command Templates (UTF-8, No BOM)

These commands define a precise, reproducible way to read and write project files with UTF-8 without BOM, using PowerShell via Bash.

Rule for these commands:

In each command, define → use (no dangling helpers).

Do not escape $ unless strictly required by the shell.

Use generic paths like path/to/file.ext, not machine-specific ones.

13.1 READ (UTF-8 no BOM, line-numbered)

Print a file with line numbers, reading as UTF-8 without BOM:

```bash
bash -lc 'powershell -NoLogo -Command "
$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false);
Set-Location -LiteralPath (Convert-Path .);
function Get-Lines { param([string]$Path,[int]$Skip=0,[int]$First=40)
  $enc  = [Text.UTF8Encoding]::new($false)
  $text = [IO.File]::ReadAllText($Path,$enc)
  if ($text.Length -gt 0 -and $text[0] -eq [char]0xFEFF) {
    $text = $text.Substring(1)
  }
  $ls = $text -split \"`r?`n\"
  for ($i = $Skip; $i -lt [Math]::Min($Skip + $First, $ls.Length); $i++) {
    '{0:D4}: {1}' -f ($i + 1), $ls[$i]
  }
}
Get-Lines -Path 'path/to/file.ext' -First 120 -Skip 0
```

13.2 WRITE (UTF-8 no BOM, atomic replace with backup option)

Append a block of text to a file, writing as UTF-8 without BOM, with an atomic temp file:

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
    [IO.File]::WriteAllText($tmp, $Content, $enc)
    Move-Item $tmp $Path -Force
  }
  finally {
    if (Test-Path $tmp) {
      Remove-Item $tmp -Force -ErrorAction SilentlyContinue
    }
  }
}
$file = 'path/to/your_file.ext'
$enc  = [Text.UTF8Encoding]::new($false)
$old  = (Test-Path $file) ? ([IO.File]::ReadAllText($file, $enc)) : ''
Write-Utf8NoBom -Path $file -Content ($old + \"`nYOUR_TEXT_HERE`n\")
```

Agents should reuse these exact patterns (with path and content substituted) rather than inventing ad-hoc file I/O commands.
