const activeCodes = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { telegram_id, username, first_name } = req.body;
  
  // Генерируем 6-значный код
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Определяем роль (можно настроить)
  const isFounder = telegram_id === '708894877'; // Oxetos
  const isModerator = ['123456789', '987654321'].includes(telegram_id); // Модераторы
  
  // Сохраняем код
  activeCodes[code] = {
    id: Date.now(),
    username: username || first_name || `user_${telegram_id}`,
    telegramId: telegram_id,
    role: isFounder ? 'founder' : isModerator ? 'moderator' : 'user',
    joined: new Date().toISOString()
  };
  
  // Автоудаление через 5 минут
  setTimeout(() => {
    if (activeCodes[code]) delete activeCodes[code];
  }, 5 * 60 * 1000);
  
  res.json({ 
    success: true, 
    code: code,
    expires_in: 300 // 5 минут
  });
  }
