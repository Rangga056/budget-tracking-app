```markdown
# Design System Specification: The Architectural Minimalist

## 1. Overview & Creative North Star

The "Architectural Minimalist" is our North Star. This system moves away from the "app-like" feel of standard Material Design and moves toward a **high-end editorial experience**. We are building a space for deep thought and precision, mimicking the experience of a pristine, physical workspace.

To move beyond the "template" look, we embrace **Intentional Asymmetry**. Do not feel forced to center-align every hero or balance every column perfectly. Use whitespace as a structural element—treat it as "active" space that guides the eye, rather than "empty" space. By layering tonal surfaces and using high-contrast typography, we create a digital environment that feels curated, not just programmed.

## 2. Colors & Surface Philosophy

The palette is rooted in a "cool-lithic" white and gray range, punctuated by a vibrant, digital violet.

### The "No-Line" Rule

**Borders are a failure of hierarchy.** Designers are strictly prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through:

1. **Background Color Shifts:** Use `surface-container-low` (#f3f4f5) to define a sidebar against a `surface` (#f8f9fa) background.
2. **Tonal Transitions:** Use vertical spacing to allow the eye to perceive a break in content without a physical line.

### Surface Hierarchy & Nesting

Treat the UI as a series of nested physical layers.

- **Base Level:** `surface` (#f8f9fa)
- **Nested Content:** Use `surface-container-lowest` (#ffffff) for primary work areas (like a sheet of paper on a desk).
- **Secondary Tooling:** Use `surface-container-high` (#e7e8e9) for utility panels.
  This stacking creates "natural" depth that feels sophisticated and intentional.

### The "Glass & Gradient" Rule

To add soul to the precision, floating elements (Modals, Hover Menus) should utilize **Glassmorphism**.

- **Token:** `surface-container-lowest` (#ffffff) at 80% opacity with a `24px` backdrop-blur.
- **CTAs:** Use a subtle linear gradient for `primary` elements (transitioning from #674bb5 to #a78bfa at a 135-degree angle). This provides a "shimmer" of professional polish.

## 3. Typography: The Editorial Voice

We use **Inter** across the board, but we vary scale and weight to create an authoritative hierarchy.

| Role         | Token         | Size     | Weight | Use Case                                             |
| :----------- | :------------ | :------- | :----- | :--------------------------------------------------- |
| **Display**  | `display-lg`  | 3.5rem   | 700    | Hero moments, singular focus points.                 |
| **Headline** | `headline-sm` | 1.5rem   | 600    | Section headers; high-contrast against `on-surface`. |
| **Title**    | `title-md`    | 1.125rem | 500    | Card titles, modal headers.                          |
| **Body**     | `body-md`     | 0.875rem | 400    | Primary reading text; high legibility.               |
| **Label**    | `label-md`    | 0.75rem  | 600    | Micro-copy, all-caps for metadata.                   |

**The Editorial Scale:** Pair `display-lg` with `body-md` in close proximity to create a high-fashion editorial contrast. Large type should feel like an architectural element of the page.

## 4. Elevation & Depth

Depth is achieved through **Tonal Layering** rather than traditional structural lines or heavy shadows.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. The difference is subtle (pure white vs. off-white), providing a "soft lift."
- **Ambient Shadows:** For floating elements that require high focus, use a shadow with a 32px blur and 4% opacity, using the `on-surface` color (#191c1d) to ensure the shadow looks like natural ambient light, not a "drop shadow."
- **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use the `outline-variant` (#cac4d4) at **15% opacity**. A 100% opaque border is considered a design error.

## 5. Components

### Buttons & Interaction

- **Primary:** Uses the vibrant violet (`primary-container` #a78bfa). Use `xl` (0.75rem) roundedness. No shadow. On hover, transition to the `primary` (#674bb5) gradient.
- **Secondary:** Ghost-style. No background. Use `label-md` bolded with `primary` text color.
- **Tertiary:** `surface-container-highest` background with `on-surface` text.

### Inputs & Fields

- **The Canvas Input:** Forbid the "box" look. Text inputs should be a `surface-container-lowest` (#ffffff) area with a subtle 2px bottom-accent in `outline-variant`.
- **Focus State:** The bottom accent transforms into a `primary` (#674bb5) 2px line.

### Cards & Lists

- **No Dividers:** Lists must use `2.5` (0.625rem) spacing between items rather than horizontal rules.
- **The Sidebar:** Use `surface-dim` (#d9dadb) for the background of inactive navigation to keep focus on the `surface-container-lowest` main editor.

### Bespoke Component: The "Focus Pane"

A large-scale container that uses `surface-container-lowest` with a `lg` (0.5rem) roundedness, designed to hold the primary task. It should always be surrounded by at least `12` (3rem) of "breathing room" to emphasize its importance.

## 6. Do’s and Don’ts

### Do:

- **Use Asymmetrical Margins:** Try a `16` (4rem) margin on the left and an `8` (2rem) on the right to create a "notebook" feel.
- **Trust the White Space:** If a screen feels cluttered, increase the spacing tokens rather than adding icons or lines.
- **Layer Neutrals:** Use the full range of `surface` tokens to create sophisticated UI depth.

### Don’t:

- **Don't use 100% Black:** Always use `on-surface` (#191c1d) for text to maintain the premium, soft-contrast look.
- **Don't use "System" Shadows:** Avoid the default Material Design elevation levels (1-5). Stick to the Tonal Layering and Ambient Shadow rules defined in Section 4.
- **Don't Box the Content:** Avoid "cards-inside-cards-inside-cards." Use background color shifts to define areas instead.
```
