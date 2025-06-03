# Kevin Tong - Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS v4.

## 🚀 Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **shadcn/ui** - Beautiful and accessible components

## 🛠️ Development Tools

- **ESLint** - Code linting with React, TypeScript, and accessibility rules
- **Prettier** - Code formatting with Tailwind CSS class sorting
- **Husky** - Git hooks for pre-commit linting and formatting
- **lint-staged** - Run linters on staged files only
- **EditorConfig** - Consistent coding styles across editors

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🧹 Code Quality

```bash
# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check

# Lint code with ESLint
pnpm lint

# Auto-fix linting issues
pnpm lint:fix
```

## 🔧 Pre-commit Hooks

This project uses Husky and lint-staged to automatically:
- Run ESLint and fix issues
- Format code with Prettier
- Ensure code quality before commits

## 📁 Project Structure

```
src/
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts
└── main.tsx           # Application entry point

public/                 # Static assets
```

## 🎨 Features

- ✨ Modern, responsive design
- 🌙 Dark mode support
- 📱 Mobile-first responsive layout
- ♿ Accessibility focused
- 🚀 Optimized performance
- 🎯 SEO friendly

## 🚧 Development

### Adding New Components

Components are built using shadcn/ui patterns with:
- TypeScript for type safety
- class-variance-authority for variant management
- Tailwind CSS for styling
- Dark mode support

### Styling Guidelines

- Use Tailwind utility classes
- Follow the established color scheme
- Ensure dark mode compatibility
- Maintain responsive design principles

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes (pre-commit hooks will run automatically)
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ by Kevin Tong
