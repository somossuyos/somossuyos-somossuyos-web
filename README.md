# Somos Suyos - Web Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com/)
[![Cypress](https://img.shields.io/badge/Cypress-13.14.2-green)](https://www.cypress.io/)

## Description

**Somos Suyos** is a modern web platform built with Next.js that serves as the main website for a religious/spiritual organization. The platform offers multiple functionalities including experience management, events, online store, blog, donations, and more.

## Main Features

### Homepage
- Hero section with background video
- Featured upcoming experiences
- Image gallery with scroll
- YouTube channel integration
- Donations section
- Upcoming events

### Experiences and Events
- Experience registration system
- Event management with dates and locations
- Categorization by type (In-person/Online)
- Speaker system with profiles
- Experience statuses (Active, Finished)
- Filters by theme and category

### Online Store
- Product catalog with categories
- Shopping cart system
- Color and size selectors
- Inventory management
- Integrated checkout process

### Blog and Resources
- Blog system with articles
- Content categorization
- Course and training links

### Donations System
- Wompi payment integration
- Custom donation modal
- Experience-based donation management

### Additional Features
- Contact form
- Conference scheduling
- Floating WhatsApp button
- Calendar system
- Moodle integration

## Technologies Used

### Frontend
- **Next.js 15.3.4** - React framework with SSR
- **React 18** - User interface library
- **TypeScript 5** - Static typing for JavaScript
- **Tailwind CSS 3** - Utility CSS framework

### State Management
- **Redux Toolkit** - Global state management
- **React Redux** - Redux integration with React

### UI/UX
- **Embla Carousel** - Carousels and sliders
- **Lucide React** - Vector icons
- **React Fast Marquee** - Marquee effects
- **React Responsive** - Responsive design

### Utilities
- **Luxon** - Date and time handling
- **Matter.js** - 2D physics for animations
- **Sharp** - Image processing

### Testing
- **Cypress 13.14.2** - End-to-end testing
- **ESLint** - Code linting

### DevOps
- **Azure DevOps** - CI/CD pipeline
- **GitHub** - Version control

## Project Architecture

### Directory Structure
```
src/
├── Components/        # React components organized by functionality
├── customHooks/       # Custom hooks
├── entities/          # Entities and data types
├── infrastructure/    # Infrastructure layer (repositories, DTOs)
├── redux/             # Global state with Redux
├── utils/             # Utilities and helpers
└── Fonts/             # Custom fonts
```

### Design Patterns
- **Layered Architecture** - Clear separation between components, business logic, and data
- **Repository Pattern** - Data access abstraction
- **DTO Pattern** - Data transfer between layers
- **Custom Hooks** - Reusable component logic

### State Management
- **Redux Toolkit** for global state (cart, checkout)
- **Local state** for specific components
- **Server State** for CMS data

## Installation and Configuration

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://NOA-EXPERIENCE@dev.azure.com/NOA-EXPERIENCE/somossuyos/_git/web-main-somossuyos
cd web-main-somossuyos

# Install dependencies
npm install
# or
yarn install
```

 

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm run cypress:open # Open Cypress for E2E testing

# SEO
npm run sitemap      # Generate sitemap
```

## Testing

The project uses **Cypress** for end-to-end testing:

```bash
# Open Cypress
npm run cypress:open

# Run tests in headless mode
npx cypress run
```

### Available Tests
- `contact.cy.ts` - Contact form
- `donations.cy.ts` - Donations system
- `experiences.cy.ts` - Experience management
- `scheduleConference.cy.ts` - Conference scheduling

## Customization

### Custom Fonts
The project includes custom fonts:
- Dark Twenty
- Futura (various variants)
- Stretch Pro
- Product Sans

### Theme Colors
```css
--pale-skin: #EDDDD5
--gold: #CFC6B1
--custom-red: #F79B9B
```

### Tailwind Configuration
- Custom configuration in `tailwind.config.ts`
- Custom colors, fonts, and shadows
- Support for project-specific components

## Responsive Design

The platform is fully optimized for mobile devices:
- Mobile-first design
- Responsive breakpoints
- Adaptive components
- Mobile-optimized navigation

## Production Configuration

### Build and Deploy
```bash
# Build for production
npm run build

# Verify build
npm run start
```

### Optimizations
- **Image Optimization** with Next.js
- **Automatic Code Splitting**
- **Component Lazy Loading**
- **SSR/SSG** for better SEO

## Integrations

### External APIs
- **CMS API** - Content management
- **Wompi** - Payment processing
- **WhatsApp** - Communication
- **Moodle** - Learning system

### Cloud Services
- **AWS S3** - Image storage
- **Azure DevOps** - CI/CD pipeline

## Contribution

### Code Standards
- **ESLint** for consistency
- **Prettier** for formatting
- **TypeScript** for typing
- **Conventional Commits** for messages

### Workflow
1. Create feature branch from `main`
2. Develop functionality
3. Run tests and linting
4. Create Pull Request
5. Code review and merge


## Support

For technical support or questions about the project:
- **Email**: soporte@somosnoa.com
- **Documentation**: [documentation link]

---

**Somos Suyos** - Transforming lives through spiritual experiences ✨
