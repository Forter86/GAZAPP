import nodemailer from 'nodemailer';

// Настройки SMTP для Mail.ru
const EMAIL_CONFIG = {
  smtp_server: 'smtp.mail.ru',
  smtp_port: 587,
  email: 'gazprom_zayavki_bot@mail.ru',
  password: 'LF7DuDrO3ON6dbvz55R7',
  recipient: 'arturex414@gmail.com'
};

// Создаем транспортер для отправки email
const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.smtp_server,
  port: EMAIL_CONFIG.smtp_port,
  secure: false,
  auth: {
    user: EMAIL_CONFIG.email,
    pass: EMAIL_CONFIG.password
  }
});

export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const {
      vacancy,
      fullName,
      age,
      workExperience,
      city,
      relocation,
      education,
      phone,
      email,
      additionalInfo,
      userId,
      username,
      dateTime
    } = req.body;

    // Формируем тело письма
    const emailBody = `Новая заявка от пользователя Telegram

Тип формы: Трудоустройство

Дата и время: ${dateTime}

ID пользователя: ${userId}

Имя пользователя: ${username}

Данные формы:

Вакансия: ${vacancy}
ФИО: ${fullName}
Возраст: ${age}
Опыт работы по профессии: ${workExperience}
Город места жительства: ${city}
Готовность к переезду: ${relocation}
Образование: ${education}
Контактный телефон: ${phone}
Email: ${email}
Дополнительная информация: ${additionalInfo || 'Не указано'}`;

    // HTML версия письма
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4A90E2;">Новая заявка от пользователя Telegram</h2>
        <p><strong>Тип формы:</strong> Трудоустройство</p>
        <p><strong>Дата и время:</strong> ${dateTime}</p>
        <p><strong>ID пользователя:</strong> ${userId}</p>
        <p><strong>Имя пользователя:</strong> ${username}</p>
        
        <h3 style="color: #4A90E2; margin-top: 20px;">Данные формы:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Вакансия:</strong> ${vacancy}</li>
          <li><strong>ФИО:</strong> ${fullName}</li>
          <li><strong>Возраст:</strong> ${age}</li>
          <li><strong>Опыт работы по профессии:</strong> ${workExperience}</li>
          <li><strong>Город места жительства:</strong> ${city}</li>
          <li><strong>Готовность к переезду:</strong> ${relocation}</li>
          <li><strong>Образование:</strong> ${education}</li>
          <li><strong>Контактный телефон:</strong> ${phone}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Дополнительная информация:</strong> ${additionalInfo || 'Не указано'}</li>
        </ul>
      </div>
    `;

    // Отправляем email
    const mailOptions = {
      from: `"Газпром Трансгаз Сургут" <${EMAIL_CONFIG.email}>`,
      to: EMAIL_CONFIG.recipient,
      subject: 'Новая заявка от пользователя Telegram',
      text: emailBody,
      html: emailHtml
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Заявка успешно отправлена',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ошибка при отправке заявки',
      error: error.message
    });
  }
}

