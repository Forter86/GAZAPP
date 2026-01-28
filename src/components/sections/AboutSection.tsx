import { Heading } from '../atoms/Heading';
import { FeatureCard } from '../molecules/FeatureCard';
import { Zap, Users, Code } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section className="px-6 py-1">
      <Heading level={2} className="mb-3">О работе</Heading>

      <div className="mb-8 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E8E8E8]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4A90E2] mb-2">
          Команда мечты
        </p>
        <p className="text-[#1A1A1A] text-base leading-relaxed">
          Высококлассные работники, численностью более 8500 человек, осуществляющие одну общую задачу — бесперебойную транспортировку газа потребителям.
        </p>
      </div>

      <div className="grid gap-6">
        <FeatureCard 
          icon={Zap}
          title="Стабильная работа"
          description="Работа в крупнейшей газотранспортной компании с гарантией стабильности и развития."
          iconColor="text-[#4A90E2]"
        />
        <FeatureCard 
          icon={Users}
          title="Профессиональный рост"
          description="Возможности для карьерного роста, обучение и повышение квалификации за счет компании."
          iconColor="text-[#708090]"
        />
        <FeatureCard 
          icon={Code}
          title="Современные технологии"
          description="Работа с передовым оборудованием и технологиями в сфере транспортировки газа."
          iconColor="text-[#7BB3E8]"
        />
      </div>
    </section>
  );
};
