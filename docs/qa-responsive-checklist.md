# LucidFlow Responsive Design QA Checklist

**Test Date:** [To be completed during manual testing]  
**Tester:** [To be completed during manual testing]  
**Status:** Manual verification required

## Overview

This checklist documents manual responsive design verification across common viewport sizes. These tests cannot be automated and require visual inspection in browser DevTools or on physical devices.

**Tool:** Use Chrome DevTools Device Emulation or open in multiple browsers at specified sizes.

---

## Desktop Viewports

### 1440 × 900 (Large Desktop)

- [ ] No horizontal scrolling
- [ ] Header is fully visible and usable
- [ ] LucidFlow logo is visible and proportionate
- [ ] Hero section displays with full background image
- [ ] Hero copy is readable (line height, contrast)
- [ ] All CTA buttons are clickable (44px+ height recommended)
- [ ] Navigation anchors work without errors
- [ ] Video modal fits and plays correctly
- [ ] Journey map displays without clipping
- [ ] Buyer path cards display in horizontal layout
- [ ] Capability cards display in grid
- [ ] How-it-works timeline is readable
- [ ] Engagement model cards stack horizontally
- [ ] FAQ accordion is readable
- [ ] Footer links are clickable
- [ ] Final CTA section is visible and actionable
- [ ] No layout overflow or content clipping

### 1280 × 800 (Standard Desktop)

- [ ] No horizontal scrolling
- [ ] All sections responsive without overflow
- [ ] Form modal fits within viewport height
- [ ] Video modal remains playable and closable
- [ ] Text remains readable at all sizes
- [ ] CTA buttons remain minimum 44px height
- [ ] Cards remain spaced appropriately

### 1024 × 768 (Older Desktop / iPad Landscape)

- [ ] No horizontal scrolling
- [ ] Layout begins responsive adjustments
- [ ] Columns may stack where needed
- [ ] Touch targets remain accessible (44px)
- [ ] Form fields visible without excessive scrolling

---

## Tablet Viewports

### 1024 × 768 (Landscape - iPad 10.2")

- [ ] No horizontal scrolling
- [ ] Header menu remains accessible
- [ ] Mobile menu toggle visible if needed
- [ ] Video modal fits within viewport
- [ ] Form modal is fully accessible
- [ ] Cards may begin stacking
- [ ] Touch targets are 44px+ (test with finger, not cursor)
- [ ] Sticky header does not obscure content anchors

### 768 × 1024 (Portrait - iPad 10.2")

- [ ] No horizontal scrolling
- [ ] Single-column layout
- [ ] Header/navigation adapts to portrait
- [ ] Form modal scrolls internally if needed
- [ ] All text remains readable
- [ ] Touch targets are 44px+ height
- [ ] Buttons and links are spacious (min 8px margin)
- [ ] No content hidden without scrolling

### 820 × 1180 (Landscape - iPad Pro 11")

- [ ] No horizontal scrolling
- [ ] Layout may use 2-column where appropriate
- [ ] Video and forms fit viewport
- [ ] Navigation remains clear
- [ ] Touch targets accessible

---

## Mobile Viewports

### 430 × 932 (Pixel 6 Portrait - Google)

- [ ] No horizontal scrolling
- [ ] Single-column layout
- [ ] Header is compact (32-48px height)
- [ ] Logo is visible and proportionate
- [ ] Mobile menu toggle works
- [ ] Hero image loads without distortion
- [ ] Hero text is readable (18px+ for body)
- [ ] Form fields full-width or properly spaced
- [ ] Submit button full-width or 44px+ clickable
- [ ] Video modal fits and plays
- [ ] Journey map is readable (may need scroll)
- [ ] FAQ items are tappable (44px+ height)
- [ ] Links are spaced (8px minimum tap spacing)
- [ ] Mobile keyboard does not hide critical fields
- [ ] Sticky header does not cover content

### 390 × 844 (iPhone 13 Portrait)

- [ ] Same checks as 430 × 932
- [ ] Layout remains stable at narrower width
- [ ] No text overflow
- [ ] Form inputs accessible and submittable
- [ ] Download PDF link works

### 375 × 667 (iPhone 6/7/8 Portrait - Smallest Modern Phone)

- [ ] No horizontal scrolling
- [ ] Text remains readable (minimum 16px for inputs)
- [ ] Form inputs stack properly
- [ ] Buttons are tall enough (44px)
- [ ] Hero content does not overlap
- [ ] Links are clearly tappable
- [ ] No tiny touch targets

### 360 × 800 (Android Portrait - Samsung S21)

- [ ] Same checks as 375 × 667
- [ ] Layout stable at 360px width
- [ ] All text readable
- [ ] Buttons clickable and sized correctly

### 667 × 375 (iPhone Landscape)

- [ ] Horizontal layout adapts
- [ ] No unexpected horizontal scrolling
- [ ] Header remains accessible
- [ ] Form modal scrolls vertically if needed
- [ ] Video modal fits within viewport
- [ ] CTA buttons remain clickable
- [ ] Hero section readable

### 844 × 390 (iPhone 13 Landscape)

- [ ] Layout adapts to landscape
- [ ] Navigation accessible
- [ ] Form fits or scrolls appropriately
- [ ] Video plays without covering controls
- [ ] No layout breakage

---

## Critical Checks for All Viewports

### Content & Typography

- [ ] No text is cut off or clipped
- [ ] Line lengths remain readable (50-75 characters for body text)
- [ ] Headings are clearly distinguished from body
- [ ] Hero copy contrast ratio is sufficient (WCAG AA: 4.5:1)
- [ ] Link text color is distinct from body (WCAG AA: 3:1)

### Navigation & Interactive Elements

- [ ] Header logo links to home
- [ ] All navigation anchors work without errors
- [ ] Mobile menu opens/closes smoothly
- [ ] Escape key closes modals
- [ ] Focus returns to trigger after modal close
- [ ] CTA buttons invoke correct actions
- [ ] Form submit button is always visible

### Media & Images

- [ ] Hero background image loads and scales properly
- [ ] LucidFlow logo is visible and proportionate
- [ ] Video poster image displays without distortion
- [ ] Video modal plays without covering header
- [ ] PDF download link works and triggers correctly
- [ ] All images have appropriate alt text (accessible via DevTools)

### Forms & Input

- [ ] Form labels are visible and associated with inputs
- [ ] Required fields are marked (WCAG: required attribute)
- [ ] Input focus outline is clearly visible
- [ ] Form validation errors are displayed
- [ ] Error messages use color + icon (not color alone)
- [ ] On mobile, virtual keyboard does not obscure critical fields
- [ ] Form success redirects to thank-you page

### Accessibility (Manual)

- [ ] All buttons are keyboard accessible (Tab key)
- [ ] Focus outline is visible against background
- [ ] Hover states are clear and distinct
- [ ] Color is not the only indicator of status
- [ ] Text contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)

### Performance & Stability

- [ ] No console errors (check DevTools Console tab)
- [ ] Page loads quickly (< 3 seconds on 4G)
- [ ] Smooth scrolling (no janky animations)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Orientation change (portrait ↔ landscape) does not break layout

---

## Orientation Change Testing

Test transitioning between portrait and landscape on each device:

- [ ] iPhone portrait → landscape: Layout adapts smoothly
- [ ] iPhone landscape → portrait: Content reflows correctly
- [ ] iPad portrait → landscape: Two-column layout (if applicable)
- [ ] iPad landscape → portrait: Reverts to single column
- [ ] No content loss during orientation change
- [ ] Focus is maintained where possible

---

## Edge Cases

### Very Large Screens (2560 × 1440)

- [ ] Content does not stretch excessively
- [ ] Max-width container prevents overly wide layouts
- [ ] Hero section remains visually balanced

### Very Small Screens (320 × 568 - iPhone 5S)

- [ ] Text remains readable
- [ ] Buttons are clickable
- [ ] No horizontal scrolling
- [ ] Form is functional (may require scrolling)
- [ ] Navigation is accessible

### Print

- [ ] Page prints without cutting off content
- [ ] Links are usable in print (show URLs or maintain underlines)
- [ ] Header/footer do not repeat unnecessarily

---

## Browser Testing

Test across major browsers to ensure consistency:

### Chrome / Edge (Chromium-based)

- [ ] Desktop (Windows)
- [ ] Mobile (Android emulation)
- [ ] Responsive mode (DevTools)

### Safari

- [ ] macOS (if available)
- [ ] iOS (iPhone/iPad, if available)
- [ ] Responsive mode

### Firefox

- [ ] Desktop (Windows/macOS if available)
- [ ] Mobile (Android emulation)
- [ ] Responsive mode

---

## Checklist Summary

**Manual Tests Completed:** ___ / ___

**Issues Found:** ___

**Blockers:** [ ] None [ ] Critical [ ] High [ ] Medium

**Ready for Production:** [ ] Yes [ ] No (requires fixes)

---

## Notes

Document any deviations, unexpected behaviors, or edge cases discovered during testing:

```
[Add notes here]
```

---

## Sign-Off

**Tested By:** ________________  
**Date:** ________________  
**Status:** ________________  
**Approved By:** ________________
