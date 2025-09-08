# 🚀 Chirag Sahani - Portfolio Website

A modern, interactive portfolio website built with Next.js 15, featuring stunning 3D graphics, smooth animations, and a professional dark theme design.

[![Deploy to Netlify](https://img.shields.io/badge/Deploy%20to-Netlify-blue?style=flat-square&logo=netlify)](https://www.netlify.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

### 🎨 **Modern Design**
- **Dark Theme Interface**: Professional dark color scheme with accent colors
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Interactive 3D Elements**: Engaging Three.js-powered visual effects
- **Smooth Animations**: Framer Motion animations throughout the interface

### 🛠️ **Technical Highlights**
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety and enhanced developer experience
- **Three.js Integration**: Interactive 3D graphics and animations
- **Static Export**: Optimized for fast deployment on static hosting
- **SEO Optimized**: Meta tags, structured data, and semantic HTML

### 📱 **Sections**
- **Hero Section**: Interactive 3D logo and animated introduction
- **About Section**: Personal background and professional journey
- **Projects Section**: Showcase of featured work with 3D project cards
- **Skills Section**: Technical expertise with animated skill bars
- **Contact Section**: Professional contact form and social links
- **Footer**: Additional links and information

## 🚀 Live Demo

🔗 **[View Live Portfolio](https://chirag-sahani-portfolio.netlify.app)** *(Deploy your own copy)*

## 📸 Preview

> **Note**: Add screenshots of your deployed portfolio to showcase the design and features.

<div align="center">
  <p><em>🚀 Interactive 3D Portfolio with modern design and smooth animations</em></p>
  <p><strong>Features:</strong> Dark theme • 3D graphics • Responsive design • Smooth animations</p>
</div>

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, CSS-in-JS |
| **3D Graphics** | Three.js, React Three Fiber, React Three Drei |
| **Animations** | Framer Motion, COBE |
| **Icons** | Iconify React, Tabler Icons |
| **Development** | ESLint, Prettier, Husky |
| **Deployment** | Netlify, Static Export |

## 🏗️ Project Structure

```
portfolio/
├── app/                          # Next.js App Router
│   ├── components/              # Reusable React components
│   │   ├── HeroSection.tsx     # Interactive 3D hero section
│   │   ├── AboutSection.tsx    # Personal background
│   │   ├── ProjectsSection.tsx # Portfolio showcase
│   │   ├── SkillsSection.tsx   # Technical skills
│   │   ├── ContactSection.tsx  # Contact form
│   │   ├── ThreeBackground.tsx # Global 3D background
│   │   ├── Navbar.tsx          # Navigation component
│   │   └── Footer.tsx          # Footer component
│   ├── layout.tsx              # Root layout
│   ├── page.tsx               # Home page
│   ├── globals.css            # Global styles
│   ├── icon.tsx               # Favicon generator
│   └── apple-icon.tsx         # Apple touch icon
├── lib/                       # Utility functions
├── public/                    # Static assets
├── .env.example             # Environment variables template
├── netlify.toml              # Netlify configuration
├── next.config.ts            # Next.js configuration
├── postcss.config.mjs        # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm 10+** or **yarn 1.22+**
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chiragSahani/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Set up environment (optional)**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys if needed
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run export` | Generate static export |
| `npm run lint` | Run ESLint and TypeScript checks |
| `npm run type-check` | Run TypeScript type checking |
| `npm run preview` | Preview static build locally |

## ⚡ Quick Customization

Before deploying, update these files with your information:

| File | What to Update |
|------|---------------|
| `app/layout.tsx` | Site title, description, and metadata |
| `app/components/HeroSection.tsx` | Your name, title, and introduction |
| `app/components/AboutSection.tsx` | Personal background and experience |
| `app/components/ProjectsSection.tsx` | Your projects and work samples |
| `app/components/SkillsSection.tsx` | Technical skills and expertise |
| `app/components/ContactSection.tsx` | Contact information and links |

## 🌐 Deployment

### Deploy to Netlify (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Connect to Netlify**
   - Fork this repository
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `out`

3. **Environment Variables**
   ```env
   NODE_VERSION=20
   NPM_VERSION=10
   ```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Other Static Hosts

The `out` directory contains all static files for deployment to any static hosting service.

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Contact Form (Optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_USER_ID=your-user-id
```

### Customization

1. **Personal Information**: Update `app/layout.tsx` metadata and component content
2. **Content**: Modify component files in `app/components/` to add your projects and skills
3. **Styling**: Customize colors and themes in `app/globals.css` (see Design System below)
4. **3D Elements**: Adjust animations in Three.js components
5. **Environment**: Copy `.env.example` to `.env.local` and add your API keys

## 🎨 Design System

### Colors

```css
/* Primary Colors */
--primary-blue: #3b82f6;
--primary-cyan: #06b6d4;
--accent-purple: #8b5cf6;

/* Background */
--bg-primary: #000000;
--bg-secondary: #111111;

/* Text */
--text-primary: #ffffff;
--text-secondary: #a1a1aa;
```

### Typography

- **Primary Font**: Geist (400, 600, 700)
- **Headings**: Bold, large sizes with proper contrast
- **Body**: Medium weight, optimized for readability

## 🔍 SEO Features

- ✅ Meta tags optimization
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ JSON-LD structured data
- ✅ Sitemap generation
- ✅ Robots.txt
- ✅ Semantic HTML structure

## 🚀 Performance Optimizations

- ✅ Static site generation
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Minification
- ✅ Gzip compression
- ✅ CDN deployment ready

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for all new components
- Follow the existing code structure
- Add comments for complex logic
- Test on multiple devices
- Maintain responsive design

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Chirag Sahani**
- Website: [Portfolio Website](https://chirag-sahani-portfolio.netlify.app)
- LinkedIn: [Connect with me](https://linkedin.com/in/chirag-sahani)
- GitHub: [@chiragSahani](https://github.com/chiragSahani)
- Email: chirag.sahani@example.com

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and development tools
- **Tailwind CSS** - For the utility-first CSS framework
- **Three.js** - For 3D graphics capabilities
- **Framer Motion** - For smooth animations
- **Netlify** - For seamless deployment

## 📈 Stats

![GitHub repo size](https://img.shields.io/github/repo-size/chiragSahani/portfolio)
![GitHub last commit](https://img.shields.io/github/last-commit/chiragSahani/portfolio)
![GitHub issues](https://img.shields.io/github/issues/chiragSahani/portfolio)
![GitHub stars](https://img.shields.io/github/stars/chiragSahani/portfolio)

---

<div align="center">
  <p>Made with ❤️ by <strong>Chirag Sahani</strong></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>