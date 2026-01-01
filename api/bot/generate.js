export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { telegram_id } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000);
  
  // Сохраняем код в базу (пока заглушка)
  console.log(`Код для ${telegram_id}: ${code}`);
  
  res.json({ 
    success: true, 
    code: code.toString(),
    expires_in: 300 // 5 минут
  });
}
