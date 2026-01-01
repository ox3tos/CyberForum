export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { code, telegram_id, username } = req.body;
    
    // Сохраняем в базе (пока в памяти)
    // В реальном проекте используй базу данных
    
    res.json({
      success: true,
      user: {
        id: telegram_id,
        username: username,
        token: generateToken()
      }
    });
  }
}
