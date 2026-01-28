import { useRef, useEffect, useState } from 'react';
import { Heading } from '../atoms/Heading';
import { Card } from '../atoms/Card';
import {
  Fan,
  Wrench,
  Gauge,
  Flame,
  Settings,
  Zap,
  Hammer,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export const ProfessionSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const AUTOSCROLL_INTERVAL = 4000; // 4 секунды на слайд
  const progressRef = useRef<SVGCircleElement>(null);

  const professions = [
    {
      icon: Fan,
      title: "Машинист технологических компрессоров",
      description: "Обеспечение бесперебойной работы компрессорных установок"
    },
    {
      icon: Wrench,
      title: "Слесарь по ремонту технологических установок",
      description: "Ремонт и техническое обслуживание промышленного оборудования"
    },
    {
      icon: Gauge,
      title: "Слесарь КИПиА",
      description: "Настройка и обслуживание систем автоматики и измерений"
    },
    {
      icon: Flame,
      title: "Сварщик",
      description: "Сварочные работы на газопроводах и технологических объектах"
    },
    {
      icon: Settings,
      title: "Оператор ГРС",
      description: "Контроль распределения газа потребителям"
    },
    {
      icon: Zap,
      title: "Электромонтер",
      description: "Ремонт и обслуживание электросетей и оборудования"
    },
    {
      icon: Hammer,
      title: "Слесарь аварийно-восстановительных работ",
      description: "Оперативное устранение неисправностей на газопроводах"
    }
  ];

  // Обработчик скролла для обновления индекса
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Вычисляем текущий индекс на основе прокрутки
    // Ширина карточки (300px или 85%) + gap (16px)
    // Для более точного определения центра используем середину контейнера
    const center = container.scrollLeft + container.clientWidth / 2;
    // Находим карточку, которая ближе всего к центру
    const cards = Array.from(container.children);
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = (card as HTMLElement).offsetLeft + (card as HTMLElement).clientWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      // Скроллим так, чтобы карточка была по центру (или слева с отступом)
      // В данном случае snap-align: center, поэтому scrollIntoView хорошо сработает
      // Но лучше контролируемо через scrollTo
      const scrollLeft = card.offsetLeft - 20; // 20px - padding-left контейнера (px-5)
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % professions.length;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + professions.length) % professions.length;
    scrollToIndex(prevIndex);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  // Автопрокрутка
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTOSCROLL_INTERVAL);

    // Сброс анимации круга
    if (progressRef.current) {
      progressRef.current.style.transition = 'none';
      progressRef.current.style.strokeDashoffset = '100'; // 100% длины

      // Force reflow
      void progressRef.current.getBoundingClientRect();

      progressRef.current.style.transition = `stroke-dashoffset ${AUTOSCROLL_INTERVAL}ms linear`;
      progressRef.current.style.strokeDashoffset = '0';
    }

    return () => clearInterval(timer);
  }, [activeIndex, isPaused]);

  return (
    <section className="px-0 py-8 relative overflow-hidden">
      <div className="px-6">
        <Heading level={2} className="mb-8 relative z-30 pt-5">Выбери свою профессию</Heading>
      </div>

      {/* Container with negative margin to allow full-bleed scroll while keeping padding for first item */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-4 no-scrollbar touch-pan-x items-stretch"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ scrollBehavior: 'smooth' }}
      >
        {professions.map((profession, index) => {
          const Icon = profession.icon;
          return (
            <Card
              key={index}
              className="snap-center shrink-0 w-[375px] flex flex-col items-start gap-4 p-5 border-l-4 border-[#4A90E2] rounded-l-2xl !rounded-[32px] relative bg-white shadow-sm min-h-[220px]"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#4A90E2]/10 text-[#4A90E2] shrink-0 mb-2">
                <Icon size={28} strokeWidth={2} />
              </div>
              <div className="flex-1 w-full max-w-full">
                <h4 className="font-bold text-xl mb-3 leading-snug whitespace-normal break-words">{profession.title}</h4>
                <p className="text-gray-500 text-base leading-relaxed whitespace-normal break-words w-full">{profession.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-4 pb-4">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-[#4A90E2] hover:bg-gray-50 transition-colors active:scale-95"
          aria-label="Previous slide"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <circle
              ref={progressRef}
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#4A90E2"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset="100"
            />
          </svg>

          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-[#4A90E2] shadow-md flex items-center justify-center text-white hover:bg-[#357ABD] transition-colors active:scale-95 z-10"
            aria-label="Next slide"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};
