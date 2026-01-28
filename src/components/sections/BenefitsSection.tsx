import { Heading } from '../atoms/Heading';

export const BenefitsSection = () => {
  const benefits = [
    {
      title: "Корпоративная культура",
      description: "Проведение культурных, спортивных, развлекательных мероприятий и конкурсов. Организация досуга."
    },
    {
      title: "Научная деятельность",
      description: "Рационализаторская деятельность с вознаграждением и участие в научно‑практических конференциях различного уровня."
    },
    {
      title: "Конкурсы профессионального мастерства",
      description: "Соревнование среди сотрудников за звание лучшего в профессии, направленное на демонстрацию мастерства, повышение квалификации и обмен опытом."
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
