# Contributing to Smart Leads Dashboard

Thank you for your interest in contributing! We welcome pull requests, bug reports, and feature suggestions.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/smart-leads-dashboard`
3. **Create a branch**: `git checkout -b feature/your-feature`
4. **Make changes** and test
5. **Commit**: `git commit -am 'Add feature description'`
6. **Push**: `git push origin feature/your-feature`
7. **Open a PR** with a clear description

## Development Setup

```bash
# Install dependencies
pnpm install

# Run both frontend and backend in development
npm run dev

# Or separately:
cd frontend && pnpm dev
cd backend && npm run dev
```

## Code Standards

- **TypeScript** - Strict mode enabled
- **ESLint** - Run `pnpm lint` before committing
- **Prettier** - Auto-formats code
- **Component Structure** - Use functional components with hooks

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Dependency updates

Example: `feat: add export to CSV functionality`

## Pull Request Guidelines

- Clear title and description
- Reference related issues: `Closes #123`
- Ensure tests pass
- Update documentation if needed
- Keep commits clean and atomic

## Reporting Issues

- Check existing issues first
- Provide clear reproduction steps
- Include environment details
- Share error logs or screenshots

## Questions?

Open a discussion or comment on relevant issues. Thanks for contributing! 🚀
