const TELEGRAM_API = 'https://api.telegram.org/bot';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { telegram_id } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Здесь бот отправляет код в Telegram
  // Пока просто возвращаем код
  
  res.json({ 
    success: true, 
    code: code,
    message: `Код ${code} сгенерирован для ${telegram_id}`
  });
}
