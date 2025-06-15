import { parseExpenseWithOpenAI } from '../../src/lib/expenseParser';

process.env.OPENAI_API_KEY = 'test-key';
global.fetch = jest.fn();

describe('parseExpenseWithOpenAI', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('parses a valid expense statement', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              function_call: {
                arguments: JSON.stringify({
                  amount: 12.5,
                  currency: 'USD',
                  vendor: 'Starbucks',
                  category: 'dining out',
                  occurred_at: '2024-06-15T10:00:00Z',
                  description: 'latte',
                }),
              },
            },
          },
        ],
      }),
    });
    const result = await parseExpenseWithOpenAI('Spent $12.50 at Starbucks for latte');
    expect(result).toEqual({
      amount: 12.5,
      currency: 'USD',
      vendor: 'Starbucks',
      category: 'dining out',
      occurred_at: '2024-06-15T10:00:00Z',
      description: 'latte',
    });
  });

  it('throws if OpenAI returns no function_call', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{}] }),
    });
    await expect(parseExpenseWithOpenAI('invalid')).rejects.toThrow('No function_call result from OpenAI');
  });

  it('throws if OpenAI API returns error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    await expect(parseExpenseWithOpenAI('error')).rejects.toThrow('OpenAI API error: 500 Internal Server Error');
  });
}); 