# Visual Design (Consolidated)

## Vision
- Whimsical storybook, Dr. Seuss-inspired; warm, playful, non-intimidating.
- Depth via parallax to guide attention and convey progression.
- Motion respects `prefers-reduced-motion`; focus on gentle, non-distracting cues.

## Interactive Event Palette
- **Discovery:** search particles, spotlight, glow/target rings, soft sparkles.
- **Creation:** pen-stroke text, emergence rise, page unfold, color bloom.
- **Error/Recovery:** gentle shake, thought bubbles with guidance, spotlight on fix, encouraging tone.
- **Celebration:** confetti (motion-aware), fireworks, trophy/badges, character dance.
- **Transitions:** scene fades, page turn/wave/curtain/spiral/dissolve.
- **Content lifecycle:** edit pencil, safe delete with undo, save checkmark glow.

## Parallax Guidance (per level)
- **L0 Desk:** foreground papers/ink (fast), desk/books (medium), wall (slow) → “order from chaos.”
- **L1 Search:** search particles (fast), issue cards/avatars (medium), background patterns (slow) → “finding depth.”
- **L3 Fork Forest:** fork/near trees (fast), paths (medium), mountains/sky (slow) → “safe divergence.”
- **L4 Library:** spotlight beam/books (fast), shelves (medium), structure/stone (slow) → “seek the license.”
- **L5 Stage:** celebration effects/characters (fast), stage/audience (medium), venue (slow) → “you’re center stage.”

## Character Style
- Round, friendly proportions; expressive eyes with highlights.
- Seussian palette; wobble/bounce/sway where motion allowed.
- Examples: Grumpy Gopher (fluff, paws), Wise GNU (curved horns, mane, eyebrows), Cautious Cat (stop modal).

## Color System
- Core variables: lime #7FD656, pink #FF1493, blue #0077B6, yellow #FFD700, magenta #FF00FF, coral #FF6B6B, mint/teal #0E8C73/#00D9A3, orange #FF5722, purple #8E44AD.
- High-contrast adjustments made for buttons/links and hint summaries.

## Accessibility Guardrails
- Contrast ≥ 4.5:1; focus rings visible; touch targets ≥ 24px.
- Motion: wrap animations in `@media (prefers-reduced-motion: no-preference)`; static fallbacks.
- Decorative only uses `aria-hidden="true"`; alerts use live regions.

## Implementation Hints
- Keep parallax subtle (small translate values) to avoid nausea.
- Layer ordering: fast (foreground) > medium > slow (background); clamp transforms for mobile.
- Provide non-animated states for reduced motion and for low-power devices.
