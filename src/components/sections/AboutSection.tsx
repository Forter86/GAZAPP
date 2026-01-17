import { Heading } from '../atoms/Heading';
import { FeatureCard } from '../molecules/FeatureCard';
import { Zap, Users, Code } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section className="px-6 py-1">
      <Heading level={2} className="mb-8">О работе</Heading>
      
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
