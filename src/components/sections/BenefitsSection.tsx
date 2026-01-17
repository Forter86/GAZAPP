import { Heading } from '../atoms/Heading';
import { BenefitCard } from '../molecules/BenefitCard';

export const BenefitsSection = () => {
  const benefits = [
    {
      number: "01",
      title: "Конкурентная зарплата",
      description: "Достойная оплата труда с учетом опыта и квалификации, премии и надбавки."
    },
    {
      number: "02",
      title: "Социальный пакет",
      description: "Медицинское страхование, корпоративные программы, льготы и компенсации."
    },
    {
      number: "03",
      title: "Стабильность и развитие",
      description: "Работа в надежной компании с возможностями карьерного роста и обучения."
    }
  ];

  return (
    <section className="px-6 py-12 bg-white rounded-3xl mx-4">
      <Heading level={2} className="mb-8 ml-[5px]">Что ты получишь</Heading>
      
      <div className="grid gap-4">
        {benefits.map((benefit, index) => (
          <BenefitCard 
            key={index}
            number={benefit.number}
            title={benefit.title}
            description={benefit.description}
          />
        ))}
      </div>
    </section>
  );
};
