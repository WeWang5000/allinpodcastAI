export const getChatGptResponse = async (message) => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const apiKey = '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';
  const model = 'gpt-3.5-turbo';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: message }],
      model,
    }),
  });

  const data = await response.json();
  console.log(data); // Log the entire response object

  const choices = data.choices;

  if (!choices || choices.length === 0) {
    throw new Error('Invalid API response: empty choices');
  }

  const botMessage = choices[choices.length - 1].message;
  if (!botMessage || !botMessage.content) {
    throw new Error('Invalid API response: missing bot message content');
  }

  return botMessage.content;
};