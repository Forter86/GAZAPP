import { useEffect, useState } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { ProfessionSection } from './components/sections/ProfessionSection';
import { AboutSection } from './components/sections/AboutSection';
import { RequirementsSection } from './components/sections/RequirementsSection';
import { BenefitsSection } from './components/sections/BenefitsSection';
import { FinalCTASection } from './components/sections/FinalCTASection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { ApplicationForm } from './components/sections/ApplicationForm';
import emailjs from '@emailjs/browser';

// Импорт стикеров для использования в качестве фона
import medvedSticker from './assets/medved.webp';
import sovavaSticker from './assets/sovava.webp';
import olenSticker from './assets/olenSTOL.webp';
import popmxzSticker from './assets/popmxz.webp';

declare global {
  interface Window {
    Telegram: any;
  }
}

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  console.log('App rendering...');

  useEffect(() => {
    console.log('App mounted');
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      console.log('Telegram WebApp detected');
      try {
        tg.ready();
        tg.expand();
        
        // Customize colors
        tg.setHeaderColor('#F5F7FA');
        tg.setBackgroundColor('#F5F7FA');
        
        // Set main button
        tg.MainButton.setText('ПОДАТЬ ЗАЯВКУ');
        tg.MainButton.setParams({
          is_visible: true,
          color: '#4A90E2',
          text_color: '#FFFFFF'
        });
        
        tg.MainButton.onClick(() => {
          setIsFormOpen(true);
        });
      } catch (e) {
        console.error('Error initializing Telegram WebApp:', e);
      }
    } else {
      console.log('Telegram WebApp NOT detected');
    }
  }, []);

  const sendEmail = async (formData: any) => {
    const tg = window.Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id || 'Не указан';
    const username = tg?.initDataUnsafe?.user?.username 
      ? `@${tg.initDataUnsafe.user.username}` 
      : tg?.initDataUnsafe?.user?.first_name || 'Не указан';

    const now = new Date();
    const dateTime = now.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(',', '');

    const emailBody = `Новая заявка от пользователя Telegram

Тип формы: Трудоустройство

Дата и время: ${dateTime}

ID пользователя: ${userId}

Имя пользователя: ${username}

Данные формы:

Вакансия: ${formData.vacancy}
ФИО: ${formData.fullName}
Возраст: ${formData.age}
Опыт работы по профессии: ${formData.workExperience}
Город места жительства: ${formData.city}
Готовность к переезду: ${formData.relocation}
Образование: ${formData.education}
Контактный телефон: ${formData.phone}
Email: ${formData.email}
Дополнительная информация: ${formData.additionalInfo || 'Не указано'}`;

    try {
      // ВАРИАНТ 1: Отправка через EmailJS (рекомендуется)
      // 1. Зарегистрируйтесь на https://www.emailjs.com/
      // 2. Создайте Email Service (например, Gmail)
      // 3. Создайте Email Template с переменными: {{message}}, {{user_id}}, {{username}}, {{date_time}}
      // 4. Получите PUBLIC_KEY, SERVICE_ID и TEMPLATE_ID
      // 5. Раскомментируйте код ниже и вставьте свои ключи:
      
      // emailjs.init('YOUR_PUBLIC_KEY');
      // await emailjs.send(
      //   'YOUR_SERVICE_ID',
      //   'YOUR_TEMPLATE_ID',
      //   {
      //     to_email: 'arturex414@gmail.com',
      //     from_email: 'gazprom_zayavki_bot@mail.ru',
      //     subject: 'Новая заявка от пользователя Telegram',
      //     message: emailBody,
      //     user_id: userId,
      //     username: username,
      //     date_time: dateTime
      //   }
      // );

      // ВАРИАНТ 2: Отправка через ваш бэкенд API
      // Замените URL на ваш реальный endpoint (для продакшена)
      // Для локальной разработки используйте: http://localhost:3001/send-application
      // Используем Vercel Serverless Function (API route)
      // Если VITE_API_URL не установлен, используем относительный путь к API route
      let API_URL = import.meta.env.VITE_API_URL || '/api/send-application';
      
      // Проверяем, что это не placeholder
      if (API_URL.includes('YOUR_BACKEND_NGROK_URL') || API_URL.includes('your_backend_ngrok_url')) {
        API_URL = '/api/send-application'; // Используем Vercel API route
      }
      
      console.log('Отправка заявки на:', API_URL);
      console.log('Данные формы:', formData);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vacancy: formData.vacancy,
          fullName: formData.fullName,
          age: formData.age,
          workExperience: formData.workExperience,
          city: formData.city,
          relocation: formData.relocation,
          education: formData.education,
          phone: formData.phone,
          email: formData.email,
          additionalInfo: formData.additionalInfo,
          userId: userId,
          username: username,
          dateTime: dateTime
        })
      });

      console.log('Ответ сервера:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ошибка ответа:', errorData);
        throw new Error(errorData.message || 'Ошибка отправки');
      }

      const result = await response.json();
      console.log('Успешный ответ:', result);
      
      // Используем обычный alert, так как showAlert не поддерживается в версии 6.0
      alert('Заявка успешно отправлена! Скоро мы с вами свяжемся.');

      // Закрываем форму (это вызовет сброс формы через useEffect)
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      console.log('Данные заявки:', emailBody);
      
      // Используем обычный alert, так как showAlert не поддерживается в версии 6.0
      alert('Ошибка при отправке заявки. Проверьте консоль для деталей.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1A1A1A] antialiased pb-20 overflow-x-hidden relative">
      {/* Фоновые декоративные стикеры */}
      <div className="fixed -top-[20px] -left-20 w-64 h-64 opacity-[0.07] -rotate-12 pointer-events-none z-0">
        <img src={medvedSticker} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="fixed -top-[10px] -right-20 w-72 h-72 opacity-[0.07] rotate-12 pointer-events-none z-0">
        <img src={sovavaSticker} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="fixed bottom-20 -left-20 w-64 h-64 opacity-[0.07] rotate-6 pointer-events-none">
        <img src={olenSticker} alt="" className="w-full h-full object-contain" />
      </div>

      <main className="max-w-md mx-auto flex flex-col gap-16 relative z-30 py-0">
        <HeroSection onOpenForm={() => setIsFormOpen(true)} />
        {/* Стикер popmxz - перемещен из ProfessionSection */}
        <img src={popmxzSticker} alt="" className="absolute left-[34px] top-[778px] w-[156px] h-[156px] object-contain drop-shadow-md z-20" />
        <ProfessionSection />
        {/* Стикер sovava - перемещен из ProfessionSection */}
        <img src={sovavaSticker} alt="" className="absolute left-[272px] top-[783px] w-[156px] h-[156px] object-contain drop-shadow-md z-20" />
        <AboutSection />
        <RequirementsSection />
        <BenefitsSection />
        <TestimonialsSection />
        <FinalCTASection onOpenForm={() => setIsFormOpen(true)} />
      </main>

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={sendEmail}
      />
    </div>
  );
}

export default App;
