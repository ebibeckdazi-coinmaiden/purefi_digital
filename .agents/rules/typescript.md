---
trigger: always_on
---

TypeScript + React Rules (Type-First Edition)
1️⃣ Strict Mode Required

Must enable:

"strict": true,
"noImplicitAny": true,
"strictNullChecks": true,
"noUncheckedIndexedAccess": true

❌ any
❌ ts-ignore

2️⃣ type Over interface (Mandatory)

Always use:

type Props = {}

Never:

interface Props {}

Why

type supports:
✅ unions
✅ variants
✅ mapped types
✅ utility composition
✅ better for design systems

This matches token/variant heavy UI work.

3️⃣ No any Ever

Forbidden:

any

Use:

unknown

generics <T>

unions

discriminated unions

4️⃣ Everything Explicitly Typed

Must type:

props

state

params

returns

hooks

events

❌ relying on inference for public APIs
✅ explicit types for readability + AI tooling

5️⃣ Functional Components Only

Allowed:

function components

hooks

Forbidden:

class components

6️⃣ Named Functions Only

❌

const Button = () => {}

✅

export function Button(): JSX.Element {}

Reason:

better stack traces

better refactors

clearer for AI

7️⃣ Explicit Return Types Required

All exported functions must declare return types.

export function Button(): JSX.Element
export function useAuth(): AuthState

Never implicit.

8️⃣ No React.FC

Forbidden:

React.FC

Problems:

implicit children

weaker generics

hides return type

9️⃣ Props Must Be type
Required pattern
type ButtonProps = {
variant: "primary" | "secondary"
size?: "sm" | "md" | "lg"
children: React.ReactNode
}

Never free-form or string.

🔟 Variants Must Use Union Types

Mandatory for design systems:

type Variant = "primary" | "secondary" | "ghost"

❌ string
❌ boolean flags like isPrimary

11️⃣ Reusable + Composable Only

Components must be:

generic

composable

typed

❌ copy-paste JSX
❌ page-specific hacks

12️⃣ Hooks Must Be Typed

Always:

type UseAuthReturn = {
user: User | null
login(): Promise<void>
}

export function useAuth(): UseAuthReturn

Never untyped objects.

13️⃣ No Logic Inside JSX

Forbidden:

{data.map(x => complicatedStuff(x))}

Move to:

hooks

utils

services

JSX stays declarative.

14️⃣ Composition > Conditionals

Prefer:

<Button variant="primary" />

Not:

{isPrimary ? <PrimaryBtn /> : <SecondaryBtn />}

Variants scale better.

15️⃣ One Component Per File
Button/
Button.tsx
types.ts
index.ts

Cleaner + easier AI reasoning.

16️⃣ Barrel Exports Required

Every folder must have:

index.ts

17️⃣ Pure Components First

Prefer:

props → UI

Avoid:

hidden state

implicit behavior

18️⃣ Accessibility Required

Must use:

semantic HTML

aria attributes

typed button types

❌ div as button

19️⃣ Tailwind v4 Utilities Only

All styling:

✅ Tailwind utilities
❌ inline style
❌ CSS-in-JS
❌ styled-components

Keeps design system consistent.

20️⃣ Side Effects Only in Hooks

Allowed:

useEffect

services

server actions

Forbidden:

fetch in render

mutation during render

21️⃣ Token & Variant Types for Design System

Design tokens must be typed:

type ColorToken =
| "bg"
| "surface"
| "primary"
| "success"
| "danger"

Never raw hex or arbitrary strings.

22️⃣ AI / Antigravity Rule

If generated code violates:

typing

composition

tailwind-only styling

or strict rules

👉 must auto-refactor before output.

✅ Final Law

All React UI must use strictly typed functional components, type-based props, union variants, Tailwind utilities, and zero implicit behavior.
