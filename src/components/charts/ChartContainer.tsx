import { Card, CardHeader, CardTitle } from '../common/Card';
import { cn } from '../../utils/cn';

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartContainer({ title, subtitle, className, children, action }: ChartContainerProps) {
  return (
    <Card className={cn('animate-slide-up', className)}>
      {title && (
        <CardHeader>
          <div>
            <CardTitle>{title}</CardTitle>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </CardHeader>
      )}
      {children}
    </Card>
  );
}
