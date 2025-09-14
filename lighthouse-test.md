# Lighthouse Performance Testing Guide

## Before Optimization Baseline
Expected metrics before optimization:
- Performance: ~60-70
- FCP: ~2.5s
- TTI: ~5s
- CLS: ~0.15
- Bundle size: ~300KB+ gzipped

## After Optimization Targets
- Performance: ≥90
- FCP: <1.2s
- TTI: <3s
- CLS: <0.05
- Bundle size: <150KB gzipped

## How to Test

### 1. Build and Serve
```bash
npm run build
npm run preview
```

### 2. Run Lighthouse
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Test desktop
lighthouse http://localhost:3000 --preset=desktop --output=json --output-path=./lighthouse-desktop.json

# Test mobile
lighthouse http://localhost:3000 --preset=mobile --output=json --output-path=./lighthouse-mobile.json
```

### 3. Bundle Analysis
```bash
# Analyze bundle size
npx next build --analyze
```

### 4. Performance Monitoring
- Open DevTools → Performance tab
- Record 6 seconds of interaction
- Check for:
  - Main thread blocking <50ms
  - Frame rate 60fps
  - Memory usage stable

## Key Optimizations Applied

### Code Splitting
- Dynamic imports for heavy components
- Lazy loading with React.Suspense
- Route-based code splitting

### Three.js Optimizations
- Capped devicePixelRatio to 2
- Disabled antialiasing
- Used InstancedMesh for particles
- Implemented LOD (Level of Detail)
- Simplified geometries and materials
- Adaptive rendering based on performance

### Asset Optimization
- WebP/AVIF image formats
- Preload critical resources
- Font display: swap
- Compressed textures

### Bundle Optimization
- Tree shaking enabled
- Package import optimization
- Removed unused dependencies
- Minification and compression

### UX Improvements
- Loading screen with progress
- Skeleton loading states
- Performance monitoring
- Graceful degradation

## Expected Improvements
- 30-40 point Lighthouse score increase
- 50%+ reduction in bundle size
- 60%+ faster initial load
- Smooth 60fps animations
- Better mobile performance