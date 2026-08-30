# Contributing to FocusFlow

Thank you for your interest in contributing to FocusFlow! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [your-email@example.com].

## Getting Started

Contributions are welcome! Here's how you can get started:

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment
4. Create a branch for your changes
5. Make your changes
6. Test your changes
7. Submit a pull request

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ (for frontend development)
- Python 3.12+ (for backend development)

### Setup Instructions

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/focusflow.git
cd focusflow

# 2. Make the setup script executable and run it
chmod +x setup.sh
./setup.sh

# 3. Build and start all services
docker compose up --build -d

# 4. Open the app
open http://localhost:3001
```

### Development Workflow

```bash
# Start development servers
docker compose up -d

# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && python -m pytest

# Stop servers
docker compose down
```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, please include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Environment details** (OS, browser, Docker version)

### Suggesting Enhancements

We welcome feature requests! Please provide:

- **Clear title and description**
- **Use case** - Why is this feature needed?
- **Proposed solution** - How should it work?
- **Alternatives considered**

### Your First Contribution

Not sure where to start? Look for issues labeled:
- `good first issue` - Simple tasks for beginners
- `help wanted` - Tasks that need community help
- `documentation` - Documentation improvements

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-new-theme`
- `fix/timer-not-pausing`
- `docs/update-readme`

### 2. Make Changes

- Follow our [coding guidelines](#coding-guidelines)
- Add tests if applicable
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run all tests
cd frontend && npm test
cd backend && python -m pytest

# Manual testing
docker compose up --build
# Test at http://localhost:3001
```

### 4. Commit Changes

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add new theme selector component"
git commit -m "fix: resolve timer not pausing on tab switch"
git commit -m "docs: update API documentation"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Fill out the PR template
- Submit for review

### 7. Review Process

- Maintainers will review your PR
- Address any feedback
- Once approved, your PR will be merged

## Coding Guidelines

### General Principles

- **Write clean, readable code**
- **Follow existing patterns**
- **Keep functions small and focused**
- **Add comments for complex logic**
- **Write tests for new features**

### Frontend (Next.js/React)

- Use TypeScript for all new code
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components small and reusable
- Use React hooks appropriately

### Backend (FastAPI/Python)

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Handle errors gracefully
- Use async/await where appropriate

### Git

- Keep commits small and focused
- Write clear commit messages
- Don't commit directly to `main`
- Use feature branches

## Style Guide

### TypeScript/JavaScript

```typescript
// Use camelCase for variables and functions
const userName = "John";

// Use PascalCase for components
function UserCard() {}

// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}
```

### Python

```python
# Use snake_case for variables and functions
user_name = "John"

# Use PascalCase for classes
class UserCard:
    pass

# Use type hints
def get_user(user_id: str) -> User:
    pass
```

## Questions?

If you have questions about contributing, feel free to:

1. Open an issue with the label `question`
2. Start a discussion in the repository
3. Reach out to maintainers

Thank you for contributing to FocusFlow! 🧘
