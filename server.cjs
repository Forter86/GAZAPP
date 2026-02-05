const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- ПОЧТОВЫЕ НАСТРОЙКИ ---
const EMAIL_CONFIG = {
    smtp_server: 'smtp.mail.ru',
    smtp_port: 587,
    email: 'gazprom_zayavki_bot@mail.ru',
    password: 'ppbpQnU8lfXwhHSuFTqO',
    recipient: 'den-lisenko04@yandex.ru',
    recipientResume: 'resume@surgut.gazprom.ru'
};

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Прием заявок
app.post(['/api/send-application', '/send-application'], async (req, res) => {
    const data = req.body;
    const VERSION = "2.0.0-PROD";
    console.log(`=== ПОЛУЧЕНА ЗАЯВКА [${VERSION}] ===`);
    console.log(`Тип: ${data.type}`);
    console.log(`Данные:`, JSON.stringify(data, null, 2));

    const type = data.type || 'employment';
    let formTypeLabel = '💼 ТРУДОУСТРОЙСТВО';
    if (type === 'internship') formTypeLabel = '📍 ПРАКТИКА';
    else if (type === 'event') formTypeLabel = '🎉 МЕРОПРИЯТИЕ';
    else if (type === 'excelTest') formTypeLabel = '📊 ТЕСТ ЭКСЕЛЬКИ';

    let htmlContent = '';
    let attachments = [];

    if (type === 'excelTest') {
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const templatePath = path.join(__dirname, 'public', 'anketa_soiskatelya.xlsx');

        try {
            await workbook.xlsx.readFile(templatePath);
            const sheet = workbook.getWorksheet(1);

            // Fill the cells (Column B is index 2)
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

            // Relocation row-based checkmarks (V)
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

            const targetRow = relocationMap[data.relocation];
            if (targetRow) {
                sheet.getRow(targetRow).getCell(2).value = 'V';
            }

            // Shift work checkmark (Row 36)
            if (data.shiftWork) {
                sheet.getRow(36).getCell(2).value = 'V';
            }

            sheet.getRow(37).getCell(2).value = data.additionalInfoDetailed;
            sheet.getRow(38).getCell(2).value = data.email;
            sheet.getRow(39).getCell(2).value = data.phone;
            sheet.getRow(40).getCell(2).value = new Date().toLocaleDateString('ru-RU');
            sheet.getRow(43).getCell(2).value = 'Даю согласие';

            const buffer = await workbook.xlsx.writeBuffer();

            // Generate filename: anketa_LastName_I_O.xlsx
            const L = data.lastName || 'unknown';
            const F = data.firstName ? data.firstName[0] : '';
            const P = data.patronymic ? data.patronymic[0] : '';
            const filename = `anketa_${L}${F}${P}.xlsx`;

            attachments.push({
                filename: filename,
                content: buffer
            });

            htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
                    <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">Полная анкета соискателя (Excel)</h2>
                    <p><b>ФИО:</b> ${data.lastName} ${data.firstName} ${data.patronymic || ''}</p>
                    <p><b>Вакансия:</b> ${data.vacancy}</p>
                    <p><b>Email:</b> ${data.email}</p>
                    <p><b>Телефон:</b> ${data.phone}</p>
                    <p><i>Заполненная анкета прикреплена к письму.</i></p>
                </div>
            `;
        } catch (err) {
            console.error('Excel processing error:', err);
            // Fallback if excel fails
            htmlContent = `<p>Ошибка при создании Excel файла. Данные: ${JSON.stringify(data)}</p>`;
        }
    } else if (type === 'event') {
        htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
                <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">Заявка на мероприятие</h2>
                <p><b>1. ФИО КОНТАКТНОГО ЛИЦА:</b> ${data.fullName || '—'}</p>
                <p><b>2. Место экскурсии:</b> ${data.place || '—'}</p>
                <p><b>3. Категория:</b> ${data.category || '—'}</p>
                <p><b>4. Организация:</b> ${data.organization || '—'}</p>
                <p><b>5. Номер телефона:</b> ${data.phone || '—'}</p>
                <p><b>6. Почта:</b> ${data.email || '—'}</p>
                <p><b>7. Количество участников:</b> ${data.participantsCount || '—'}</p>
                <div style="margin-top: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px; font-size: 12px;">
                    <p><b>TG ID:</b> ${data.userId || '—'} | <b>Username:</b> ${data.username || '—'}</p>
                    <p><b>Дата/Время:</b> ${data.dateTime || '—'}</p>
                </div>
            </div>
        `;
    } else if (type === 'internship') {
        const periodStr = [data.internshipDateFrom, data.internshipDateTo].filter(Boolean).length
            ? `с ${data.internshipDateFrom || '—'} по ${data.internshipDateTo || '—'}`
            : '—';
        htmlContent = `
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
            </div>
        `;
    } else {
        htmlContent = `
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
                <div style="margin-top: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px; font-size: 10px; color: #999;">
                    <p><b>TG ID:</b> ${data.userId || '—'} | <b>Username:</b> ${data.username || '—'}</p>
                    <p><b>Дата/Время:</b> ${data.dateTime || '—'}</p>
                    <p><b>Server Version:</b> ${VERSION}</p>
                </div>
            </div>
        `;
    }

    const transporter = nodemailer.createTransport({
        host: EMAIL_CONFIG.smtp_server,
        port: 465, // Возвращаемся на 465
        secure: true, // SSL
        auth: { user: EMAIL_CONFIG.email, pass: EMAIL_CONFIG.password },
        logger: true, // Включаем расширенные логи
        debug: true   // Показываем детали обмена данными
    });

    try {
        await transporter.sendMail({
            from: `"Газпром Бот" <${EMAIL_CONFIG.email}>`,
            to: [EMAIL_CONFIG.recipient, EMAIL_CONFIG.recipientResume].join(', '),
            subject: `Заявка: ${formTypeLabel} - ${data.fullName || (data.lastName ? data.lastName + ' ' + data.firstName : 'Без имени')}`,
            html: htmlContent,
            attachments: attachments
        });
        console.log('✅ Email успешно отправлен');
        res.json({ success: true, message: 'Заявка отправлена!' });
    } catch (e) {
        console.error('❌ Ошибка отправки:', e.message);
        res.status(500).json({ success: false, message: 'Ошибка сервера при отправке' });
    }
});

// SPA Fallback
app.use((req, res, next) => {
    if (req.method === 'GET' && !res.headersSent) {
        res.sendFile(path.join(distPath, 'index.html'));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
