export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { code } = req.body;
  
  // ДЛЯ ТЕСТА - код 123456 всегда работает
  if (code === '123456') {
    return res.json({
      success: true,
      user: {
        id: 1,
        username: 'TestUser',
        telegramId: '708894877',
        role: 'user'
      }
    });
  }
  
  res.json({ success: false, error: 'Неверный код' });
        }
