import { useEffect, useState } from 'react';

interface SkillBarProps {
  skill: string;
  percentage: number;
  color?: string;
}

export function SkillBar({ skill, percentage, color = 'blue' }: SkillBarProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${animatedPercentage}%` }}
        />
      </div>
    </div>
  );
}

interface SkillsSectionProps {
  title: string;
  skills: Array<{
    name: string;
    level: number;
    color?: string;
  }>;
}

export function SkillsSection({ title, skills }: SkillsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <SkillBar key={index} skill={skill.name} percentage={skill.level} color={skill.color} />
        ))}
      </div>
    </div>
  );
}
