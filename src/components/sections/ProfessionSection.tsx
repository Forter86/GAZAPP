import { useMemo, useRef, useEffect, useState } from 'react';
import { Heading } from '../atoms/Heading';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { X } from 'lucide-react';
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
  const [selectedProfession, setSelectedProfession] = useState<number | null>(null);
  const [isProfessionsVideoOpen, setIsProfessionsVideoOpen] = useState(false);
  const AUTOSCROLL_INTERVAL = 4000; // 4 секунды на слайд
  const progressRef = useRef<SVGCircleElement>(null);

  const isIOS = useMemo(() => /iPhone|iPad|iPod/i.test(navigator.userAgent), []);

  // Видео для кнопки "Знакомство с профессиями"
  // Можно задать в Vercel/ENV: VITE_PROFESSIONS_VIDEO_URL
  // Фолбек: общий VITE_VIDEO_URL или локальный /gzp_video.mp4 (если он есть)
  const professionsVideoUrl = useMemo(() => {
    return (
      import.meta.env.VITE_PROFESSIONS_VIDEO_URL ||
      import.meta.env.VITE_VIDEO_URL ||
      '/gzp_video.mp4'
    );
  }, []);

  const professions = [
    {
      icon: Fan,
      title: "Машинист технологических компрессоров",
      description: "Обеспечение бесперебойной работы компрессорных установок",
      fullDescription: "Управляет и контролирует работу мощных компрессорных установок, обеспечивая сжатие газа до требуемых параметров в магистральном газопроводе.\n\nОтвечает за безопасную и стабильную работу ключевого оборудования компрессорной станции, соблюдение режимных карт, диагностику оборудования и безаварийную эксплуатацию агрегатов на компрессорной станции."
    },
    {
      icon: Wrench,
      title: "Слесарь по ремонту технологических установок",
      description: "Ремонт и техническое обслуживание промышленного оборудования",
      fullDescription: "Выполняет планово-предупредительный и аварийный ремонт узлов и механизмов технологического оборудования: насосов, компрессоров, запорно-регулирующей арматуры.\n\nОбеспечивает техническую готовность к работе технологических линий в соответствии с регламентами."
    },
    {
      icon: Gauge,
      title: "Слесарь КИПиА",
      description: "Настройка и обслуживание систем автоматики и измерений",
      fullDescription: "Обслуживает, настраивает и ремонтирует средства КИП, системы телемеханики и элементы АСУ ТП.\n\nОбеспечивает метрологическую исправность приборов учёта, контроля давления, температуры и средств автоматической защиты."
    },
    {
      icon: Flame,
      title: "Сварщик",
      description: "Сварочные работы на газопроводах и технологических объектах",
      fullDescription: "Выполняет монтажную и ремонтную сварку трубопроводов, сосудов давления и строительных металлоконструкций.\n\nРаботы проводятся в соответствии со строгими нормативными требованиями (ПБ, СНиП, ГОСТ) с применением специализированных технологий (РД, НГТ)."
    },
    {
      icon: Settings,
      title: "Оператор ГРС",
      description: "Контроль распределения газа потребителям",
      fullDescription: "Управляет технологическим процессом подготовки, редуцирования и распределения газа на ГРС.\n\nКонтролирует параметры потока, работу систем очистки и переключения на обвязке станции."
    },
    {
      icon: Zap,
      title: "Электромонтер",
      description: "Ремонт и обслуживание электросетей и оборудования",
      fullDescription: "Обеспечивает эксплуатационную готовность силового и низковольтного электрооборудования, систем освещения и защитного заземления.\n\nПроводит плановые и аварийные работы на распределительных устройствах, электродвигателях и схемах управления."
    },
    {
      icon: Hammer,
      title: "Слесарь аварийно-восстановительных работ",
      description: "Оперативное устранение неисправностей на газопроводах",
      fullDescription: "Входит в состав бригады оперативного реагирования для локализации и ликвидации утечек, повреждений на магистральных и распределительных газопроводах.\n\nВыполняет работы под давлением с применением специализированного оборудования в соответствии с регламентами по ликвидации аварий."
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

  // Блокируем скролл body когда модальное окно открыто
  useEffect(() => {
    if (selectedProfession !== null || isProfessionsVideoOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProfession, isProfessionsVideoOpen]);

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
            <div
              key={index}
              onClick={() => setSelectedProfession(index)}
              className="snap-center shrink-0 w-[375px] cursor-pointer"
            >
              <Card
                className="flex flex-col items-start gap-4 p-5 border-l-4 border-[#4A90E2] rounded-l-2xl !rounded-[32px] relative bg-white shadow-sm min-h-[220px] hover:shadow-[0_20px_40px_-10px_rgba(74,144,226,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#4A90E2]/10 text-[#4A90E2] shrink-0 mb-2">
                  <Icon size={28} strokeWidth={2} />
                </div>
                <div className="flex-1 w-full max-w-full">
                  <h4 className="font-bold text-xl mb-3 leading-snug whitespace-normal break-words">{profession.title}</h4>
                  <p className="text-gray-500 text-base leading-relaxed whitespace-normal break-words w-full">{profession.description}</p>
                </div>
              </Card>
            </div>
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

      {/* CTA под стрелками */}
      <div className="flex items-center justify-center pb-2">
        <Button
          variant="outline"
          className="px-6 py-3 text-base rounded-full shadow-sm bg-white/80 backdrop-blur"
          onClick={() => {
            setSelectedProfession(null);
            setIsProfessionsVideoOpen(true);
          }}
        >
          Знакомство с профессиями
        </Button>
      </div>

      {/* Модальное окно с развернутым описанием */}
      {selectedProfession !== null && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedProfession(null)}
        >
          <div
            className="bg-white rounded-[40px] w-full max-w-md max-h-[90vh] overflow-y-auto relative flex flex-col animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-20 px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <span className="font-semibold text-gray-800">Описание профессии</span>
              <button
                onClick={() => setSelectedProfession(null)}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedProfession !== null && (() => {
                const profession = professions[selectedProfession];
                const Icon = profession.icon;
                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#4A90E2]/10 text-[#4A90E2] shrink-0">
                        <Icon size={32} strokeWidth={2} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                        {profession.title}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                        {profession.fullDescription}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно с видео */}
      {isProfessionsVideoOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsProfessionsVideoOpen(false)}
        >
          <div
            className="bg-white rounded-[40px] w-full max-w-md max-h-[90vh] overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <span className="font-semibold text-gray-800">Знакомство с профессиями</span>
              <button
                onClick={() => setIsProfessionsVideoOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative w-full aspect-video bg-black rounded-[28px] overflow-hidden shadow-[0_24px_70px_-10px_rgba(74,144,226,0.5)] border-4 border-white/20">
                <video
                  className="w-full h-full object-contain"
                  playsInline
                  preload="metadata"
                  controls
                >
                  {isIOS ? (
                    <source
                      src={professionsVideoUrl}
                      type="video/mp4; codecs=avc1.42E01E, mp4a.40.2"
                    />
                  ) : (
                    <source src={professionsVideoUrl} type="video/mp4" />
                  )}
                </video>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Если нужно заменить видео — дай ссылку, я подключу через `VITE_PROFESSIONS_VIDEO_URL`.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
