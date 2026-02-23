# Chakra Bio Admin Dashboard

A comprehensive admin dashboard for managing the Chakra Bio saffron e-commerce website. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## ✅ Backend API Integration Complete!

The admin frontend is now fully integrated with the Chakra Bio backend API. All features connect to real data.

### Quick Start

1. **Setup Environment**
   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   ```

2. **Start Backend** (in separate terminal)
   ```bash
   cd ../backend
   npm install
   npm run dev
   ```

3. **Start Admin Frontend**
   ```bash
   npm install
   npm run dev
   ```

4. **Login**
   - URL: http://localhost:3001
   - Use admin credentials from backend `.env`

### 📚 Documentation

- **[API Integration Summary](./API-INTEGRATION-SUMMARY.md)** - Complete overview
- **[Integration Guide](./INTEGRATION-GUIDE.md)** - Detailed usage guide
- **[Quick API Reference](./QUICK-API-REFERENCE.md)** - Quick reference card
- **[Backend API Spec](../backend/API-SPECIFICATION.md)** - Full API documentation

---

## Features

### 📊 Dashboard Overview
- Real-time analytics and statistics
- Revenue tracking with interactive charts
- Order management overview
- Quick action buttons

### 🎠 Carousel Management
- Create and manage hero carousel slides
- Image upload and management
- Slide ordering and visibility controls
- Mobile-responsive preview

### 📝 Blog Management
- Create, edit, and delete blog posts
- Rich text editor support
- SEO optimization fields
- Featured image management
- Publication scheduling

### 📂 Blog Categories
- Organize blog posts into categories
- Category hierarchy management
- SEO-friendly URL slugs
- Category-specific settings

### 📦 Product Management
- Complete product catalog management
- Product variants and pricing
- Inventory tracking
- Product images and galleries
- SEO optimization

### 🏷️ Product Categories
- Product categorization system
- Category hierarchy
- Featured category management
- Category-specific filters

### 🎓 Training Management
- Training program creation and management
- Instructor assignment
- Enrollment tracking
- Course materials management
- Certification handling

### 📞 Contact Management
- Customer inquiry management
- Support ticket system
- Priority and status tracking
- Team assignment
- Response templates

### 🏢 Company Information
- Business profile management
- Contact information
- Social media links
- Business hours configuration
- Team member profiles
- Certifications and licenses

## Tech Stack

- **Framework**: Next.js 15.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd saffron-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
saffron-dashboard/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── dashboard/           # Dashboard pages
│   │   ├── blog/           # Blog management
│   │   ├── blog-categories/ # Blog category management
│   │   ├── carousel/       # Carousel management
│   │   ├── company/        # Company information
│   │   ├── contact/        # Contact management
│   │   ├── product-categories/ # Product category management
│   │   ├── products/       # Product management
│   │   ├── training/       # Training management
│   │   └── page.tsx        # Main dashboard
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── public/                 # Static assets
├── package.json
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## Features Overview

### Dashboard Analytics
- Revenue tracking with monthly/yearly views
- Order statistics and trends
- Customer growth metrics
- Product performance analytics

### Content Management
- WYSIWYG editor for blog posts
- Image upload and management
- SEO optimization tools
- Content scheduling

### E-commerce Management
- Product catalog with variants
- Inventory management
- Order processing
- Customer management

### Training System
- Course creation and management
- Student enrollment tracking
- Certificate generation
- Progress monitoring

## Customization

### Theme Colors
The dashboard uses a saffron-themed color palette defined in `tailwind.config.js`:
- Saffron: Primary brand color
- Maroon: Secondary accent color
- Admin: Neutral grays for UI elements

### Adding New Pages
1. Create a new page in `app/dashboard/[page-name]/page.tsx`
2. Add the route to the sidebar navigation in `app/components/Sidebar.tsx`
3. Follow the existing pattern using `DashboardLayout` wrapper

### Styling
- Global styles are in `app/globals.css`
- Component-specific styles use Tailwind CSS classes
- Custom components are defined in the `@layer components` section

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
Create a `.env.local` file for environment-specific variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.