# Design Guidelines: Resume Skill Extraction Application

## Design Approach: Utility-Focused Design System
**Selected System:** Material Design with modern adaptations
**Justification:** This productivity-focused application requires clean, efficient interfaces that prioritize usability and trust for professional users uploading sensitive documents.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary:**
- Background: 215 25% 8%
- Surface: 215 20% 12% 
- Primary: 210 100% 65%
- Success: 142 76% 45%
- Text: 210 15% 95%

**Light Mode Primary:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 210 85% 45%
- Success: 142 65% 40%
- Text: 215 25% 15%

### B. Typography
**Font Stack:** Inter via Google Fonts CDN
- Headers: 600-700 weight, 1.2 line height
- Body: 400-500 weight, 1.6 line height
- UI Elements: 500 weight, 1.4 line height

### C. Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16
- Container max-width: 6xl (1152px)
- Section padding: py-12 to py-16
- Component spacing: gap-6 to gap-8

### D. Component Library

**Authentication:**
- Prominent Google OAuth button with official branding
- Clean login card with subtle shadow elevation
- Trust indicators and security messaging

**File Upload Interface:**
- Large drag-and-drop zone with dashed border
- Visual feedback states (hover, dragover, uploading)
- File validation messaging with clear error states
- Progress indicators for upload and processing

**Skills Display:**
- Categorized skill chips with subtle backgrounds
- Clean typography hierarchy for skill lists
- Visual separation between detected vs suggested skills
- Confidence indicators where applicable

**Navigation:**
- Minimal top navigation with user avatar
- Dashboard layout with sidebar for future features
- Breadcrumb navigation for multi-step processes

**Data Visualization:**
- Simple progress bars for skill matching
- Clean cards for resume summaries
- Minimal charts if showing ATS scores

### E. Animations
Use sparingly:
- Subtle fade-ins for skill results
- Upload progress animations
- Loading states for PDF processing

## Key Design Principles
1. **Professional Trust:** Clean, business-appropriate aesthetic
2. **Process Clarity:** Clear visual feedback at each step
3. **Data Security:** Visual cues that emphasize privacy and security
4. **Accessibility:** High contrast ratios and keyboard navigation
5. **Efficiency:** Minimal clicks to core functionality

## Layout Approach
- Single-page application with clear sections
- Dashboard-style layout post-authentication
- Mobile-first responsive design
- Generous whitespace to reduce cognitive load

This design emphasizes functionality over flashiness, building user confidence through clean, professional interfaces that make the resume analysis process feel secure and efficient.