# Testing Guide

## Overview

FitEthio uses Jest and React Testing Library for unit and integration tests.

## Setup

### Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
```

This is already configured in `package.json`.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test:watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run a specific test file
```bash
npm test -- ErrorBoundary
```

## Test Structure

Tests are located in `__tests__/` directory and follow the same structure as the source code:

```
__tests__/
├── components/
│   ├── ErrorBoundary.test.tsx
│   ├── Header.test.tsx
│   └── ...
├── lib/
│   ├── supabase.test.ts
│   └── foods.test.ts
└── app/
    └── api/
        └── groq.test.ts
```

## Writing Tests

### Component Test Example

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Testing with Supabase

```typescript
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    }),
  }),
}));
```

### Testing API Routes

```typescript
import { POST } from '@/app/api/groq/mode1/route';

describe('Groq API', () => {
  it('returns a valid response', async () => {
    const request = new Request('http://localhost:3000/api/groq/mode1', {
      method: 'POST',
      body: JSON.stringify({ meal: 'injera' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

## Coverage Goals

Target coverage thresholds:
- **Statements:** 70%
- **Branches:** 70%
- **Functions:** 70%
- **Lines:** 70%

View coverage report:
```bash
npm test -- --coverage
```

## Best Practices

1. **Test behavior, not implementation:** Focus on what the component does, not how it does it
2. **Use descriptive test names:** `it('displays error message when API fails')`
3. **Keep tests simple:** Each test should verify one thing
4. **Mock external dependencies:** Mock API calls, database, etc.
5. **Test accessibility:** Use `getByRole` instead of `getByTestId` when possible
6. **Clean up after tests:** Use `afterEach` to reset mocks

## Common Patterns

### Testing Async Components

```typescript
it('loads data on mount', async () => {
  render(<MyComponent />);
  const data = await screen.findByText('Loaded data');
  expect(data).toBeInTheDocument();
});
```

### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event';

it('updates input value', async () => {
  const user = userEvent.setup();
  render(<Input />);
  const input = screen.getByRole('textbox');
  await user.type(input, 'Hello');
  expect(input).toHaveValue('Hello');
});
```

### Testing Context Providers

```typescript
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/providers';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};
```

## Debugging Tests

### Debug Component Output

```typescript
import { render, screen } from '@testing-library/react';

it('debugs component', () => {
  const { debug } = render(<MyComponent />);
  debug(); // Prints component HTML to console
});
```

### Check Accessible Name

```typescript
it('checks accessible name', () => {
  render(<button>Click me</button>);
  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
});
```

## CI/CD Integration

Tests run automatically on pull requests. To check locally:

```bash
npm run lint
npm run build
npm test
```

All three must pass before merging.

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
