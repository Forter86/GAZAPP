import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow all CORS for simplicity in this setup
app.use(express.json());

// Serve static files from the build directory
const distPath = join(__dirname, 'dist');
console.log('Serving static files from:', distPath);
app.use(express.static(distPath));

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

transporter.verify((error) => {
  if (error) console.log('SMTP Error:', error);
  else console.log('SMTP Server is ready');
});

// Endpoint для отправки заявки
// Handles both paths to be safe
app.post(['/api/send-application', '/send-application'], async (req, res) => {
  console.log(`=== ПОЛУЧЕН ЗАПРОС НА ${req.path} ===`);
  try {
    const {
      vacancy, fullName, age, workExperience, city, relocation, education,
      phone, email, additionalInfo, userId, username, dateTime,
      // Internship fields
      region, educationType, institution, specialization, branch, type
    } = req.body;

    const isInternship = type === 'internship';
    const formTypeTitle = isInternship ? 'Практика' : 'Трудоустройство';

    // Text Body
    let emailBody = `Новая заявка от пользователя Telegram\n\n`;
    emailBody += `Тип формы: ${formTypeTitle}\n`;
    emailBody += `Дата: ${dateTime}\n`;
    emailBody += `Пользователь: ${username} (ID: ${userId})\n\n`;
    emailBody += `Данные:\n`;
    emailBody += `ФИО: ${fullName}\n`;
    emailBody += `Email: ${email}\n`;
    emailBody += `Телефон: ${phone}\n`;

    if (isInternship) {
      emailBody += `Регион: ${region}\n`;
      emailBody += `Тип образования: ${educationType}\n`;
      emailBody += `Учреждение: ${institution}\n`;
      emailBody += `Специальность: ${specialization}\n`;
      emailBody += `Филиал: ${branch}\n`;
    } else {
      emailBody += `Вакансия: ${vacancy}\n`;
      emailBody += `Возраст: ${age}\n`;
      emailBody += `Опыт: ${workExperience}\n`;
      emailBody += `Город: ${city}\n`;
      emailBody += `Переезд: ${relocation}\n`;
      emailBody += `Образование: ${education}\n`;
    }

    emailBody += `Доп. инфо: ${additionalInfo || 'Нет'}`;

    // HTML Body
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4A90E2;">Новая заявка: ${formTypeTitle}</h2>
        <p><strong>Пользователь:</strong> ${username} (ID: ${userId})</p>
        <p><strong>Дата:</strong> ${dateTime}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <h3>Данные кандидата:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>ФИО:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Телефон:</strong> ${phone}</li>
          ${isInternship ? `
            <li><strong>Регион:</strong> ${region}</li>
            <li><strong>Тип образования:</strong> ${educationType}</li>
            <li><strong>Учреждение:</strong> ${institution}</li>
            <li><strong>Специальность:</strong> ${specialization}</li>
            <li><strong>Филиал:</strong> ${branch}</li>
          ` : `
            <li><strong>Вакансия:</strong> ${vacancy}</li>
            <li><strong>Возраст:</strong> ${age}</li>
            <li><strong>Опыт:</strong> ${workExperience}</li>
            <li><strong>Город:</strong> ${city}</li>
            <li><strong>Переезд:</strong> ${relocation}</li>
            <li><strong>Образование:</strong> ${education}</li>
          `}
          <li><strong>Доп. инфо:</strong> ${additionalInfo || 'Нет'}</li>
        </ul>
      </div>
    `;

    await transporter.sendMail({
      from: `"Газпром Бот" <${EMAIL_CONFIG.email}>`,
      to: EMAIL_CONFIG.recipient,
      subject: `Заявка: ${formTypeTitle} - ${fullName}`,
      text: emailBody,
      html: emailHtml
    });

    console.log('Email sent successfully');
    res.json({ success: true, message: 'Заявка отправлена' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Ошибка отправки', error: error.message });
  }
});

// Serve index.html for any other requests (SPA support)
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
