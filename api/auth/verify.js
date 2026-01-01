import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    
    if (!code || code.length !== 6) {
      return res.json({ 
        success: false, 
        error: 'Введите 6-значный код' 
      });
    }

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

    // 2. Ищем пользователя
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

    // 4. Обновляем last_login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // 5. Логируем вход
    await supabase
      .from('logs')
      .insert({
        user_id: user.id,
        action: 'telegram_auth',
        ip: req.headers['x-forwarded-for'] || 'unknown'
      });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username || `user_${user.telegram_id}`,
        telegramId: user.telegram_id,
        role: user.role || 'user',
        avatar: user.avatar_url
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.json({ 
      success: false, 
      error: 'Внутренняя ошибка сервера' 
    });
  }
}
