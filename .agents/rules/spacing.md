---
trigger: always_on
---

Spacing Rules (Final Form)
Rule (MANDATORY)

All spacing must use tokens defined with rem + clamp().

Must

token based

clamp()

rem

Tailwind scale

Never

%

vw/vh

px

arbitrary values

inline styles

AI-generated magic numbers

Example

--space-4: clamp(1rem, 1.6vw, 1.25rem);

p-4 gap-6

Proper Rule (AI-safe + system-friendly)

Here’s the upgraded section you should add to your design-system.md:

📐 Fluid Spacing Rules (Responsive with clamp())
🎯 Purpose

Spacing must:

scale slightly with screen size

maintain rhythm

never become too tight or too loose

remain token-based and predictable

Spacing must be fluid, not percentage-based.

❌ Forbidden

Never use:

max-w-\*;
min-w-\*;
padding: 5%;
margin: 3%;
gap: 2%;

Reason:

inconsistent rhythm

breaks alignment

unpredictable in nested layouts

destroys component reuse

Percentages are for layout widths, not spacing.

✅ Required Approach

Use:

rem units

clamp()

spacing tokens

Structure:

clamp(MIN, FLUID, MAX)

✅ Fluid Spacing Token Scale

Define spacing tokens like this:

--space-1: clamp(0.25rem, 0.4vw, 0.5rem);
--space-2: clamp(0.5rem, 0.8vw, 0.75rem);
--space-3: clamp(0.75rem, 1.2vw, 1rem);
--space-4: clamp(1rem, 1.6vw, 1.25rem);
--space-5: clamp(1.5rem, 2vw, 2rem);
--space-6: clamp(2rem, 3vw, 3rem);
--space-7: clamp(3rem, 4vw, 4rem);
--space-8: clamp(4rem, 5vw, 5rem);

Behavior:

small screens → tighter

large screens → airier

always within limits

✅ Usage Rule (MANDATORY)

Only use spacing tokens.

Allowed:

p-4
gap-6
space-y-5

Forbidden:

p-[17px]
gap-[3%]
m-[22px]

✅ Micro vs Macro Spacing Rule

Use two systems:

Micro spacing (components)

Use:

8px rhythm (fixed or small clamp)

For:

buttons

inputs

cards

forms

Keep stable for usability.

Macro spacing (sections/layout)

Use:

fluid clamp spacing

For:

page padding

section gaps

layout breathing room

This is where responsiveness happens.

✅ Minimum Touch Target Rule

Spacing must never cause:

tap targets < 44px

crowded UI

text collisions

Usability overrides density.

✅ Tailwind v4 Example

tokens.css

:root {
--space-4: clamp(1rem, 1.6vw, 1.25rem);
}

tailwind.config.ts

spacing: {
4: "var(--space-4)",
}

Usage:

<section class="px-6 py-8">

🧠 Golden Rule for Spacing

Use:

rem → consistency

clamp → fluidity

tokens → system

Never:

percentages

arbitrary px

magic numbers
