---
name: Artisanal Canvas
colors:
  surface: '#f7faf9'
  surface-dim: '#d8dbda'
  surface-bright: '#f7faf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f3'
  surface-container: '#eceeee'
  surface-container-high: '#e6e9e8'
  surface-container-highest: '#e0e3e2'
  on-surface: '#181c1c'
  on-surface-variant: '#3f4949'
  inverse-surface: '#2d3131'
  inverse-on-surface: '#eef1f1'
  outline: '#6f7979'
  outline-variant: '#bec9c8'
  surface-tint: '#0e696b'
  primary: '#005153'
  on-primary: '#ffffff'
  primary-container: '#126b6d'
  on-primary-container: '#9de9ea'
  inverse-primary: '#88d3d5'
  secondary: '#a43c28'
  on-secondary: '#ffffff'
  secondary-container: '#fd7e65'
  on-secondary-container: '#711707'
  tertiary: '#474755'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f5f6d'
  on-tertiary-container: '#dbdaea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a4f0f1'
  primary-fixed-dim: '#88d3d5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f51'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a5'
  on-secondary-fixed: '#3f0400'
  on-secondary-fixed-variant: '#842413'
  tertiary-fixed: '#e2e1f1'
  tertiary-fixed-dim: '#c6c5d5'
  on-tertiary-fixed: '#1a1b26'
  on-tertiary-fixed-variant: '#454653'
  background: '#f7faf9'
  on-background: '#181c1c'
  surface-variant: '#e0e3e2'
  mint-mist: '#E6FFD9'
  azure-wash: '#EEFDFF'
  charcoal-ink: '#252525'
  paper-white: '#FFFFFF'
typography:
  headline-xl:
    fontFamily: Literata
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Literata
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Literata
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  section-gap: 80px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

This design system is built for a creative and organized e-commerce experience. The brand identity balances the messiness of creation with the precision of high-quality tools. It targets hobbyists and professional artists who value aesthetic inspiration as much as functional utility.

The design style is **Minimalist with Tactile accents**. It leverages heavy whitespace to let product photography breathe, while using subtle background tints to categorize different artistic disciplines. The interface remains unobtrusive to ensure the art supplies themselves are the focal point, using professional yet playful typography to bridge the gap between a corporate shop and a personal studio.

## Colors

The color palette is inspired by a fresh studio environment. We use a **Deep Teal** (`primary`) as a sophisticated anchor for navigation and primary actions, providing a sense of professional reliability. **Coral** (`secondary`) serves as a bold, creative spark for highlights, sales, and urgent calls-to-action.

The neutral foundations utilize the pastels found in the brand's heritage: **Mint Mist**, **Azure Wash**, and **Lavender Tint** (`tertiary`). These are used as soft background floods to differentiate product categories or section blocks without the harshness of solid lines. Typography and deep UI elements use **Charcoal Ink** instead of pure black to maintain a softer, more organic feel.

## Typography

This design system employs a sophisticated pairing of **Literata** and **Manrope**. 

**Literata** is used for all headlines. Its literary, scholarly roots convey a sense of "high-quality craft" and "storytelling," making every product category feel like a new chapter. **Manrope** is used for all functional text, including body copy, product descriptions, and labels. Its modern, geometric construction ensures maximum legibility and a clean, organized look across dense product grids. 

Use `label-md` for small metadata like "In Stock" or "New Arrival" to provide a clear, systematic contrast to the more expressive headers.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain an editorial, "curated magazine" feel. The central content container is capped at 1280px.

- **Grid:** A 12-column system is used for product listings, typically spanning 3 columns per item (4 items per row) on desktop, and 6 columns (2 items per row) on tablet.
- **Whitespace:** Generous `section-gap` units of 80px ensure that different medium types (e.g., Resin vs. Markers) are clearly separated without needing heavy dividers.
- **Mobile:** On mobile devices, the layout collapses to a single column for featured banners and a 2-column masonry or fixed grid for product cards, with 16px side margins.

## Elevation & Depth

To maintain a "clean and modern" aesthetic, depth is primarily communicated through **Tonal Layers** rather than heavy shadows. 

- **Level 0 (Floor):** Pure `paper-white` or very light tinted backgrounds (`azure-wash`).
- **Level 1 (Cards):** Use `paper-white` surfaces over tinted backgrounds with a very soft, ambient shadow (4% opacity, 12px blur) to create a "resting on paper" effect.
- **Level 2 (Interactive):** Elements like "Add to Cart" buttons or active filters use subtle 2px solid strokes in the `primary` color or a slight lift via a 10% opacity shadow on hover.
- **Glassmorphism:** Use for sticky navigation bars. A backdrop blur of 12px with a 90% opaque `paper-white` fill allows the vibrant colors of product photos to peek through as the user scrolls.

## Shapes

The shape language is **Rounded**, reflecting the approachable and fluid nature of art. 

Standard components like input fields and small buttons use a 0.5rem (8px) radius. Larger containers, such as product cards and category promos, utilize `rounded-lg` (1rem / 16px) to feel more inviting. Interactive elements like "Pills" for categories or "Sale" tags should use fully rounded caps (pill-shaped) to distinguish them from structural elements.

## Components

### Buttons
- **Primary:** Solid `primary_color` (Teal) with white text. 0.5rem corner radius.
- **Secondary:** Transparent background with a `primary_color` stroke.
- **Action:** For "Add to Cart," use the `secondary_color` (Coral) to draw the eye, using a bold weight in Manrope.

### Product Cards
Cards should be borderless on tinted backgrounds, or use a very thin 1px stroke (`#EEEEEE`) on white backgrounds. The product image should always have a 1:1 aspect ratio with a subtle `tertiary` background color to normalize various packaging styles.

### Input Fields
Inputs should use a "Soft" style: light gray backgrounds that darken slightly on focus, rather than heavy borders. Labels must be `label-md` and placed above the field.

### Chips & Tags
Use pastel tints for tags (e.g., a `mint-mist` background with dark green text for "Eco-friendly"). These should be pill-shaped to contrast with the more rectangular product images.

### Search Bar
A prominent, centrally located search bar with high roundedness (pill-shaped) and a subtle backdrop blur when expanded, emphasizing the "organized" brand pillar.