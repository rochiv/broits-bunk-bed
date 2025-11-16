# Broit's Bunk Bed - Interactive Portfolio Website

## Project Concept

An innovative 3D interactive portfolio website featuring a bedroom with a bunk bed, study desk, and bookshelf. Each piece of furniture contains interactive drawers that reveal different aspects of your portfolio, skills, and interests.

## Project Architecture

### Technology Stack
- **React 18.3.1** - UI framework
- **Three.js 0.170.0** - 3D rendering engine
- **GSAP** - Animation library for smooth transitions
- **React Scripts 3.0.1** - Build tooling and hot reload

### File Structure
```
src/
├── index.js          - Main Three.js scene and React component
├── index.css         - Styling for HTML overlays
└── [future components]

public/
├── index.html        - Root HTML file
└── [assets]
```

## Technical Implementation Details

### 1. Scene Setup (Current)

**Scene Configuration:**
- Background: Purple (#663399)
- Camera: PerspectiveCamera (75° FOV, positioned at (8, 8, 8))
- Renderer: WebGL with antialiasing, shadows enabled (PCFSoftShadowMap)

**Lighting System:**
- Ambient Light: White, intensity 0.3 (base illumination)
- Directional Light: White, intensity 0.8, positioned at (4, 4, 4) with shadows
- Hemisphere Light: Sky-ground gradient, intensity 0.5

**Camera Controls:**
- OrbitControls with damping (0.25)
- Zoom range: 4 to 16 units
- Limited angles: azimuth 0 to 90°, polar max 90°

### 2. Current 3D Objects

**Bunk Bed:**
- Frame: 2×0.25×4 box at position (0, 2, 0)
- Mattress: 2×0.25×4 box at position (0, 2.25, 0)
- 4 Cylindrical legs: radius 0.1, height 2

**Table:**
- Top: 2×0.25×2 box at position (0, 1, 0)
- 4 Cylindrical legs: radius 0.1, height 1

**Room:**
- Floor: 8×8 plane, horizontal
- Left Wall: 8×8 plane, perpendicular
- Right Wall: 8×8 plane, perpendicular

**Materials:**
- Wood: MeshStandardMaterial (brown #8b4513, roughness 0.7, metalness 0.1)
- Mattress: MeshStandardMaterial (white, roughness 0.5)
- Floor/Walls: MeshStandardMaterial (gray, roughness 0.9)

**Visual Style:**
- Black edge outlines using EdgesGeometry and LineSegments
- Creates a stylized, cartoon-like appearance

### 3. Interactive System (To Be Implemented)

#### A. Raycasting System

**Purpose:** Detect which 3D object the mouse is hovering over or clicking on

**Components:**
```javascript
// Mouse position (normalized -1 to 1)
const mouse = new THREE.Vector2();

// Raycaster for intersection detection
const raycaster = new THREE.Raycaster();

// Event listeners
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);
```

**How it works:**
1. Track mouse position in normalized device coordinates (-1 to 1)
2. Update raycaster with camera and mouse position
3. Check intersections with interactive objects array
4. Determine if hovering/clicking on a drawer

#### B. Trundle Drawers

**Design:**
- 3-4 drawers positioned under the bunk bed
- Each drawer: BoxGeometry approximately 1.8×0.4×0.8
- Positioned vertically stacked below bed frame
- Small gap between drawers for visual separation

**Drawer Positions (example for 4 drawers):**
```javascript
Drawer 1: y = 0.2 (bottom)
Drawer 2: y = 0.7
Drawer 3: y = 1.2
Drawer 4: y = 1.7 (top, just below bed frame at y=2)
```

**Drawer State Management:**
```javascript
const drawers = [
  { mesh: drawer1Mesh, isOpen: false, content: 'projects' },
  { mesh: drawer2Mesh, isOpen: false, content: 'skills' },
  { mesh: drawer3Mesh, isOpen: false, content: 'experience' },
  { mesh: drawer4Mesh, isOpen: false, content: 'interests' }
];
```

#### C. Hover Effects

**Visual Feedback:**
- Default state: Normal material color
- Hover state: Emissive color added (glowing effect)
- Cursor change: pointer when hovering, default otherwise

**Implementation:**
```javascript
// On hover
drawer.material.emissive.setHex(0x555555);
document.body.style.cursor = 'pointer';

// On unhover
drawer.material.emissive.setHex(0x000000);
document.body.style.cursor = 'default';
```

#### D. Drawer Animations (GSAP)

**Open Animation:**
```javascript
gsap.to(drawer.position, {
  z: drawer.position.z + 2,  // Slide forward 2 units
  duration: 0.8,
  ease: "power2.out"
});
```

**Close Animation:**
```javascript
gsap.to(drawer.position, {
  z: originalPosition.z,
  duration: 0.6,
  ease: "power2.in"
});
```

**Rules:**
- Only one drawer can be open at a time
- Opening a new drawer automatically closes the current one
- Clicking an open drawer closes it

### 4. Content Overlay System

**Structure:**
- HTML div positioned absolutely over canvas
- Appears when drawer opens
- Contains portfolio content specific to that drawer
- Close button (X) in top-right corner

**CSS Styling:**
```css
.content-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  z-index: 1000;
}
```

**Content Categories:**

**Drawer 1 - Projects:**
- Featured projects with images
- Links to live demos and GitHub repos
- Tech stack used
- Brief descriptions

**Drawer 2 - Skills:**
- Technical skills organized by category
- Proficiency levels
- Tools and technologies

**Drawer 3 - Experience:**
- Work history
- Education
- Certifications

**Drawer 4 - Interests:**
- Personal interests
- Hobbies
- Blog posts or articles
- Fun facts

### 5. Camera Transitions

**Behavior:**
- When drawer opens: Camera smoothly moves to focus on that drawer
- When drawer closes: Camera returns to default overview position

**GSAP Camera Animation:**
```javascript
// Focus on drawer
gsap.to(camera.position, {
  x: drawerPosition.x + 3,
  y: drawerPosition.y + 1,
  z: drawerPosition.z + 3,
  duration: 1,
  ease: "power2.inOut",
  onUpdate: () => controls.update()
});

gsap.to(controls.target, {
  x: drawerPosition.x,
  y: drawerPosition.y,
  z: drawerPosition.z,
  duration: 1,
  ease: "power2.inOut"
});
```

## Development Workflow

### Hot Reload
- Run `npm start` in terminal
- Browser opens at http://localhost:3000
- Any file changes auto-reload the page
- See updates instantly

### Testing Strategy
1. Test each drawer individually
2. Verify only one drawer opens at a time
3. Check hover states work correctly
4. Ensure animations are smooth (60fps)
5. Test on different screen sizes
6. Test click detection accuracy

## Performance Considerations

### Current Performance
- Simple geometry keeps frame rate high
- Edge outlines add minimal overhead
- Shadows are optimized (1024×1024 shadow maps)

### Optimization Tips
- Keep drawer content lightweight
- Use texture compression for future assets
- Limit number of shadow-casting objects
- Consider using InstancedMesh for repeated objects

## Future Enhancements

### Phase 2 (After Initial Launch)
1. **Study Desk with Drawers**
   - 2-3 drawers on desk
   - Contains: Resume, Contact info, Social links

2. **Bookshelf**
   - Clickable books/shelves
   - Contains: Blog posts, Resources, Reading list

3. **Wall Decorations**
   - Posters (clickable)
   - Window with day/night cycle
   - Light switch for room lighting

4. **Floor Items**
   - Rug with pattern
   - Easter eggs (hidden clickables)
   - Personality items

### Phase 3 (Advanced Features)
1. **Post-Processing Effects**
   - Bloom for lights
   - Ambient occlusion for depth
   - Subtle vignette

2. **Advanced Models**
   - Import Blender models for detailed furniture
   - Add textures and materials
   - More realistic room environment

3. **Sound Design**
   - Drawer open/close sounds
   - Ambient room sound
   - Click feedback sounds
   - Background music (toggleable)

4. **Mobile Optimizations**
   - Touch gesture controls
   - Simplified graphics for mobile
   - Responsive content overlays

5. **Loading Screen**
   - Progress bar
   - Animated intro
   - Instructions for first-time visitors

## Content Strategy

### What Makes It Unique
1. **Physical Metaphor**: Drawers represent "storing" your skills/work
2. **Exploration**: Users discover content by exploring the room
3. **Personality**: The room design reflects who you are
4. **Memorable**: Unique interaction model stands out

### Content Guidelines
- Keep text concise (users prefer visual exploration)
- Use images/icons where possible
- Make links clear and prominent
- Update content regularly
- Add personal touches (photos, personality)

## Deployment

### Build Process
```bash
npm run build
```
Creates optimized production build in `/build` directory

### GitHub Pages Deployment
```bash
npm run deploy
```
Deploys to https://rochiv.github.io

### Pre-Deployment Checklist
- [ ] Test all drawer interactions
- [ ] Verify content is up-to-date
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Optimize images/assets
- [ ] Remove debug displays (angle display, stats)

## Code Organization Best Practices

### Current Structure
- Single file (index.js) with all logic
- Functions are well-documented with JSDoc comments
- Clear separation of concerns (create, init, animate)

### Future Refactoring (When Needed)
```
src/
├── index.js                 - Main entry point
├── components/
│   ├── ThreeScene.js       - Scene component
│   ├── ContentOverlay.js   - Content display component
│   └── DrawerContent.js    - Individual drawer content
├── three/
│   ├── scene.js            - Scene setup
│   ├── objects.js          - 3D object creation
│   ├── interactions.js     - Raycasting & events
│   └── animations.js       - GSAP animations
├── data/
│   └── portfolioContent.js - Content data structure
└── styles/
    └── overlay.css         - Content overlay styles
```

## Debugging Tips

### Common Issues
1. **Raycasting not working**: Check mouse coordinate normalization
2. **Animations stuttering**: Ensure GSAP and requestAnimationFrame don't conflict
3. **Hover not detecting**: Verify objects are in interactive array
4. **Content not showing**: Check z-index and overlay positioning

### Debug Tools
- Stats display (already implemented) - shows FPS
- Angle display (already implemented) - shows camera angles
- Browser DevTools for HTML/CSS debugging
- Three.js Inspector (browser extension)

## Inspiration & References

### Excellent Portfolio Examples
- Bruno Simon (bruno-simon.com) - Car racing game portfolio
- Lusion.co - Smooth 3D interactions
- Resn.co.nz - Creative excellence

### Three.js Learning Resources
- Official Three.js Examples (threejs.org/examples)
- Three.js Journey (threejs-journey.com)
- Three.js Documentation (threejs.org/docs)

### Animation Inspiration
- GSAP Examples (gsap.com/showcase)
- CodePen Three.js demos

## Project Timeline

### Day 1 (4-6 hours)
- ✅ Install GSAP
- ✅ Create documentation
- ⏳ Add raycasting system
- ⏳ Create trundle drawers
- ⏳ Implement hover effects
- ⏳ Basic drawer animations

### Day 2 (4-6 hours)
- ⏳ Content overlay system
- ⏳ Camera transitions
- ⏳ Sample portfolio content
- ⏳ Polish and refinement

### Day 3 (2-4 hours)
- ⏳ Testing and bug fixes
- ⏳ Mobile responsiveness
- ⏳ Final polish
- ⏳ Deploy to GitHub Pages

---

## Notes for Future Prompting

When working with Claude in future sessions, reference this document and specify:
- Which section you're working on
- What specific feature to implement
- Any issues encountered
- Performance considerations

Example: "Following the claude.md raycasting section, implement hover detection for the drawers"

---

Last Updated: 2025-11-15
Version: 1.0
Status: In Development
