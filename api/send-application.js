import nodemailer from 'nodemailer';

const EMAIL_CONFIG = {
  smtp_server: 'smtp.mail.ru',
  smtp_port: 587,
  email: 'gazprom_zayavki_bot@mail.ru',
  password: 'LF7DuDrO3ON6dbvz55R7',
  recipient: 'arturex414@gmail.com'
};

const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.smtp_server,
  port: EMAIL_CONFIG.smtp_port,
  secure: false,
  auth: {
    user: EMAIL_CONFIG.email,
    pass: EMAIL_CONFIG.password
  }
});

function getFormTypeLabel(type) {
  if (type === 'internship') return 'ПРАКТИКА';
  if (type === 'event') return 'МЕРОПРИЯТИЕ';
  return 'ТРУДОУСТРОЙСТВО';
}

function buildEmailContent(data) {
  const type = data.type || 'employment';
  const meta = `
    <div style="margin-top: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px; font-size: 12px;">
      <p><b>TG ID:</b> ${data.userId || '—'} | <b>Username:</b> ${data.username || '—'}</p>
      <p><b>Дата/Время:</b> ${data.dateTime || '—'}</p>
    </div>
  `;

  if (type === 'event') {
    return {
      subject: `Заявка: ${getFormTypeLabel(type)} - ${data.fullName || 'Без имени'}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
          <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">Заявка на мероприятие</h2>
          <p><b>1. ФИО КОНТАКТНОГО ЛИЦА:</b> ${data.fullName || '—'}</p>
          <p><b>2. Место экскурсии:</b> ${data.place || '—'}</p>
          <p><b>3. Категория:</b> ${data.category || '—'}</p>
          <p><b>4. Организация:</b> ${data.organization || '—'}</p>
          <p><b>5. Номер телефона:</b> ${data.phone || '—'}</p>
          <p><b>6. Почта:</b> ${data.email || '—'}</p>
          <p><b>7. Количество участников:</b> ${data.participantsCount || '—'}</p>
          ${meta}
        </div>
      `
    };
  }

  if (type === 'internship') {
    const periodStr = [data.internshipDateFrom, data.internshipDateTo].filter(Boolean).length
      ? `с ${data.internshipDateFrom || '—'} по ${data.internshipDateTo || '—'}`
      : '—';
    return {
      subject: `Заявка: ${getFormTypeLabel(type)} - ${data.fullName || 'Без имени'}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
          <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">Заявка на практику</h2>
          <p><b>ФИО:</b> ${data.fullName || '—'}</p>
          <p><b>Регион:</b> ${data.region || '—'}</p>
          <p><b>ВУЗ/СПО:</b> ${data.institution || '—'}</p>
          <p><b>Тип образования:</b> ${data.educationType || '—'}</p>
          <p><b>Специальность:</b> ${data.specialization || '—'}</p>
          <p><b>Курс:</b> ${data.course || '—'}</p>
          <p><b>Период стажировки:</b> ${periodStr}</p>
          <p><b>Тип стажировки:</b> ${data.paidType || '—'}</p>
          <p><b>Филиал:</b> ${data.branch || '—'}</p>
          <p><b>Телефон:</b> ${data.phone || '—'}</p>
          <p><b>Email:</b> ${data.email || '—'}</p>
          <p><b>Навыки и умения:</b> ${data.skills ? data.skills : '—'}</p>
          <p><b>Доп. инфо:</b> ${data.additionalInfo || '—'}</p>
          ${meta}
        </div>
      `
    };
  }

  // employment (default)
  return {
    subject: `Заявка: ${getFormTypeLabel(type)} - ${data.fullName || 'Без имени'}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
        <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">Заявка на трудоустройство</h2>
        <p><b>1. Вакансия:</b> ${data.vacancy || '—'}</p>
        <p><b>2. ФИО:</b> ${data.fullName || '—'}</p>
        <p><b>3. Возраст:</b> ${data.age || '—'}</p>
        <p><b>4. Номер телефона:</b> ${data.phone || '—'}</p>
        <p><b>5. Почта:</b> ${data.email || '—'}</p>
        <p><b>6. Опыт работы:</b> ${data.workExperience || '—'}</p>
        <p><b>7. Город:</b> ${data.city || '—'}</p>
        <p><b>8. Готовность к переезду:</b> ${data.relocation || '—'}</p>
        <p><b>9. Образование:</b> ${data.education || '—'}</p>
        <p><b>10. Доп инфо:</b> ${data.additionalInfo || '—'}</p>
        ${meta}
      </div>
    `
  };
}

export default async function handler(req, res) {
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
    const data = req.body;
    const type = data.type || 'employment';
    const { subject, html } = buildEmailContent(data);

    const mailOptions = {
      from: `"Газпром трансгаз Сургут" <${EMAIL_CONFIG.email}>`,
      to: EMAIL_CONFIG.recipient,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId, 'type:', type);

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
