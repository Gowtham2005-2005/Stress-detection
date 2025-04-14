"use client"

import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"

interface SignalChartProps {
  signals: {
    HRV: number
    EDA: number
    ECG: number
    RESP: number
    TEMP: number
    BVP: number
  }
  indicators: {
    HRV: boolean
    EDA: boolean
    ECG: boolean
    RESP: boolean
    TEMP: boolean
    BVP: boolean
  }
}

export function SignalChart({ signals, indicators }: SignalChartProps) {
  // Define signal colors and thresholds
  const signalConfig = {
    HRV: { color: '#3b82f6', stressThreshold: '< 0', maxValue: 1 },
    EDA: { color: '#ef4444', stressThreshold: '> 0.5', maxValue: 1 },
    ECG: { color: '#16a34a', stressThreshold: '> 0.3', maxValue: 1 },
    RESP: { color: '#8b5cf6', stressThreshold: '< 0', maxValue: 1 },
    TEMP: { color: '#f59e0b', stressThreshold: '> 0.3', maxValue: 1 },
    BVP: { color: '#ec4899', stressThreshold: '> 0.5', maxValue: 1 }
  };

  // Calculate percentage for visualization
  const getPercentage = (value: number, key: string) => {
    const config = signalConfig[key as keyof typeof signalConfig];
    const maxVal = config.maxValue;
    
    // For signals where stress is < 0
    if (key === 'HRV' || key === 'RESP') {
      return Math.max(0, Math.min(100, (value < 0 ? Math.abs(value) : 0) / maxVal * 100));
    }
    
    // For signals where stress is > threshold
    return Math.max(0, Math.min(100, (value / maxVal) * 100));
  };

  return (
    <div className="w-full">
      {/* Radar Visualization (Circular) */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-[300px] h-[300px]">
          {/* Center point */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-primary rounded-full z-10"></div>
          
          {/* Background circles */}
          <div className="absolute top-0 left-0 w-full h-full rounded-full border border-muted-foreground/20"></div>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full border border-muted-foreground/20"></div>
          
          {/* Signal axes */}
          {Object.entries(signals).map(([key, value], index) => {
            const angle = (index * 60) * (Math.PI / 180);
            const isStress = indicators[key as keyof typeof indicators];
            const percentage = getPercentage(value, key);
            const config = signalConfig[key as keyof typeof signalConfig];
            
            return (
              <div key={key}>
                {/* Axis line */}
                <div 
                  className="absolute top-1/2 left-1/2 w-[150px] h-0.5 bg-muted-foreground/20 origin-left"
                  style={{ transform: `rotate(${angle}rad)` }}
                ></div>
                
                {/* Signal data point */}
                <div 
                  className={`absolute w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500`}
                  style={{ 
                    backgroundColor: isStress ? config.color : 'rgba(255,255,255,0.1)',
                    border: `2px solid ${config.color}`,
                    left: `calc(50% + ${Math.cos(angle) * (percentage * 1.4)}px)`,
                    top: `calc(50% + ${Math.sin(angle) * (percentage * 1.4)}px)`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5
                  }}
                ></div>
                
                {/* Signal label */}
                <div 
                  className="absolute font-medium text-sm"
                  style={{ 
                    left: `calc(50% + ${Math.cos(angle) * 160}px)`,
                    top: `calc(50% + ${Math.sin(angle) * 160}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {key}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Signal Values (Linear) */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(signals).map(([key, value]) => {
          const isStress = indicators[key as keyof typeof indicators];
          const percentage = getPercentage(value, key);
          const config = signalConfig[key as keyof typeof signalConfig];
          
          return (
            <Card key={key} className={`overflow-hidden border ${isStress ? 'border-red-500' : 'border-green-500'}`}>
              <CardContent className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{key}</span>
                  <span>{value.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: config.color
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                  <span>Threshold: {config.stressThreshold}</span>
                  <span>{isStress ? 'Stress' : 'Normal'}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
