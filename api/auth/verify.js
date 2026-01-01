import { createClient } from '@supabase/supabase-js';

// Создай бесплатный аккаунт на supabase.com
const supabase = createClient(
  'https://твой-id.supabase.co',
  'твой-ключ'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  
  // 1. Ищем код в базе
  const { data: codeData } = await supabase
    .from('auth_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!codeData) {
    return res.json({ 
      success: false, 
      error: 'Неверный или просроченный код' 
    });
  }

  // 2. Находим пользователя
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', codeData.telegram_id)
    .single();

  if (!user) {
    return res.json({ 
      success: false, 
      error: 'Пользователь не найден' 
    });
  }

  // 3. Помечаем код как использованный
  await supabase
    .from('auth_codes')
    .update({ used: true })
    .eq('id', codeData.id);

  // 4. Обновляем время последнего входа
  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      telegramId: user.telegram_id,
      role: user.role
    }
  });
}
