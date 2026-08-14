---
trigger: always_on
---

# 🧠 AI Design System Rules

Modern • Functional • Token-Driven • Tailwind v4 • Motion-Aware

This document defines **strict rules** that AI models MUST follow when generating UI.

These are NOT suggestions.
They are constraints.

If a generated UI violates any rule, it is incorrect.

---

# 0. Global Prime Directive

ALWAYS prioritize:

1. Function
2. Clarity
3. Hierarchy
4. Accessibility
5. Then aesthetics

NEVER design for decoration first.

---

# 1. Token Usage Rules (MANDATORY)

1. NEVER use raw hex values.
2. NEVER hardcode spacing values.
3. NEVER use arbitrary font sizes.
4. ALWAYS use semantic tokens.

ALLOWED:

- bg-background
- text-primary
- space-4
- radius-lg

FORBIDDEN:

- bg-[#0f0f0f]
- p-[13px]
- text-[15px]

All styling MUST map to system tokens.

---

# 2. Color Rules

## 2.1 Role-Based Coloring

Colors MUST be assigned by role, not preference.

Every color must belong to:

- background
- surface
- text
- primary action
- intent (success/warning/error/info)

Random decorative colors are forbidden.

---

## 2.2 Anchor Color Rule

Only ONE primary brand color may be used for:

- primary buttons
- links
- highlights
- focus states

Other colors must not compete.

---

## 2.3 Neutral Dominance Rule

70–80% of the interface must use neutrals.

Accent colors must be sparse.

If everything is colorful → hierarchy is broken.

---

## 2.4 Intent Color Rule

Intent colors are ONLY for status:

- success
- warning
- error
- info

Never decorative.
Never branding.

---

## 2.5 Accessibility Rule

All text must pass WCAG AA contrast minimum.

If contrast fails:

- adjust neutrals first
- never reduce readability for style

---

# 3. Spacing Rules

## 3.1 8px Rhythm Rule

All micro spacing must be multiples of 8px.

Valid:
8, 16, 24, 32, 40, 48, 64

Invalid:
10, 14, 18, 22

---

## 3.2 Golden Layout Rule

Large layout splits may use ~62/38 proportions.

Use for:

- hero sections
- sidebars
- dashboards

Do NOT apply golden ratio to small UI spacing.

---

## 3.3 Breathing Room Rule

Every section must include visible whitespace.

Crowded layouts are forbidden.

---

# 4. Typography Rules

1. Only tokenized text sizes allowed
2. Maximum 5–6 text levels per screen
3. Headings create hierarchy, not decoration
4. Line height must ensure readability
5. Text must remain readable in grayscale

NEVER:

- stack many similar sizes
- use tiny fonts for secondary info

---

# 5. Layout Rules

## 5.1 Grid Rule

Must use grid:

- mobile: 4 columns
- tablet: 8 columns
- desktop: 12 columns

No random alignment.

---

## 5.2 Structure Rule

Every screen must be composed of:

- page shell
- sections
- containers
- components

Free-floating elements are forbidden.

---

## 5.3 Recomposition Rule

Responsive design must recompose layout, not just shrink.

Mobile ≠ scaled desktop.

---

# 6. Component Rules

Every component MUST support:

- states (hover/focus/active/disabled)
- sizes
- accessibility
- dark mode
- motion feedback

If any state is missing → component incomplete.

---

# 7. Motion Rules

## 7.1 Purpose Rule

Motion must communicate:

- feedback
- hierarchy
- continuity
- spatial relationship

If motion is decorative only → remove it.

---

## 7.2 Timing Rule

Use only:

- fast (120–180ms)
- base (180–280ms)
- slow (400–700ms)

Random durations forbidden.

---

## 7.3 Animation Rule

Allowed:

- fade
- slide
- scale
- stagger
- float
- scroll reveal

Forbidden:

- flashy effects
- bounces without meaning
- excessive parallax

---

## 7.4 Respect Users Rule

Must support:

- prefers-reduced-motion

If user disables motion → animations stop.

---

# 8. Scroll Rules

Scrolling must:

- guide attention
- reveal progressively
- improve flow

Allowed:

- sticky sections
- reveal on scroll
- progress indicators

Forbidden:

- surprise jumps
- hidden content
- motion overload

---

# 9. Responsive Rules

## Mobile

- stacked layout
- large tap targets
- simplified motion
- bottom navigation preferred

## Desktop

- multi-column
- hover interactions
- higher information density

AI must adapt layout logic, not just scale sizes.

---

# 10. Accessibility Rules (NON-NEGOTIABLE)

Must always include:

- keyboard navigation
- visible focus states
- semantic HTML
- screen reader labels
- contrast compliance
- reduced motion support

If accessibility fails → design is invalid.

---

# 11. Tailwind v4 Rules

1. Use utilities mapped to tokens only
2. No arbitrary values
3. No inline styles
4. Prefer semantic class groups

Correct:
bg-surface p-6 text-primary

Incorrect:
bg-[#111] p-[17px]

---

# 12. Design Order Rule (Execution Sequence)

AI must design in this order:

Step 1 → Layout structure  
Step 2 → Spacing  
Step 3 → Typography hierarchy  
Step 4 → Neutrals  
Step 5 → Accent color  
Step 6 → Motion

Never reverse this sequence.

---

# 13. Simplicity Rule

When unsure:

- remove elements
- reduce color
- increase spacing
- simplify hierarchy

Simplicity is preferred over complexity.

---

# Final Law

If a design decision does not improve:

- clarity
- usability
- accessibility
- hierarchy

It must be removed.

If elevation is unclear → hierarchy fails.

decorative/non-functional motion

Typography = hierarchy

Spacing = structure

Color = intent

Motion = feedback

Depth = focus

❌ Forbidden

inline styles (style="")

custom CSS files for one-off styling

raw hex colors

px font sizes or spacing

%, vw, vh for spacing

arbitrary Tailwind values (p-[17px], text-[22px])

magic numbers
