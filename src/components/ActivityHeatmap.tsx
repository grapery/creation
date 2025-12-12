import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ActivityHeatmapProps {
  data?: ActivityDay[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Generate mock data for the last 12 weeks
  const heatmapData = useMemo(() => {
    if (data) return data;
    
    const days: ActivityDay[] = [];
    const today = new Date();
    
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Random activity count
      const count = Math.floor(Math.random() * 15);
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      
      if (count === 0) level = 0;
      else if (count <= 3) level = 1;
      else if (count <= 6) level = 2;
      else if (count <= 9) level = 3;
      else level = 4;
      
      days.push({
        date: date.toISOString().split('T')[0],
        count,
        level,
      });
    }
    
    return days;
  }, [data]);

  // Group days into weeks
  const weeks = useMemo(() => {
    const weeksArray: ActivityDay[][] = [];
    let currentWeek: ActivityDay[] = [];
    
    heatmapData.forEach((day, index) => {
      currentWeek.push(day);
      
      const dayOfWeek = new Date(day.date).getDay();
      if (dayOfWeek === 6 || index === heatmapData.length - 1) {
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeksArray;
  }, [heatmapData]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-muted';
      case 1:
        return 'bg-green-200 dark:bg-green-900';
      case 2:
        return 'bg-green-400 dark:bg-green-700';
      case 3:
        return 'bg-green-600 dark:bg-green-500';
      case 4:
        return 'bg-green-800 dark:bg-green-400';
      default:
        return 'bg-muted';
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-3 w-3 rounded-sm ${getLevelColor(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const date = new Date(day.date);
                const monthName = months[date.getMonth()];
                const dayName = days[date.getDay()];
                
                return (
                  <TooltipProvider key={day.date}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-3 w-3 rounded-sm ${getLevelColor(day.level)} hover:ring-2 hover:ring-primary transition-all cursor-pointer`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{day.count} activities on {monthName} {date.getDate()}, {date.getFullYear()}</p>
                        <p className="text-muted-foreground">{dayName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
