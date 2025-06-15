import request from 'supertest';
import { createServer } from 'http';
import next from 'next';

jest.mock('../../src/lib/expenseParser', () => ({
  parseExpenseWithOpenAI: jest.fn().mockResolvedValue({
    amount: 12.5,
    currency: 'USD',
    vendor: 'Starbucks',
    category: 'dining out',
    occurred_at: '2024-06-15T10:00:00Z',
    description: 'latte',
  }),
}));

// This is a simplified example. In a real app, use a test server and mock Supabase auth/session.
describe('/api/expenses integration', () => {
  let server: any;
  let app: any;

  beforeAll(async () => {
    app = next({ dev: true, dir: './web' });
    await app.prepare();
    server = createServer((req, res) => app.getRequestHandler()(req, res));
    await new Promise((resolve) => server.listen(4000, resolve));
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('POST /api/expenses returns 401 if not authenticated', async () => {
    const res = await request(server)
      .post('/api/expenses')
      .send({ text: 'Spent $12.50 at Starbucks for latte' });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/not authenticated/i);
  });

  // Add more tests for authenticated requests and DB integration as needed
});

export {}; 