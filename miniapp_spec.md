# Telegram Mini App — UI/UX Specification

## 1. Goal
Create a Telegram Mini App inspired by the visual and UX style of avito.tech internship pages.
The app should feel:
- friendly
- modern
- bold
- non-corporate
while staying lightweight and mobile-first.

## 2. Platform
- Telegram WebApp (Mini App)
- Vertical layout only
- Responsive for mobile screens

## 3. Visual Style

### Color Palette
- Background: light gray / near-white (#F2F4F6-like)
- Accent colors:
  - Purple
  - Bright blue
  - Acid yellow
- Accent colors should be used as decorative elements, not full backgrounds.

### Typography
- Headings:
  - Large, bold, sans-serif
  - Can break into multiple lines
- Body text:
  - Clean, readable sans-serif
- Optional: outlined or sticker-like headings

### Illustration Style
- Playful, abstract shapes
- Simple cartoon or 3D-like characters (flat preferred)
- No realistic photos

## 4. Layout Principles
- Modular cards with soft shadows
- Plenty of whitespace
- Slight asymmetry is allowed
- Sections separated by visual rhythm, not hard borders

## 5. Screens Structure

### Screen 1 — Hero
- Large bold headline
- Short subtitle
- One accent illustration or abstract shape
- Primary CTA button

### Screen 2 — About
- 2–3 cards
- Each card:
  - icon
  - title
  - short description

### Screen 3 — Requirements / Who it's for
- Card-based layout
- Clear bullet-style information

### Screen 4 — Benefits
- Vertical list of benefit cards
- Emphasis on clarity and trust

### Screen 5 — Call To Action
- Strong final message
- One main action button
- Minimal distractions

## 6. UI Components
- Cards
- Buttons (rounded)
- Icons
- Simple transitions (fade, slide)

## 7. Technical Notes
- Use Telegram WebApp API
- Support light theme first
- Code should be clean, readable, component-based

## 8. Tone
- Friendly
- Encouraging
- Confident but not aggressive





You are an expert frontend engineer building a Telegram Mini App UI.

## General Rules
- Mobile-first
- Vertical scroll only
- Simple, readable components
- No overengineering
- No heavy animations

## Platform
- Telegram WebApp
- Use Telegram WebApp API when relevant
- Respect safe areas

## Stack
- React + Vite
- Functional components
- Hooks only
- No class components

## Styling
- Use CSS Modules or styled-components
- Light background
- Accent colors used sparingly
- Rounded corners (12–16px)
- Soft shadows

## UI Principles
- Bold typography for headings
- Clean card-based layout
- One main CTA per screen
- Whitespace is intentional

## Component Architecture
- atoms/
  - Button
  - Card
  - Icon
- molecules/
  - FeatureCard
  - Header
  - CTASection
- sections/
  - HeroSection
  - FeaturesSection
  - BenefitsSection
  - FinalCTASection

## Code Quality
- Each component in its own file
- Clear prop types
- Meaningful variable names
- Add comments for key logic

## Output Expectations
- Complete working UI
- No placeholders like "TODO"
- Clean folder structure
