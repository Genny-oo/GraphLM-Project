import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock(
  'react-router-dom',
  () => ({
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Route: ({ element }: { element: React.ReactElement }) => element,
    Link: ({
      children,
      to,
      className
    }: {
      children: React.ReactNode;
      to: string;
      className?: string;
    }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
    useLocation: () => ({ pathname: '/', state: null }),
    useNavigate: () => jest.fn()
  }),
  { virtual: true }
);

jest.mock('./pages/TreeVisualizationPage', () => () => <div>Tree Visualization Page</div>);

test('renders the Graph LM dashboard', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /graph lm/i })).toBeInTheDocument();
  expect(screen.getByText(/interactive data flow/i)).toBeInTheDocument();
});
