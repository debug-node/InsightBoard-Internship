# InsightBoard — Week 3 Accessibility & UX

## Accessibility Audit
The interface was reviewed for:
- Semantic structure and landmark navigation
- Keyboard navigation
- Visible focus indicators
- Interactive control labeling
- ARIA states for tabs, accordion and modal
- Screen-reader status announcements
- Reduced-motion preferences
- Mobile/responsive usability

## Improvements
1. Added a keyboard-accessible Skip to main content link.
2. Added visible `:focus-visible` styles.
3. Added ARIA roles, labels and states to interactive components.
4. Added live status announcements for dynamic UI changes.
5. Added `prefers-reduced-motion` support.
6. Added explicit button types and accessible labels.
7. Kept color contrast and readable typography in the design.

## Testing Checklist
- Tab through the page using only the keyboard.
- Use Enter/Space on buttons.
- Use Arrow Left/Right inside the tabs.
- Use Escape to close the modal.
- Verify visible focus indicators.
- Resize to mobile and test navigation.
- Run Lighthouse Accessibility audit in Chrome DevTools.

## Standards
The implementation follows practical WCAG-oriented accessibility patterns and ARIA authoring practices. Automated tools should be used alongside manual keyboard testing.
