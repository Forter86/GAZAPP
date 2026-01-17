import { Heading } from '../atoms/Heading';
import { Card } from '../atoms/Card';
import { Briefcase, Wrench, HardHat, Cog, Shield, Zap } from 'lucide-react';

export const ProfessionSection = () => {
  const professions = [
    {
      icon: Wrench,
      title: "Инженер-механик",
      description: "Обслуживание и ремонт газотранспортного оборудования"
    },
    {
      icon: HardHat,
      title: "Инженер-строитель",
      description: "Строительство и реконструкция объектов газотранспорта"
    },
    {
      icon: Cog,
      title: "Инженер-технолог",
      description: "Оптимизация технологических процессов транспортировки газа"
    },
    {
      icon: Shield,
      title: "Специалист по охране труда",
      description: "Обеспечение безопасности производственных процессов"
    },
    {
      icon: Zap,
      title: "Электромонтер",
      description: "Обслуживание электрооборудования и систем автоматизации"
    },
    {
      icon: Briefcase,
      title: "Экономист",
      description: "Планирование и анализ экономической деятельности"
    }
  ];

  return (
    <section className="px-6 py-12 bg-white rounded-3xl mx-4 relative overflow-hidden">
      <Heading level={2} className="mb-8 relative z-10 pt-4">Выбери свою профессию</Heading>
      
      <div className="grid gap-4 relative z-10">
        {professions.map((profession, index) => {
          const Icon = profession.icon;
          return (
            <Card key={index} className="flex gap-4 items-start border-l-4 border-[#4A90E2] rounded-l-2xl !rounded-[40px] relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#4A90E2]/10 text-[#4A90E2] shrink-0">
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">{profession.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{profession.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

