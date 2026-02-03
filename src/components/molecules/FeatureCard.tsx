import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { type LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  iconColor = 'text-[#4A90E2]'
}: FeatureCardProps) => {
  return (
    <Card asymmetry className="flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 ${iconColor}`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
        <Heading level={3} className="mb-2">{title}</Heading>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};
