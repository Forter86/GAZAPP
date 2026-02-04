import { useEffect, useState } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { ProfessionSection } from './components/sections/ProfessionSection';
import { AboutSection } from './components/sections/AboutSection';
import { RequirementsSection } from './components/sections/RequirementsSection';
import { BenefitsSection } from './components/sections/BenefitsSection';
import { FinalCTASection } from './components/sections/FinalCTASection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { ApplicationForm } from './components/sections/ApplicationForm';
import { VideoSection } from './components/sections/VideoSection';
import { QuizSection } from './components/sections/QuizSection';
import { KnowledgeSection } from './components/sections/KnowledgeSection';
import { parseQuestions, type Question } from './utils/parseQuestions';

// Импорт стикеров для использования в качестве фона
import medvedSticker from './assets/medved.webp';
import sovavaSticker from './assets/sovava.webp';
import olenSticker from './assets/olenSTOL.webp';
import popmxzSticker from './assets/popmxz.webp';
import loplaSticker from './assets/lopla.webp';
import svoSBSticker from './assets/svoSB.webp';
import olenmSticker from './assets/olenm.webp';
import morzikSticker from './assets/morzik.webp';
import groupSticker from './assets/sticker_group.webp';
import tolpaSticker from './assets/tolpa.webp';
import olopSticker from './assets/olop.webp';

declare global {
  interface Window {
    Telegram: any;
  }
}

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeStickerIndex, setActiveStickerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Массив стикеров для фоновой карусели
  const backgroundStickers = [
    medvedSticker,
    sovavaSticker,
    olenSticker,
    loplaSticker,
    olopSticker,
    svoSBSticker,
    olenmSticker,
    groupSticker
  ];

  // Загружаем и парсим вопросы при монтировании
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Пытаемся загрузить файл с вопросами из public
        // Добавляем timestamp для избежания кеширования в dev режиме
        const cacheBuster = process.env.NODE_ENV === 'development' ? `?t=${Date.now()}` : '';
        const response = await fetch(`/voprosi.txt${cacheBuster}`);

        if (response.ok) {
          const text = await response.text();
          if (text && text.trim().length > 0) {
            const parsedQuestions = parseQuestions(text);
            if (parsedQuestions.length > 0) {
              console.log(`Загружено ${parsedQuestions.length} вопросов из файла`);
              setQuestions(parsedQuestions);
              return;
            } else {
              console.warn('Файл загружен, но вопросы не распарсились');
            }
          } else {
            console.warn('Файл пустой');
          }
        } else {
          console.warn(`Ошибка загрузки файла: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Ошибка при загрузке файла с вопросами:', error);
      }

      // Если файл пустой или не найден, используем примерные вопросы
      setQuestions([
        {
          question: 'В каком году было основано ООО «Газпром трансгаз Сургут»?',
          answers: ['1970', '1972', '1980', '1990'],
          correctIndex: 1
        },
        {
          question: 'Какой основной вид деятельности компании?',
          answers: ['Добыча газа', 'Транспортировка газа', 'Переработка нефти', 'Энергоснабжение'],
          correctIndex: 1
        },
        {
          question: 'В каком регионе находится головной офис компании?',
          answers: ['Москва', 'Сургут', 'Тюмень', 'Новосибирск'],
          correctIndex: 1
        },
        {
          question: 'Какие профессии наиболее востребованы в компании?',
          answers: ['Только инженеры', 'Только рабочие', 'Инженеры и рабочие специальности', 'Только менеджеры'],
          correctIndex: 2
        },
        {
          question: 'Предоставляет ли компания программы для молодых специалистов?',
          answers: ['Нет', 'Да, только для выпускников вузов', 'Да, для выпускников вузов и ссузов', 'Только стажировки'],
          correctIndex: 2
        }
      ]);
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Меняем стикер каждые 400px
      const index = Math.floor(scrollPosition / 400) % backgroundStickers.length;
      setActiveStickerIndex(index);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [backgroundStickers.length]);

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
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
    }
  }, []);

  const sendEmail = async (formData: any) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

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

    const API_URL = '/api/send-application';

    // Создаем промис для минимальной задержки в 2 секунды
    const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const fetchPromise = fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: userId,
          username: username,
          dateTime: dateTime
        })
      });

      // Ждем и запрос, и таймер
      const [response] = await Promise.all([fetchPromise, delayPromise]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка отправки');
      }

      setSubmitStatus('success');
    } catch (error: any) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Временные неполадки. Попробуйте еще раз позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToFooter = () => {
    const element = document.getElementById('final-cta');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1A1A1A] antialiased pb-6 overflow-x-hidden relative">
      {/* Динамический фоновый стикер по центру */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[500px] max-h-[500px] opacity-[0.1] pointer-events-none z-0 flex items-center justify-center">
        <img
          key={activeStickerIndex}
          src={backgroundStickers[activeStickerIndex]}
          alt=""
          className="w-full h-full object-contain transition-opacity duration-300"
        />
      </div>

      <main className="max-w-md mx-auto flex flex-col gap-16 relative z-30 py-0">
        <HeroSection onScrollToForm={scrollToFooter} />
        <div className="relative mt-32">
          {/* Стикер popmxz - бобр слева */}
          <img
            src={popmxzSticker}
            alt=""
            className="absolute -left-2 -top-30 w-[175px] h-[175px] object-contain drop-shadow-md z-20"
          />

          <ProfessionSection />

          {/* Стикер sovava - сова справа */}
          <img
            src={sovavaSticker}
            alt=""
            className="absolute -right-2 -top-28 w-[175px] h-[175px] object-contain drop-shadow-md z-20"
          />
        </div>
        <AboutSection />
        <RequirementsSection />
        <BenefitsSection />
        <TestimonialsSection />
        <VideoSection />
        <KnowledgeSection />

        {/* Стикер моржика (morzik) у видео */}
        <div className="absolute right-0 translate-y-[-100px] w-32 h-32 opacity-[0.8] z-10 pointer-events-none rotate-12 hidden sm:block">
          <img src={morzikSticker} alt="" className="w-full h-full object-contain" />
        </div>

        <div id="final-cta">
          <FinalCTASection
            onOpenForm={() => setIsFormOpen(true)}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenExcelTest={() => setIsFormOpen(true)} // Currently reused isFormOpen, modal will handle branching
          />
        </div>

        {/* Стикер толпы (bg) в самом низу */}
        <div className="fixed bottom-0 left-0 w-full h-64 opacity-[0.03] pointer-events-none z-0">
          <img src={tolpaSticker} alt="" className="w-full h-full object-contain object-bottom" />
        </div>
      </main>

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSubmitStatus('idle');
          setErrorMessage('');
        }}
        onSubmit={sendEmail}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
        errorMessage={errorMessage}
      />

      <QuizSection
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        questions={questions}
      />
    </div>
  );
}

export default App;
