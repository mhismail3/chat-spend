export const expenseParseFunctionSchema = {
  name: "parse_expense",
  description: "Parse a natural language expense statement into structured data.",
  parameters: {
    type: "object",
    properties: {
      amount: {
        type: "number",
        description: "The amount spent, in the user's currency.",
      },
      currency: {
        type: "string",
        description: "The 3-letter currency code (e.g., USD, EUR).",
      },
      vendor: {
        type: "string",
        description: "The merchant or place where the expense occurred.",
      },
      category: {
        type: "string",
        description: "The category of the expense (e.g., groceries, dining out). Optional.",
      },
      occurred_at: {
        type: "string",
        format: "date-time",
        description: "The ISO 8601 date and time the expense occurred. Optional, defaults to now.",
      },
      description: {
        type: "string",
        description: "A short description or note about the expense. Optional.",
      },
    },
    required: ["amount", "currency", "vendor"],
  },
};

export type ParsedExpense = {
  amount: number;
  currency: string;
  vendor: string;
  category?: string;
  occurred_at?: string;
  description?: string;
};

export async function parseExpenseWithOpenAI(nlText: string): Promise<ParsedExpense> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OpenAI API key');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expense parser. Extract structured data from user expense statements.'
        },
        {
          role: 'user',
          content: nlText,
        },
      ],
      functions: [expenseParseFunctionSchema],
      function_call: { name: 'parse_expense' },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const fnCall = data.choices?.[0]?.message?.function_call;
  if (!fnCall || !fnCall.arguments) {
    throw new Error('No function_call result from OpenAI');
  }
  const parsed: ParsedExpense = JSON.parse(fnCall.arguments);
  return parsed;
} 