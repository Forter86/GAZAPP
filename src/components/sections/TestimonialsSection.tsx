import { useState } from 'react';
import { Heading } from '../atoms/Heading';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import alexandrPhoto from '../../assets/Alexandr.jpg';
import denisPhoto from '../../assets/denis.jpg';
import vadimPhoto from '../../assets/Vadim.jpg';
import anastasiaPhoto from '../../assets/anastasia.jpg';

interface Testimonial {
  name: string;
  position: string;
  photo: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Ниясулин Александр',
    position: 'Ведущий инженер по наладке и испытаниям',
    photo: alexandrPhoto,
    text: 'Пришёл в компанию как молодой специалист, и буквально с первых дней включили в важные проекты. Опытные коллеги делились знаниями, наставник всегда был на связи. Сейчас занимаюсь наладкой сложного оборудования — доверяют, уважают, развивают. ООО «Газпром трансгаз Сургут» — отличная стартовая площадка для инженера!'
  },
  {
    name: 'Негру Денис',
    position: 'Инженер I категории',
    photo: denisPhoto,
    text: 'Начал карьеру в производственном подразделении без опыта, но с огромным желанием работать и учиться. Компания обеспечила наставничество, доступ к объектам и внутренние обучающие программы. Уже через пару месяцев стал уверенно выполнять инженерные задачи. Горжусь, что работаю здесь!'
  },
  {
    name: 'Бекчив Вадим',
    position: 'Специалист по кадрам II категории',
    photo: vadimPhoto,
    text: 'Устроился в отдел кадров сразу после выпуска. Несмотря на отсутствие опыта, коллеги поддержали, наставник всё доходчиво объяснил, а руководство дало реальные задачи. Чувствую, что расту как специалист и приношу пользу компании. Выбор ООО «Газпром трансгаз Сургут» считаю правильным.'
  },
  {
    name: 'Цыганова Анастасия',
    position: 'Инженер по подготовке кадров II категории',
    photo: anastasiaPhoto,
    text: 'После университета сразу попала в дружную команду Учебно-производственного центра. Назначили внимательного наставника, помогли освоиться и поверить в свои силы. Работаю с обучением персонала — это и ответственно, и интересно. Очень довольна, что начала карьеру именно в ООО «Газпром трансгаз Сургут»!'
  }
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="px-6 py-16 relative z-30">
      <div className="max-w-md mx-auto">
        {/* Заголовок */}
        <div className="mb-12 text-center">
          <Heading level={2} className="mb-4">
            У нас уже работают молодые специалисты
          </Heading>
          <p className="text-gray-600 text-lg">
            Вот их мнение
          </p>
        </div>

        {/* Контейнер с отзывом */}
        <div className="bg-white rounded-[40px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-8">
          <div className="flex gap-4 items-start">
            {/* Фото слева */}
            <div className="flex-shrink-0">
              <img
                src={currentTestimonial.photo}
                alt={currentTestimonial.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#4A90E2] bg-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name)}&size=120&background=4A90E2&color=fff&bold=true`;
                }}
              />
            </div>

            {/* Отзыв справа */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-1">
                {currentTestimonial.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {currentTestimonial.position}
              </p>
              <p className="text-[#1A1A1A] leading-relaxed">
                {currentTestimonial.text}
              </p>
            </div>
          </div>
        </div>

        {/* Навигация: точки и стрелки */}
        <div className="flex items-center justify-center gap-4">
          {/* Стрелка влево */}
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgb(0,0,0,0.1)] flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft className="w-5 h-5 text-[#4A90E2]" />
          </button>

          {/* Точки-индикаторы */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                  ? 'bg-[#4A90E2] w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Перейти к отзыву ${index + 1}`}
              />
            ))}
          </div>

          {/* Стрелка вправо */}
          <button
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgb(0,0,0,0.1)] flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Следующий отзыв"
          >
            <ChevronRight className="w-5 h-5 text-[#4A90E2]" />
          </button>
        </div>
      </div>
    </section>
  );
};

