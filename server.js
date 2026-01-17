import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
  secure: false, // true для 465, false для других портов
  auth: {
    user: EMAIL_CONFIG.email,
    pass: EMAIL_CONFIG.password
  }
});

// Проверка подключения к SMTP
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP Error:', error);
    console.log('Сервер продолжит работу, но отправка email может не работать');
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Не завершаем процесс, продолжаем работу
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Не завершаем процесс, продолжаем работу
});

// Endpoint для отправки заявки
app.post('/send-application', async (req, res) => {
  console.log('=== ПОЛУЧЕН ЗАПРОС НА /send-application ===');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Headers:', req.headers);
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
    
    res.json({ 
      success: true, 
      message: 'Заявка успешно отправлена',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при отправке заявки',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Email will be sent from: ${EMAIL_CONFIG.email}`);
  console.log(`Email will be sent to: ${EMAIL_CONFIG.recipient}`);
});

