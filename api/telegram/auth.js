export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { code } = req.body;
  
  // ТВОЙ TELEGRAM ID для теста
  const TELEGRAM_IDS = {
    '123456': '708894877', // Oxetos
    '654321': '123456789', // Тестовый пользователь
  };
  
  if (TELEGRAM_IDS[code]) {
    res.json({
      success: true,
      user: {
        id: 1,
        username: code === '123456' ? 'Oxetos' : 'User',
        telegramId: TELEGRAM_IDS[code],
        role: code === '123456' ? 'founder' : 'user'
      }
    });
  } else {
    res.json({ success: false, error: 'Неверный код' });
  }
}
