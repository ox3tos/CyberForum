// Хранилище кодов (временное, потом заменишь на базу)
const activeCodes = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { code } = req.body;
  
  // Проверяем код
  if (activeCodes[code]) {
    const userData = activeCodes[code];
    
    // Удаляем использованный код
    delete activeCodes[code];
    
    res.json({
      success: true,
      user: userData
    });
  } else {
    res.json({ 
      success: false, 
      error: 'Неверный или просроченный код' 
    });
  }
}
