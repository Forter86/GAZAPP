import nodemailer from 'nodemailer';
import path from 'path';
import { readFile } from 'fs/promises';

const EMAIL_CONFIG = {
  smtp_server: 'smtp.mail.ru',
  smtp_port: 587,
  email: 'gazprom_zayavki_bot@mail.ru',
  password: 'LF7DuDrO3ON6dbvz55R7',
  recipient: 'arturex414@gmail.com',
  recipientResume: 'resume@surgut.gazprom.ru',
  recipientDen: 'den-lisenko04@yandex.ru'
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
  if (type === 'excelTest') return 'ТЕСТ ЭКСЕЛЬКИ';
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

const relocationMap = {
  'Не готов': 21,
  'Готов к переезду в любое место': 22,
  'Готов к переезду в ЯНАО Новый Уренгой': 23,
  'Готов к переезду в ЯНАО Ноябрьск': 24,
  'Готов к переезду в ЯНАО п. Ханымей': 25,
  'Готов к переезду в ЯНАО г. Губкинский': 26,
  'Готов к переезду в ХМАО г. Сургут': 27,
  'Готов к переезду в ХМАО г. Когалым': 28,
  'Готов к переезду в ХМАО г. Нефтеюганск, Пыть-Ях': 29,
  'Готов к переезду в ХМАО п. Салым': 30,
  'Готов к переезду в Уватский р-н Тюменской области (МКС)': 31,
  'Готов к переезду в Тобольск и Тобольский р-н Тюменской области': 32,
  'Готов к переезду в г. Тюмень': 33,
  'Готов к переезду в г. Ишим Тюменской области': 34,
  'Готов к переезду в Ярковский район Тюменской области': 35
};

async function buildExcelTestEmail(data) {
  const ExcelJS = (await import('exceljs')).default;
  const templatePath = path.join(process.cwd(), 'public', 'anketa_soiskatelya.xlsx');
  const templateBuffer = await readFile(templatePath);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(templateBuffer);
  const sheet = workbook.getWorksheet(1);

  sheet.getRow(6).getCell(2).value = data.lastName;
  sheet.getRow(7).getCell(2).value = data.firstName;
  sheet.getRow(8).getCell(2).value = data.patronymic;
  sheet.getRow(9).getCell(2).value = data.birthDate;
  sheet.getRow(10).getCell(2).value = data.gender;
  sheet.getRow(11).getCell(2).value = data.citizenship;
  sheet.getRow(13).getCell(2).value = data.regAddress;
  sheet.getRow(14).getCell(2).value = data.factAddress || data.regAddress;
  sheet.getRow(15).getCell(2).value = data.vacancy;
  sheet.getRow(16).getCell(2).value = data.education;
  sheet.getRow(17).getCell(2).value = data.educationDetail;
  sheet.getRow(18).getCell(2).value = data.certificates;
  sheet.getRow(19).getCell(2).value = data.experience;
  sheet.getRow(20).getCell(2).value = data.relocation;

  const targetRow = relocationMap[data.relocation];
  if (targetRow) sheet.getRow(targetRow).getCell(2).value = 'V';
  if (data.shiftWork) sheet.getRow(36).getCell(2).value = 'V';

  sheet.getRow(37).getCell(2).value = data.additionalInfoDetailed;
  sheet.getRow(38).getCell(2).value = data.email;
  sheet.getRow(39).getCell(2).value = data.phone;
  sheet.getRow(40).getCell(2).value = new Date().toLocaleDateString('ru-RU');
  sheet.getRow(43).getCell(2).value = 'Даю согласие';

  const outBuffer = await workbook.xlsx.writeBuffer();
  const L = data.lastName || 'unknown';
  const F = data.firstName ? data.firstName[0] : '';
  const P = data.patronymic ? data.patronymic[0] : '';
  const filename = `anketa_${L}${F}${P}.xlsx`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
      <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">Полная анкета соискателя (Excel)</h2>
      <p><b>ФИО:</b> ${data.lastName} ${data.firstName} ${data.patronymic || ''}</p>
      <p><b>Вакансия:</b> ${data.vacancy}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Телефон:</b> ${data.phone}</p>
      <p><i>Заполненная анкета прикреплена к письму.</i></p>
    </div>
  `;
  const subject = `Заявка: ${getFormTypeLabel('excelTest')} - ${data.lastName} ${data.firstName}`;
  return { subject, html, attachments: [{ filename, content: outBuffer }] };
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
    const to = [EMAIL_CONFIG.recipient, EMAIL_CONFIG.recipientResume, EMAIL_CONFIG.recipientDen].join(', ');
    const from = `"Газпром трансгаз Сургут" <${EMAIL_CONFIG.email}>`;

    let subject, html, attachments = [];
    if (type === 'excelTest') {
      const payload = await buildExcelTestEmail(data);
      subject = payload.subject;
      html = payload.html;
      attachments = payload.attachments || [];
    } else {
      const content = buildEmailContent(data);
      subject = content.subject;
      html = content.html;
    }

    const mailOptions = {
      from,
      to,
      subject,
      html,
      ...(attachments.length ? { attachments } : {})
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
