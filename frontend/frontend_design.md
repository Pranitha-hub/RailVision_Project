# Design System: RailVision Newsprint Edition

The **Newsprint Edition** is the definitive visual identity of the RailVision platform. It is modeled after high-end editorial publications and financial journalism, prioritizing information density, typographic hierarchy, and absolute geometric precision.

## Core Design Principles

1. **Ink on Paper**: High contrast is mandatory. Use slightly off-white "paper" backgrounds and deep "ink" blacks.
2. **Typographic Authority**: Pair a heavy, characterful serif (Playfair Display) for headlines with a readable prose serif (Lora) and technical monospaced data (JetBrains Mono).
3. **Zero Radius**: All interactive elements (buttons, cards, inputs, modals) must have 0px border-radius. Rounded corners are prohibited in this edition.
4. **Information Density**: Maximize data visibility. Use rule lines (1px solid borders) to separate sections rather than generous padding or whitespace.
5. **The Red Lead**: Use deep scarlet red (#CC0000) sparingly for critical highlights, active tab states, and urgent alerts.

## Design Tokens

### Palette
- **Background (Paper)**: `#F9F9F7`
- **Foreground (Ink)**: `#111111`
- **Accent (Highlight)**: `#CC0000`
- **Muted (Subtle)**: `#E5E5E0`
- **Border (Rule)**: `#111111`

### Typography
- **Display**: `'Playfair Display', serif`
- **Body**: `'Lora', serif`
- **Interface**: `'Inter', sans-serif`
- **Telemetry**: `'JetBrains Mono', monospace`

## Layout Structure

- **The Masthead**: Every page begins with a centered, high-contrast title and a metadata row containing issue dates and edition names.
- **Rule Grids**: Layouts are composed of collapsed grids where components share borders (box-sizing: border-box).
- **Dot Texture**: Use a 4x4 subtle SVG dot grid to add "tactile" depth to the background.

## UI Elements

### Buttons
- **Style**: 1px solid border, uppercase, 0.15em letter-spacing.
- **Interaction**: Hard shadow hover effect (4px 4px 0px 0px black) rather than soft scaling or blurs.

### Cards
- **Style**: Simple 1px borders. Use "FIG 1.1" style metadata labels in the top-left corner of all sections.

### Imagery
- **Style**: High-contrast, monochromatic or desaturated photography. Avoid vibrant illustrations.

--- 
*Note: This is the baseline design system for RailVision. Any modifications to this system must strictly adhere to the editorial/magazine aesthetic.*