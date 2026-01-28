import { Heading } from '../atoms/Heading';

export const BenefitsSection = () => {
  const benefits = [
    {
      title: "Конкурентная зарплата",
      description: "Достойная оплата труда с учетом опыта и квалификации, премии и надбавки."
    },
    {
      title: "Социальный пакет",
      description: "Медицинское страхование, санаторно-курортное лечение, льготы и компенсации."
    },
    {
      title: "Корпоративное обучение",
      description: "Программы повышения квалификации, тренинги и доступ к базе знаний."
    },
    {
      title: "Карьерный рост",
      description: "Реальные возможности для профессионального и карьерного развития внутри компании."
    },
    {
      title: "Надежность",
      description: "Работа в стабильной государственной компании с уверенностью в завтрашнем дне."
    }
  ];

  return (
    <section className="px-0 py-8 relative">
      <div className="px-6">
        <Heading level={2} className="mb-8">Что ты получишь</Heading>
      </div>

      <div className="flex flex-col gap-4 px-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-[24px] p-6 border border-[#E8E8E8] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Decorative element on hover */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#4A90E2] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <h3 className="text-xl font-bold mb-2 text-[#1A1A1A] group-hover:text-[#4A90E2] transition-colors">
              {benefit.title}
            </h3>
            <p className="text-gray-500 text-base leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
