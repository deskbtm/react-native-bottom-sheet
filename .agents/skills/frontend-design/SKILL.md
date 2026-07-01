---
name: frontend-design
description: Create distinctive, production-grade React Native UI with high design quality. Use this skill when the user asks to build components, screens, or polished interfaces in this Expo app. Generates creative, refined TypeScript/React Native code that avoids generic AI aesthetics.
---

This skill guides creation of distinctive, production-grade React Native interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides UI requirements: a component, screen, application, or interface to build. They may include context about purpose, audience, or technical constraints.

**Stack**: Expo SDK 56, React Native, TypeScript. Follow project conventions in `.cursor/rules/expo-project.mdc`. For navigation, routing, and Expo-specific UI patterns, also consult `building-native-ui`.

## Design Thinking

Before coding, understand the context and commit to a **bold** aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these for inspiration but design one that is true to a single, coherent aesthetic.
- **Constraints**: Technical requirements (framework, performance, accessibility, platform).
- **Differentiation**: What makes this **unforgettable**? What is the one thing someone will remember?

**Critical**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work—the key is intentionality, not intensity.

Then implement working React Native code (components, styles, animations, etc.) that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## React Native UI Aesthetics Guidelines

Focus on:

- **Typography**: Load distinctive fonts with `expo-font` (Google Fonts or bundled assets). Avoid relying only on system defaults; pair a characterful display font with a clear body font. Define reusable text styles (fontSize, fontWeight, letterSpacing, lineHeight) and apply them consistently for hierarchy.
- **Color & Theme**: Commit to a cohesive palette. Use shared color constants or a small theme module for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Respect light/dark modes via `useColorScheme` when appropriate.
- **Motion & Feedback**: Use `react-native-reanimated` (entering/exiting, layout, shared values, gestures) for transitions and micro-interactions. Prioritize high-impact moments: one well-orchestrated entrance with staggered reveals creates more delight than scattered motion. Use `expo-haptics` on iOS for tactile feedback on key actions.
- **Spatial Composition**: Unexpected layouts. Asymmetry, overlap, diagonal flow, grid-breaking elements. Generous negative space OR controlled density. Implement with `View`, `Stack`-style `position: 'absolute'`, flexbox (`gap`, `flex`, `alignSelf`), and scroll containers (`ScrollView`, `FlatList`).
- **Backgrounds & Visual Depth**: Create atmosphere and depth rather than defaulting to flat fills. Use `LinearGradient` (when available), layered views, `expo-blur` / `expo-glass-effect`, transparency, and CSS `boxShadow` for depth. Add contextual effects—gradient meshes, geometric patterns, layered transparencies, strong shadows, decorative borders—that match the overall aesthetic.

## Project Conventions

When implementing in this repo:

- Components live in `src/components/<feature-kebab>/` with a public `index.ts` barrel; screens in `src/navigation/`.
- File names: `PascalCase.tsx` matching the primary export; hooks as `useCamelCase.ts`.
- Imports via `@/*` aliases; prefer the barrel over deep paths.
- Use `StyleSheet.create()` for reusable styles; inline styles for one-offs or dynamic values.
- Use CSS `boxShadow` — not legacy `shadow*` props or Android `elevation`.
- Use `{ borderCurve: 'continuous' }` for rounded corners unless creating a capsule shape.
- Account for safe areas (`react-native-safe-area-context` or scroll `contentInsetAdjustmentBehavior="automatic"`).
- Prefer `Pressable` over `TouchableOpacity` for new interactive elements.
- Use `expo-image` instead of `Image` when loading remote or optimized assets.
- Run `pnpm oxlint` and `pnpm fmt` on touched files before finishing.

NEVER use generic AI aesthetics: overused fonts (system-only with no hierarchy), clichéd color schemes (especially purple gradients on white), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, and different aesthetics. NEVER converge on common choices (e.g. Space Grotesk) across generations.

**Important**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing and typography. Elegance comes from executing the vision well.

Remember: extraordinary creative work is possible. Don't hold back—show what can be created when committing fully to a distinctive React Native UI.
