# Design System Implementation TODO

## Phase 1: Design Tokens
- [ ] Create `src/styles/tokens/colors.ts` - Color tokens based on current grays/blues
- [ ] Create `src/styles/tokens/typography.ts` - Font size/weight tokens
- [ ] Create `src/styles/tokens/spacing.ts` - Spacing scale
- [ ] Create `src/styles/tokens/shadows.ts` - Shadow tokens
- [ ] Create `src/styles/tokens/index.ts` - Aggregated exports
- [ ] Update `src/app/globals.css` - Use design tokens as CSS variables

## Phase 2: UI Components
- [ ] Create `src/components/ui/Button/` - Button component with CVA variants
- [ ] Create `src/components/ui/Input/` - Input component
- [ ] Create `src/components/ui/Card/` - Card component
- [ ] Create `src/components/ui/Modal/` - Modal component (for TaskModal, CalendarView)
- [ ] Create `src/components/ui/Icons/` - Icon wrapper using lucide-react

## Phase 3: Utility Updates
- [ ] Rename `src/lib/utils/classNames.ts` to `src/lib/utils.ts` (or keep and add additional utilities)
- [ ] Add helper utilities from design system (figmaSpacingToTailwind, etc.)

## Phase 4: Component Refactoring
- [ ] Update `DailyLog.tsx` to use new UI components
- [ ] Update `CategorySection.tsx` to use new UI components
- [ ] Update `TaskModal.tsx` to use new UI components and Modal
- [ ] Update `CalendarView.tsx` to use new UI components and Modal
- [ ] Update `CategoryManager.tsx` to use new UI components

## Phase 5: Testing
- [ ] Run `npm run dev` to verify everything works
