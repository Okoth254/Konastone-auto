# Design System Document: Industrial Minimalist Automotive Interface

## 1. Overview & Creative North Star
### The Creative North Star: "The Precision Engine"
This design system rejects the "softness" of modern SaaS in favor of the high-torque, high-precision world of automotive engineering. It is an "Industrial Minimalist" experience that feels like a premium diagnostic tool or a supercar’s telemetry HUD. 

We break the "template" look through **Calculated Brutalism**: a reliance on razor-sharp 0px borders, high-contrast technical typography, and intentional asymmetry. The layout should feel like a technical blueprint—organized, authoritative, and unapologetically functional. By utilizing hyper-clean lines and "Safety" accents, we transform a standard admin panel into a high-performance command center.

---

## 2. Colors & Surface Logic
The palette is rooted in the "Shop Floor" aesthetic—deep oily blacks, metallic greys, and high-visibility safety markers.

### Core Palette
*   **Background (`surface`):** `#131313` — The absolute void. All data begins here.
*   **Primary (`primary`):** `#FFC107` (Safety Yellow) — Reserved for critical actions and active states. It demands immediate ocular attention.
*   **Secondary (`secondary`):** `#26C6DA` (Mechanic Teal) — Used for data streams, secondary metrics, and "system healthy" indicators.
*   **Error (`on_tertiary_container`):** `#E53935` (Engine Red) — For destructive actions or system failures.

### The "No-Line" Rule & Surface Hierarchy
To maintain a high-end feel, avoid using 1px borders for general sectioning. Instead, define space through **Tonal Shifts**:
*   **Base Layer:** `surface` (#131313).
*   **Panel Layer:** `surface_container` (#20201f).
*   **Raised Technical Data:** `surface_container_high` (#2a2a2a).
*   **Active Hover/Nesting:** `surface_container_highest` (#353535).

### The "Glass & Gradient" Rule
While the system is industrial, we avoid "flatness" by using **.glass-dark** overlays.
*   **Floating Modals:** Use `surface_container` at 80% opacity with a `20px` backdrop-blur. 
*   **Visual Soul:** Apply a subtle linear gradient to Primary CTAs (Transitioning from `primary` #FFC107 to `on_primary_container` #6d5100 at 135 degrees) to mimic the sheen of coated industrial steel.

---

## 3. Typography
We use a high-contrast pairing: a condensed, aggressive display face for impact and a neutral, highly legible sans-serif for technical precision.

*   **Display & Headlines (Bebas Neue / `spaceGrotesk` tokens):** Use for telemetry peaks, page titles, and large-scale status updates.
    *   *Directives:* Letter spacing should be set to `0.05em` to enhance the industrial "stenciled" look.
*   **Technical Data & Body (Inter):** All labels, values, and paragraphs.
    *   *Directives:* Use `Inter` Medium for data labels and `Inter` Mono (if available) for VIN numbers, part IDs, and coordinates to maintain a "spec-sheet" aesthetic.

---

## 4. Elevation & Depth
In this system, depth is not achieved through shadows, but through **Tonal Layering** and **Ghost Borders**.

*   **The Layering Principle:** A diagnostic card should sit as `surface_container_low` on top of the `surface` background. No shadow is required; the shift in hex value provides the "lift."
*   **The "Ghost Border" Fallback:** For ultra-dense technical layouts where tonal shifts aren't enough, use a 1px border using `outline_variant` (#4f4632) at **20% opacity**. It should be felt, not seen.
*   **Ambient Glow:** For the most critical "Active" states (e.g., an engine alert), do not use a drop shadow. Use a "Glow" effect: a `4px` blur of the `primary` or `error` color at 30% opacity.

---

## 5. Components

### Buttons & CTAs
*   **Primary:** Solid `primary` (Safety Yellow), `0px` border-radius. Text is `on_primary` (Black).
*   **Secondary:** Ghost style. `1px` border of `secondary` (Mechanic Teal), `0px` radius. 
*   **States:** On hover, Primary buttons shift to `primary_fixed_dim`. No movement or "lift"—just a sharp color snap.

### Technical Data Cards
*   **Style:** No rounded corners (`0px`). Use `surface_container_high` background.
*   **Header:** A 2px vertical accent bar of `secondary` on the left side of the card to denote "System Active."
*   **Spacing:** Use `spacing.4` (0.9rem) for internal padding to maintain density without clutter.

### Inputs & Fields
*   **Base:** Underline-only or subtle `surface_container_highest` fill. 
*   **Focus State:** The bottom border transforms into a 2px `primary` (Safety Yellow) line. Helper text must be `label-sm` in `on_surface_variant`.

### Gauges & Progress
*   **Track:** `surface_container_lowest`.
*   **Indicator:** Solid `secondary` (Teal). For warnings, the bar snaps to `error` (Red).
*   **Animation:** Linear and fast (150ms). No "bouncy" easing; this is a precision machine.

---

## 6. Do’s and Don'ts

### Do:
*   **Do** use `0px` radius for everything. Sharp corners imply precision and industrial strength.
*   **Do** use "Safety Yellow" sparingly. If everything is yellow, nothing is important.
*   **Do** embrace asymmetry. A large telemetry number on the left balanced by small metadata on the right creates a sophisticated editorial flow.

### Don’t:
*   **Don’t** use standard shadows. If a component needs to stand out, use a color shift or a "Ghost Border."
*   **Don’t** use dividers. Use `spacing.8` (1.75rem) of vertical whitespace or a change in surface color to separate content blocks.
*   **Don’t** use soft transitions. Use sharp, high-contrast state changes to mimic mechanical switches.