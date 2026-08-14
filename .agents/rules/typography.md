---
trigger: always_on
---

Typography Rules
Rule

Typography must scale fluidly with clamp() and follow a strict hierarchy.

Must

use clamp()

use rem

predefined scale only

readable in grayscale

Never

px font sizes

arbitrary sizes

Example

--text-h1: clamp(2rem, 4vw, 3rem);

Typography Scaling Rules (Responsive with clamp())
🎯 Purpose

Typography must scale fluidly across screen sizes without:

jumpy breakpoints

media-query hacks

tiny mobile text

oversized desktop text

clamp() is mandatory to ensure smooth, continuous scaling.

✅ Clamp Rule (MANDATORY)

ALL font sizes MUST use clamp().

NEVER use:

fixed px sizes

breakpoint-only scaling

arbitrary rem values

Forbidden:

text-[18px]
text-lg md:text-xl lg:text-2xl

Required:

clamp(min, fluid, max)

✅ Clamp Formula Standard

Use this structure:

clamp(MIN, FLUID, MAX)

Where:

MIN = smallest readable size (mobile)

FLUID = viewport-based scaling (vw)

MAX = comfortable desktop cap

✅ Tokenized Typography Scale

AI must only use this predefined scale.

--text-display: clamp(2.5rem, 5vw, 4rem);
--text-h1: clamp(2rem, 4vw, 3rem);
--text-h2: clamp(1.5rem, 3vw, 2.25rem);
--text-h3: clamp(1.25rem, 2.2vw, 1.75rem);
--text-body: clamp(1rem, 1.2vw, 1.125rem);
--text-small: clamp(0.875rem, 1vw, 1rem);
--text-caption: clamp(0.75rem, 0.8vw, 0.875rem);

Rules:

Use tokens only

Never invent new sizes

Never override per component

✅ Minimum Readability Rule

Text must NEVER go below:

Body → 16px equivalent

Small → 14px minimum

Caption → 12px minimum

If clamp falls below this → adjust MIN.

✅ Fluid Scaling Rule

Scaling must be:

smooth

proportional

consistent

Avoid:

sudden jumps at breakpoints

dramatic size differences

Typography should feel natural, not elastic.

✅ Hierarchy Rule

Each level must differ clearly:

H1 > H2 > H3 > Body > Small

If sizes feel similar → hierarchy fails.

Minimum difference:

1.15x–1.25x scale between steps

✅ Grayscale Rule

Hierarchy must remain clear with:

color removed

low contrast

dark mode

If hierarchy relies only on color → invalid.

Use:

size

weight

spacing

NOT:

color alone

✅ Line Height Rules

Text must breathe.

Required:

headings → 1.1–1.3

body → 1.5–1.7

dense UI → ≥ 1.4 minimum

Never use tight body text.

✅ Tailwind v4 Implementation Example

In tokens.css:

:root {
--text-body: clamp(1rem, 1.2vw, 1.125rem);
}

In Tailwind:

fontSize: {
body: "var(--text-body)",
}

Usage:

<p class="text-body">

Never:

<p class="text-[17px]">
