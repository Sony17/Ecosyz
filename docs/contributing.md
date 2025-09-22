# Contributing to Ecosyz

Thank you for your interest in contributing to Ecosyz! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Git
- Supabase account (for full development)

### Setup

1. **Fork and Clone**
```bash
git clone https://github.com/your-username/Ecosyz.git
cd Ecosyz
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Database Setup**
```bash
npx prisma generate
npx prisma db push
```

5. **Start Development**
```bash
pnpm dev
```

## 📋 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical fixes

### Commit Convention

```bash
type(scope): description

# Examples:
feat(auth): add Google OAuth support
fix(api): resolve profile update error
docs(readme): update installation instructions
refactor(db): optimize query performance
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Testing
- `chore` - Maintenance

### Pull Request Process

1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
   - Write clean, readable code
   - Add tests for new features
   - Update documentation
   - Follow existing code style

3. **Test Your Changes**
```bash
# Run all checks
pnpm lint
pnpx tsc --noEmit
pnpm test

# Manual testing
pnpm dev
```

4. **Commit Changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

5. **Push and Create PR**
```bash
git push origin feature/your-feature-name
# Create PR on GitHub
```

## 🛠️ Code Quality Standards

### TypeScript

- **Strict Mode**: All TypeScript rules enabled
- **Type Safety**: Avoid `any` types, use proper interfaces
- **Imports**: Use absolute imports with `@/` prefix

### React/Next.js

- **App Router**: Use new App Router patterns
- **Server Components**: Prefer server components when possible
- **Client Components**: Use `'use client'` directive when needed
- **Data Fetching**: Use server actions or API routes

### Styling

- **Tailwind CSS**: Use utility classes
- **Design System**: Follow established design patterns
- **Responsive**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation

### Code Style

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');
  return user;
};

// ❌ Avoid
const getuser = (id) => {
  return prisma.user.findUnique({where:{id}})
}
```

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API route testing
- **E2E Tests**: Critical user journey testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test -- --coverage

# Run specific test
pnpm test -- component-name.test.ts
```

### Writing Tests

```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
  it('displays user name', () => {
    render(<UserProfile user={{ name: 'John Doe' }} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## 📚 Documentation

### Code Documentation

- **Functions**: JSDoc comments for complex functions
- **Components**: Prop types and usage examples
- **APIs**: OpenAPI/Swagger documentation

### Project Documentation

- **README**: Keep updated with setup instructions
- **API Docs**: Document all endpoints
- **Architecture**: Update for major changes

## 🔒 Security

### Security Checklist

- [ ] No sensitive data in logs
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers
- [ ] Dependency updates

### Reporting Security Issues

- **DO NOT** create public issues for security vulnerabilities
- Email security concerns to: security@ecosyz.com
- Use GitHub Security Advisories for coordinated disclosure

## 🚀 Deployment

### Environment Variables

**Required for all environments:**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

**Production only:**
```env
NEXT_PUBLIC_BASE_URL=https://ecosyz.vercel.app
SENTRY_DSN= # Error tracking
```

### Deployment Checklist

- [ ] All tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Feature flags configured

## 🤝 Code Review Guidelines

### For Reviewers

- **Be constructive**: Focus on code quality and learning
- **Explain reasoning**: Why changes are needed
- **Suggest alternatives**: When rejecting approaches
- **Approve readily**: When standards are met

### For Contributors

- **Address feedback**: Respond to all review comments
- **Explain decisions**: Document architectural choices
- **Test thoroughly**: Ensure changes don't break existing functionality
- **Keep scope small**: Large PRs are harder to review

## 📋 Issue Tracking

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation updates
- `good first issue` - Ideal for newcomers
- `help wanted` - Extra attention needed

### Issue Templates

- **Bug Report**: Includes reproduction steps
- **Feature Request**: Describes desired functionality
- **Documentation**: For docs improvements

## 🎯 Contributing Areas

### High Priority

- **Authentication**: OAuth providers, security improvements
- **Search Engine**: New data sources, improved ranking
- **AI Features**: Better summarization, new capabilities
- **Performance**: Optimization and caching

### Good for Beginners

- **UI Components**: New components following design system
- **Documentation**: Writing guides and examples
- **Testing**: Adding test coverage
- **Bug Fixes**: Resolving reported issues

### Advanced

- **Database**: Schema optimization, new features
- **API Design**: New endpoints, GraphQL migration
- **Infrastructure**: Deployment, monitoring, scaling

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat (if available)

### Finding Help

1. **Check existing issues** - Your issue might already be reported
2. **Search documentation** - Many questions are answered in docs
3. **Create minimal reproduction** - For bug reports
4. **Ask in discussions** - For questions and ideas

## 🙏 Recognition

Contributors are recognized through:
- **GitHub Contributors list**
- **Changelog entries**
- **Social media mentions**
- **Community shoutouts**

## 📄 License

By contributing to Ecosyz, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Ecosyz! Your efforts help make academic research more accessible and collaborative. 🚀