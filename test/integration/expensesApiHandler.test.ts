import { POST } from '../../src/app/api/expenses/route';
import { NextRequest } from 'next/server';

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

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }), // default: not authenticated
    },
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { id: 'mock-id', user_id: 'user-123', amount: 12.5 }, error: null }),
  })),
}));

describe('/api/expenses handler', () => {
  it('returns 401 if not authenticated', async () => {
    const req = {
      json: async () => ({ text: 'Spent $12.50 at Starbucks for latte' }),
      cookies: {},
    } as unknown as NextRequest;
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json.error).toMatch(/not authenticated/i);
  });

  it('returns 201 and expense if authenticated', async () => {
    // Patch the mock to return a user
    const { createServerClient } = require('@supabase/ssr');
    createServerClient.mockImplementationOnce(() => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
      },
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'mock-id', user_id: 'user-123', amount: 12.5 }, error: null }),
    }));
    const req = {
      json: async () => ({ text: 'Spent $12.50 at Starbucks for latte' }),
      cookies: {},
    } as unknown as NextRequest;
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.expense).toBeDefined();
    expect(json.expense.user_id).toBe('user-123');
    expect(json.expense.amount).toBe(12.5);
  });
}); 