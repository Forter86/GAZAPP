import { Heading } from '../atoms/Heading';
import { FeatureCard } from '../molecules/FeatureCard';
import { Zap, Users, Code, Users2 } from 'lucide-react';
import { Card } from '../atoms/Card';

export const AboutSection = () => {
  return (
    <section className="px-6 py-1">
      <Heading level={2} className="mb-8">О работе</Heading>

      <div className="grid gap-6">
        <Card asymmetry className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 text-[#4A90E2]">
            <Users2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <Heading level={3} className="mb-2">Коллектив</Heading>
            <p className="text-gray-600 text-sm leading-relaxed">
              Высококлассные работники, численностью более 8500 человек, осуществляющие одну общую задачу — бесперебойную транспортировку газа потребителям.
            </p>
          </div>
        </Card>

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
