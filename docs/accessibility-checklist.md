# LucidFlow Accessibility Checklist

**Test Date:** [To be completed during manual testing]  
**Tester:** [To be completed during manual testing]  
**Tool:** axe DevTools, WAVE, browser inspector, and keyboard navigation  
**Status:** Manual verification and automated scan required

---

## Page Structure & Semantics

### Heading Hierarchy

- [ ] Exactly one H1 per page
- [ ] H1 is the main page title or primary heading
- [ ] Heading order is logical (no skipping from H1 to H3)
- [ ] Each section has appropriate heading level
- [ ] Headings describe content accurately

**Test:** DevTools Inspector → Elements → Search for `<h1>`, `<h2>`, `<h3>` tags

### Landmarks

- [ ] `<header>` wraps top navigation
- [ ] `<nav>` wraps primary navigation
- [ ] `<main>` wraps main content
- [ ] `<section>` wraps distinct content sections
- [ ] `<footer>` wraps footer content
- [ ] At least one landmark per page

**Test:** axe DevTools → Landmarks tab

### Semantic HTML

- [ ] Buttons use `<button>` tag (not `<div>` or `<a>` styled as button)
- [ ] Links use `<a>` tag with href (not `<div>` or `<span>`)
- [ ] Form inputs use proper `<input>`, `<textarea>`, `<select>`
- [ ] Lists use `<ul>`, `<ol>`, `<li>` tags
- [ ] Images use `<img>` with alt text
- [ ] Decorative elements use `aria-hidden="true"`

**Test:** DevTools Inspector → check element tags

---

## Keyboard Navigation

### Tab Order & Focus

- [ ] All interactive elements are focusable (buttons, links, form inputs)
- [ ] Tab order follows visual reading order (left-to-right, top-to-bottom)
- [ ] Focus is visible (outline or highlight on every focused element)
- [ ] Focus outline color contrasts with background (WCAG AA: 3:1)
- [ ] Focus outline thickness is at least 2px
- [ ] No keyboard trap (can escape all modals/widgets)
- [ ] Escape key closes modals/dropdowns
- [ ] Enter key activates buttons and submits forms
- [ ] Space key toggles checkboxes and buttons

**Test:** Press Tab repeatedly to navigate, Shift+Tab to go backward

### Form Keyboard Access

- [ ] Tab order in forms is logical
- [ ] All form fields are labeled and associated with labels
- [ ] Required fields are marked (via required attribute or aria-required)
- [ ] Form can be submitted with keyboard (Tab to submit, Enter to activate)
- [ ] Form validation errors are announced or visually distinct
- [ ] Error recovery is possible without re-entering all data

**Test:** Fill form using only Tab, Shift+Tab, Space, and Enter

### Accordion / Collapsible Sections

- [ ] Accordion buttons are focusable
- [ ] Space or Enter key toggles accordion
- [ ] aria-expanded attribute reflects state
- [ ] Content panel is associated with button via aria-controls
- [ ] Expanded state is announced to screen readers

**Test:** Tab to accordion button, press Space/Enter to expand, verify announcement

### Video Player

- [ ] Play button is focusable and labeled
- [ ] Play button is announced as "button: Play [video name]"
- [ ] Video controls are keyboard accessible if custom
- [ ] Modal focus trap (focus does not escape modal)
- [ ] Escape key closes modal
- [ ] Focus returns to play button after close

**Test:** Tab to play button, press Enter, verify modal, press Escape

### Mobile Menu

- [ ] Menu toggle button is labeled (aria-label or visible text)
- [ ] aria-expanded attribute reflects open/closed state
- [ ] Menu links are focusable when open
- [ ] Escape key closes menu
- [ ] Focus trap in open menu (optional but recommended)

**Test:** Keyboard and screen reader (NVDA, JAWS, VoiceOver)

---

## Form Accessibility

### Form Labels & Instructions

- [ ] Every form field has a visible, associated label
- [ ] Label text uses `<label>` tag with for attribute or wraps input
- [ ] Required fields are marked (visually + via required attribute)
- [ ] Helper text or instructions are programmatically associated (aria-describedby)
- [ ] Form field errors have associated error messages

**Test:** DevTools Inspector → right-click field → inspect, verify label association

### Form Validation & Errors

- [ ] Validation errors are announced to screen readers
- [ ] Error messages are linked to fields (aria-describedby or aria-owns)
- [ ] Errors are not indicated by color alone (also use icon, text, or style)
- [ ] Error messages are specific (not just "invalid input")
- [ ] Error recovery does not require re-entering all data
- [ ] Success is clearly announced (redirect or confirmation message)

**Test:** Submit empty required field, verify error is announced and field is focused

### Consent Checkbox

- [ ] Checkbox label is visible and readable
- [ ] Label clearly states what is being consented to
- [ ] Checkbox is keyboard accessible (Space to toggle)
- [ ] Required consent is enforced (form cannot submit without it)
- [ ] Unchecked state shows validation error with actionable message

**Test:** Tab to checkbox, press Space to toggle, verify state change

---

## Images & Media

### Image Alt Text

- [ ] Every meaningful image has concise, descriptive alt text
- [ ] Alt text describes the image content, not "image of" or "picture"
- [ ] Decorative images have empty alt text (alt="")
- [ ] Background images that convey meaning have text alternative
- [ ] Logo images include company name in alt text

**Test:** DevTools Inspector → right-click image → inspect img → check alt attribute

**Example:**
- ✅ `alt="LucidFlow dashboard showing compliance scan results"`
- ❌ `alt="image of dashboard"`
- ✅ `alt=""` (decorative)

### Video Accessibility

- [ ] Video has a text transcript available
- [ ] Video has captions or transcription (for audio content)
- [ ] Video player controls are keyboard accessible
- [ ] Play button describes the video content
- [ ] Video does not autoplay
- [ ] If autoplaying, sound does not play

**Test:** Look for transcript link, play video, verify caption availability

### PDF & Document Links

- [ ] Document links describe content (`<a href="...">PDF: Company Report</a>`)
- [ ] Link announces file type and size if applicable
- [ ] PDF is accessible (or alternatives provided)

---

## Color & Contrast

### Text Contrast (WCAG AA Standard)

- [ ] Regular text (< 18px): contrast ratio ≥ 4.5:1
- [ ] Large text (≥ 18px or ≥ 14px bold): contrast ratio ≥ 3:1
- [ ] Disabled text is still readable (not too light)
- [ ] Links in body text are distinct from surrounding text

**Test:** axe DevTools → Color contrast tab, or use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Color as Status Indicator

- [ ] Red/green distinction is not the only way to show status
- [ ] Errors use red + icon or red + text label
- [ ] Success uses green + icon or green + text label
- [ ] Info/warnings use distinct symbols in addition to color

**Test:** Take a grayscale screenshot and verify status is still clear

### Focus Indicators

- [ ] Focus outline is visible for all interactive elements
- [ ] Focus outline has sufficient contrast (WCAG: 3:1)
- [ ] Focus outline is not thin or hard to see (≥ 2px recommended)
- [ ] Focus outline is not suppressed globally (no `outline: none` without replacement)

**Test:** Tab through page, verify focus outline is always visible

---

## Interactive Components

### Buttons

- [ ] Buttons have visible, descriptive labels (not just icons)
- [ ] Icon-only buttons have aria-label or visible tooltip
- [ ] Button purpose is clear from label and context
- [ ] Buttons are at least 44px × 44px (mobile touch target)
- [ ] Button states are visually distinct (hover, focus, active, disabled)
- [ ] Disabled buttons are not focusable or clearly indicated as disabled

**Test:** Inspect button, check aria-label or visible text

### Links

- [ ] Link text is descriptive (not "click here" or "more")
- [ ] Link text is unique within page context
- [ ] Icon links have aria-label
- [ ] Links are 44px × 44px minimum (mobile)
- [ ] Link underline is visible (color + underline, not color alone)
- [ ] Focus state is visible

**Test:** Tab through links, verify text is descriptive

### CTA Buttons

- [ ] CTA text is action-oriented ("Schedule a Demo", "Download", "Learn More")
- [ ] CTA button is clearly visible and distinct
- [ ] CTA text does not say "click here" or "submit"
- [ ] CTA is accessible via keyboard
- [ ] CTA is announced correctly to screen readers

**Test:** Tab to CTA, press Enter, verify action occurs

---

## Dynamic Content & Interactions

### Modals

- [ ] Modal title is announced
- [ ] Focus is trapped in modal (Tab cycles within modal only)
- [ ] Escape key closes modal
- [ ] Focus returns to trigger element after modal closes
- [ ] Modal background is inert (not focusable)
- [ ] aria-modal="true" is present on modal dialog
- [ ] Modal has aria-labelledby pointing to title

**Test:** Tab in modal, verify you cannot Tab to background; press Escape; verify focus returns

### Alerts & Announcements

- [ ] Alert messages use `<div role="alert">`
- [ ] Alert content is announced immediately to screen readers
- [ ] Alert is distinct visually (color, icon, positioning)
- [ ] User can dismiss alert (optional but preferred)

**Test:** NVDA/JAWS should announce alert text immediately

### Expandable Sections (Accordions, "More Details")

- [ ] Heading/button is keyboard accessible
- [ ] aria-expanded attribute reflects state
- [ ] aria-controls points to expanded content
- [ ] Content panel has role="region" and aria-labelledby
- [ ] State change is announced

**Test:** Tab to heading, press Space/Enter, verify expansion; tab again, verify collapse

---

## Screen Reader Testing

### With Screen Reader (NVDA / JAWS / VoiceOver)

- [ ] Page title is announced
- [ ] Main heading is announced
- [ ] Navigation landmarks are discoverable
- [ ] Form fields are announced with labels and requirements
- [ ] Buttons are announced as buttons with descriptive labels
- [ ] Links are announced as links with descriptive text
- [ ] List structure is announced (list, n items)
- [ ] Table structure is announced (if present)
- [ ] Image alt text is announced
- [ ] Errors are announced and associated with fields
- [ ] Success is announced after form submission
- [ ] Modal title and content are announced
- [ ] Video player controls are announced

**Test:** Use NVDA (free, Windows), JAWS (paid, Windows), or VoiceOver (built-in, macOS/iOS)

---

## Motion & Animation

### prefers-reduced-motion

- [ ] `prefers-reduced-motion: reduce` is respected
- [ ] Animations are paused or simplified for users with motion preference
- [ ] Page remains fully functional without animations
- [ ] Content does not auto-scroll or auto-play

**Test:** DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion

### Animation Best Practices

- [ ] Animations do not flash more than 3 times per second
- [ ] Animations do not use red/blue flashing (seizure risk)
- [ ] Auto-playing video/GIFs have pause controls
- [ ] Parallax or moving backgrounds do not interfere with reading

---

## Mobile Accessibility

### Touch Targets

- [ ] All buttons and links are at least 44px × 44px (WCAG: 44x44px recommended)
- [ ] Touch targets are spaced at least 8px apart
- [ ] Small buttons are not clustered together
- [ ] Form inputs have adequate height (≥ 44px)

**Test:** Right-click element → Inspect → check computed width/height

### Mobile Screen Reader

- [ ] VoiceOver (iOS) / TalkBack (Android) navigate page correctly
- [ ] Touch targets are announced
- [ ] Form labels are associated
- [ ] Page is usable with screen reader

**Test:** Enable screen reader on iOS (Settings → Accessibility → VoiceOver) or Android (Settings → Accessibility → TalkBack)

### Mobile Keyboard

- [ ] Virtual keyboard does not obscure form fields
- [ ] Input type is correct (email, tel, number keyboard appears)
- [ ] Form submission works with soft keyboard

---

## Page Performance & UX

### Loading & Clarity

- [ ] Page loads without layout shift (CLS < 0.1)
- [ ] Content is not blocked by ads or popups
- [ ] Page purpose is clear immediately

### Readability

- [ ] Font size is at least 14px (better: 16px)
- [ ] Line height is sufficient (1.5x or greater)
- [ ] Line length is 50-80 characters (columns should not be too wide)
- [ ] Text color is not too light or too dark

---

## Checklist Summary

**Automated Scans:**
- [ ] axe DevTools: No violations
- [ ] WAVE: No errors
- [ ] Lighthouse Accessibility: Score ≥ 90

**Manual Tests Completed:** ___ / ___

**Issues Found:** ___

**Blockers:** [ ] None [ ] Critical [ ] High [ ] Medium

**Compliant with WCAG 2.1 Level AA:** [ ] Yes [ ] No (requires fixes)

---

## Notes

Document any deviations or accessibility features discovered:

```
[Add notes here]
```

---

## Sign-Off

**Tested By:** ________________  
**Date:** ________________  
**Status:** ________________  
**Approved By:** ________________

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
