# Landing Page Design & Component Guide

## 1. Design Principles
- **Minimalism:** Clean lines, ample whitespace, no clutter.
- **Brand Colors:** High-contrast combinations of PureFi Green (`#9FE870`) and Forest Green (`#163300`).
- **Typography:** Bold, tight tracking for headlines; clear, readable body text with good line height.
- **Fluid Layout:** Responsive design using container-based alignment and grid layouts.

## 2. Color Palette
- **PureFi Green:** `#9FE870` (Primary Action / Hero Accents)
- **Forest Green:** `#163300` (Dark Mode / Text / Buttons)
- **Blue:** Used for specific accent visuals (e.g., Security section lock).
- **Backgrounds:** Predominantly White (`#FFFFFF`) or PureFi Green for specific sections.

## 3. Typography
- **Headlines:** `text-4xl` to `text-7xl`, font-black/font-bold, tracking-tighter.
- **Body:** `text-base` to `text-lg`, font-normal/medium.

## 4. Page Structure & Components

### 1. Navigation (Navbar)
- **Logo:** "PureFi" (Black, font-black, tracking-tight).
- **Links:** Personal, Business, Features, Help, Language, Register, Log In.
- **Style:** Sticky top-0, background-background.

### 2. Hero Section
- **Headline:** "MONEY FOR HERE, THERE AND EVERYWHERE"
- **Subtext:** "The international account. For over 30 million people and businesses."
- **Visual:** Large floating 3D coins illustration.
- **Buttons:** "Open an account" (Fill), "Send money now" (Outline).

### 3. Global Account Section
- **Headline:** "Manage all your currencies all over the world"
- **Subtext:** "Save up to 2x when you send, convert and withdraw 50 currencies, all in one account."
- **Visual:** Background image with currency/phone mockup.
- **Layout:** Grid split (Content: 3/9, Visual: 6/9).

### 4. Currency Converter Section
- **Headline:** "Save up to 9x when you send currencies"
- **Subtext:** Explains the low fee structure of PureFi.
- **Background:** PureFi Green (`#9FE870`).
- **Visual:** Converter interface illustration.

### 5. Debit Card Section
- **Headline:** "The card that's always got the right currency"
- **Subtext:** "Save as you spend and withdraw over 50 currencies at the live rate automatically."
- **Visual:** Pocket illustration with card.
- **Features:** Scrolling flags list at the bottom.
- **Trust Badges:** FinCEN registration and security standards.

### 6. Business Section
- **Headline:** "Trusted by businesses small and large"
- **Subtext:** "Join over 300,000 businesses thriving with PureFi."
- **Background:** PureFi Green (`#9FE870`).
- **Visual:** Business cards illustration.

### 7. Travel Section (People Going Places)
- **Headline:** "For people going places"
- **Carousel:** Customer stories (Gerald, expat living, etc.).
- **Visuals:** Flag icons and large pull quotes.

### 8. Security Section
- **Headline:** "Disappoint thieves"
- **Subtext:** "Every month, our customers trust us to move over £10 billion of their money."
- **Visual:** 3D Lock Illustration.
- **Features:**
    1. Fraud & Security Teams
    2. 2-Factor Authentication
    3. Established Financial Institutions

### 9. Footer
- **Structure:** 4 Column layout (Company, Wise Products, Resources, Follow us).
- **Logo & Legal:** Secondary PureFi logo and legal links (Legal, Privacy, Cookies).
- **Copyright:** "© PUREFI US Inc 2023".
- **Background:** Muted gray background.

---

# Dashboard Design & Component Guide

## 1. Design Philosophy

**Aesthetic Direction: Refined Minimalism with Trust**

The dashboard is human-centered financial design. Every element communicates trust, clarity, and ease.

- **Approachable sophistication:** Rounded corners everywhere (12-16px), no sharp edges
- **Confident restraint:** White space does the heavy lifting, not decoration
- **Information-first hierarchy:** The balance number is the hero
- **Contextual color:** Green = positive action, grey = neutral, amber = needs attention
- **Card pattern:** All dashboard components use the same rounded-corner, bordered, white-background card pattern

## 2. Dashboard Color Palette

### Primary Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-dashboard-primary` | `#16b364` | CTA buttons, active nav, success states |
| `--color-dashboard-primary-hover` | `#13a058` | Button hover states |
| `--color-dashboard-primary-subtle` | `#f0fdf4` | Active nav background, chart fill |

### Text & Surface
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-dashboard-text-primary` | `#1a2b4a` | Headings, balance numbers |
| `--color-dashboard-text-secondary` | `#6b7280` | Body text, labels |
| `--color-dashboard-text-muted` | `#9ca3af` | Timestamps, tertiary info |
| `--color-dashboard-border` | `#e5e7eb` | Card borders, dividers |
| `--color-dashboard-surface` | `#ffffff` | Card backgrounds |
| `--color-dashboard-bg` | `#f9fafb` | Page background |
| `--color-dashboard-hover` | `#f9fafb` | Row hover state |

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| Warning | `#f59e0b` | "Needs approval" indicators |
| Success | `#16b364` | "Successful" status labels |
| Error | `#ef4444` | Error states |

## 3. Typography

### Font Stack
```
--font-dashboard-display: 'Plus Jakarta Sans', 'Inter', sans-serif;
--font-dashboard-body: 'Inter', -apple-system, sans-serif;
```

### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Balance number | 32px | 700 | 1.1 | -0.02em |
| Section heading | 16px | 700 | 1.3 | -0.01em |
| Card title | 14px | 600 | 1.4 | 0 |
| Body text | 14px | 400 | 1.5 | 0 |
| Small label | 12px | 500 | 1.4 | 0.01em |
| Timestamp | 12px | 400 | 1.4 | 0.01em |
| Status badge | 11px | 600 | 1.3 | 0.02em |

## 4. Spacing Scale (8px base)
| Token | Value | Usage |
|-------|-------|-------|
| 4px | Inline icon gaps |
| 8px | Tight element gaps |
| 12px | Row internal padding |
| 16px | Card internal padding |
| 20px | Card-to-card gaps |
| 24px | Section spacing |
| 32px | Major section breaks |
| 40px | Page margins |

## 5. Component Specifications

### 5a. Sidebar Navigation
```
Width: 220px (fixed)
Background: #ffffff
Border-right: 1px solid #e5e7eb
Padding: 24px 16px

Logo: top-left, height: 28px, margin-bottom: 40px

Nav Items:
  - Height: 44px, border-radius: 12px, padding: 0 16px
  - Gap: 4px between items, icon: 20px, stroke-width: 1.5
  - Font: 14px, weight: 500
  - Active: background #f0fdf4, color #16b364
  - Hover: background #f9fafb, transition: all 150ms ease

User Profile (bottom):
  - Sticky to bottom, padding: 16px
  - Border-top: 1px solid #e5e7eb
  - Avatar: 40px circle, name: 14px weight: 600, email: 12px #6b7280

Items: Home, Card, Recipients, Payments, Analytics, Settings, Log out
```

### 5b. Dashboard Header
```
Layout: h-16, sticky top-0, bg-white/50 backdrop-blur-sm

Left:
  - "Main Group ▾" — 14px weight: 500, color: #16b364, with chevron icon 16px

Right:
  - Notification bell icon 24px, color: #6b7280
    with green dot indicator (8px circle #16b364)
  - Avatar 40px circle + chevron 16px
```

### 5c. Balance Section
```
Total balance label — 12px weight: 500, color: #6b7280
Balance number — 32px weight: 700 color: #1a2b4a, letter-spacing: -0.02em
Currency code — 20px weight: 500, color: #6b7280

Action Buttons (flex row, gap: 12px):
  - Send:     solid #16b364 bg, white text, pill shape, icon ↑
  - Add money: white bg, 1px #e5e7eb border, dark text, pill shape, icon +
  - Request:  white bg, 1px #e5e7eb border, dark text, pill shape, icon ↓
  All buttons: 12px 24px padding, border-radius: 9999px, 14px weight: 600
```

### 5d. Currency Balance Cards (Horizontal Scroll)
```
Container: flex-row, gap: 16px, overflow-x: auto

Card: min-width: 180px, 16px border-radius, 1px #e5e7eb border, 20px padding
  - Flag: 32px circle (use react-circle-flags)
  - Currency code: 14px weight: 600
  - Balance: 24px weight: 700
  - Account number: 12px, #9ca3af with temple icon

"Add Currency" Card: dashed border, centered plus icon
```

### 5e. Tasks Card
```
Header: "Tasks" bold + "View all" green link
Task item: rounded bg surface, flex row
  - Icon: 20px circle with warning amber dot
  - Title: "50,000 EUR to Architects Co." bold
  - Status: "Needs approval" amber text
  - Action: "Review" outline button, green text, pill shape
```

### 5f. Spend Analytics Card
```
Header: "Spend analytics" bold + "This month ▾" dropdown
Total: 28px bold amount + "Total spent" label
Chart: green line (#16b364) with light green area fill (#f0fdf4)
  - Use Recharts AreaChart, monotone type, hide axes, show tooltip on hover
  - Gradient fill from primary-green/0.3 to transparent
```

### 5g. Transactions Table
```
Header: "Transactions" bold
Filter tabs (All/Sent/Received): pill shape, active = green bg white text
Search: left icon, input with border, filter button beside it

Transaction row (flex-row, h-64px, hover:bg #f9fafb):
  - Avatar: 40px circle with merchant initial
  - Info: merchant bold + "type • date" muted
  - Amount: right-aligned
    - Positive: +amount, green (#16b364)
    - Negative: -amount, dark (#1a2b4a)
  - Status: "Successful" green text 11px
  - Currency: 12px weight: 500, #6b7280

Footer: "View all transactions" centered link
```

### 5h. Recent Recipients Card
```
Header: "Recent recipients" bold + "View all" green link
Recipient items:
  - Avatar: 40px circle with initials, colored bg
  - Name bold + label muted text
  - Chevron arrow right

Footer: "Add recipient" full-width outlined pill button
```

### 5i. Mobile Bottom Tab Bar
```
Fixed bottom, h-64px, white bg, border-top, safe-area-bottom
Tabs: Home, Transfers, Accounts, Invest, Loan
Active: icon + label in green, with animated pill background
```

## 6. Layout Grid

### Desktop (1200px+)
```
┌──────────┬──────────────────────────────────────┐
│ Sidebar  │ Content (fluid, max 960px)           │
│ 220px    │                                      │
│ fixed    │  ┌─────────┬─────────┬─────────┐     │
│          │  │ Currency │ Currency│ Currency│     │
│          │  └─────────┴─────────┴─────────┘     │
│          │  ┌──────────────┬──────────────┐     │
│          │  │   Tasks      │   Analytics  │     │
│          │  └──────────────┴──────────────┘     │
│          │  ┌──────────────────────────────┐     │
│          │  │       Transactions           │     │
│          │  └──────────────────────────────┘     │
│          │  ┌──────────────────────────────┐     │
│          │  │     Recent Recipients        │     │
│          │  └──────────────────────────────┘     │
└──────────┴──────────────────────────────────────┘
```

### Mobile (< 768px)
Single column, full-width cards, horizontal scroll for currencies, bottom tab bar.

## 7. Responsive Breakpoints
| Breakpoint | Width | Changes |
|------------|-------|---------|
| Mobile | < 640px | Single column, bottom tabs, scrollable currencies |
| Tablet | 640-1024px | Two-column grid, no sidebar |
| Desktop | > 1024px | Full sidebar + content |

## 8. Animation & Micro-interactions

### Page Load (Staggered reveal)
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Delay cascade: balance(0ms) → buttons(80ms) → currencies(160ms) → tasks(240ms) → transactions(320ms) → recipients(400ms)

### Hover States
- Cards: border-color darkens on hover (150ms ease)
- Transaction rows: background highlight on hover (150ms ease)
- Buttons: scale 1.02 on hover (150ms ease)

## 9. Accessibility
- All interactive elements have focus-visible ring (2px, #16b364)
- Color contrast: all text meets WCAG AA (4.5:1 minimum)
- Screen reader labels on all icons
- Keyboard navigation through nav items and cards
- Reduced motion: respects prefers-reduced-motion
- Touch targets: minimum 44x44px on mobile

