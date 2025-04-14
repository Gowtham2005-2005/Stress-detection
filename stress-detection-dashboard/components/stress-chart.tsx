"use client"

interface StressChartProps {
  stressProb: number
  noStressProb: number
}

export function StressChart({ stressProb, noStressProb }: StressChartProps) {
  // Generate fixed points for the chart - avoiding dynamic path generation
  const timePoints = Array(16).fill(0).map((_, i) => {
    const now = new Date()
    const timePoint = new Date(now.getTime() - (15-i) * 60000) // every minute
    return timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  
  // Create stress trend points
  const stressPoints = Array(16).fill(0).map((_, i) => {
    const seedValue = stressProb / 100
    // Start lower, trend toward the current value
    if (i < 5) {
      return Math.max(10, Math.min(95, stressProb * 0.6 + Math.random() * 10))
    } else if (i < 10) {
      return Math.max(10, Math.min(95, stressProb * 0.8 + Math.random() * 8))
    } else {
      return Math.max(10, Math.min(95, stressProb * 0.9 + Math.random() * 5))
    }
  })
  
  // Create no-stress trend points (roughly inverse of stress)
  const noStressPoints = stressPoints.map(p => Math.max(5, Math.min(95, 100 - p + (Math.random() * 5 - 2.5))))
  
  // Create HRV points (lower when stress is higher)
  const hrvPoints = stressPoints.map(p => {
    const stress = p / 100
    return 70 - (stress * 25) + (Math.random() * 10 - 5)
  })
  
  // Create EDA points (higher when stress is higher)
  const edaPoints = stressPoints.map(p => {
    const stress = p / 100
    return 0.2 + (stress * 0.6) + (Math.random() * 0.1 - 0.05)
  })

  return (
    <div className="w-full h-[400px] flex flex-col space-y-4">
      {/* Main stress chart */}
      <div className="h-[60%] w-full relative border rounded-lg p-4 bg-card/50">
        <div className="absolute top-2 left-4 font-medium text-sm">Stress Probability Over Time</div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-8 bottom-6 flex flex-col justify-between text-xs text-muted-foreground">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        
        {/* X-axis grid lines */}
        <div className="absolute left-8 right-0 top-8 bottom-6 flex flex-col justify-between">
          <div className="border-b border-muted-foreground/20 h-0"></div>
          <div className="border-b border-muted-foreground/20 h-0"></div>
          <div className="border-b border-muted-foreground/20 h-0"></div>
          <div className="border-b border-muted-foreground/20 h-0"></div>
          <div className="border-b border-muted-foreground/20 h-0"></div>
        </div>
        
        {/* Chart area */}
        <div className="absolute left-8 right-0 top-8 bottom-6">
          {/* Draw only with explicit coordinates */}
          <div className="relative w-full h-full">
            {/* Stress line - manual segments */}
            {stressPoints.map((point, i) => {
              if (i === 0) return null
              const prevPoint = stressPoints[i-1]
              const x1 = `${((i-1) / 15) * 100}%`
              const y1 = `${100 - prevPoint}%`
              const x2 = `${(i / 15) * 100}%`
              const y2 = `${100 - point}%`
              
              return (
                <div key={`line-${i}`} 
                  className="absolute bg-red-500" 
                  style={{
                    height: '2px',
                    transformOrigin: '0 0',
                    left: x1,
                    top: y1,
                    width: `${(1/15) * 100}%`,
                    transform: `rotate(${Math.atan2(
                      parseFloat(y2) - parseFloat(y1),
                      parseFloat(x2) - parseFloat(x1)
                    )}rad)`,
                    zIndex: 10
                  }}
                />
              )
            })}
            
            {/* No-stress line - manual segments */}
            {noStressPoints.map((point, i) => {
              if (i === 0) return null
              const prevPoint = noStressPoints[i-1]
              const x1 = `${((i-1) / 15) * 100}%`
              const y1 = `${100 - prevPoint}%`
              const x2 = `${(i / 15) * 100}%`
              const y2 = `${100 - point}%`
              
              return (
                <div key={`noline-${i}`} 
                  className="absolute bg-green-500" 
                  style={{
                    height: '2px',
                    transformOrigin: '0 0',
                    left: x1,
                    top: y1,
                    width: `${(1/15) * 100}%`,
                    transform: `rotate(${Math.atan2(
                      parseFloat(y2) - parseFloat(y1),
                      parseFloat(x2) - parseFloat(x1)
                    )}rad)`,
                    zIndex: 5
                  }}
                />
              )
            })}
            
            {/* Data points - stress */}
            {stressPoints.map((point, i) => (
              <div 
                key={`stress-point-${i}`}
                className="absolute w-2 h-2 rounded-full bg-red-500 border border-white"
                style={{
                  left: `calc(${(i / 15) * 100}% - 3px)`,
                  top: `calc(${100 - point}% - 3px)`,
                  zIndex: 20
                }}
              />
            ))}
            
            {/* Data points - no stress */}
            {noStressPoints.map((point, i) => (
              <div 
                key={`nostress-point-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-green-500 border border-white"
                style={{
                  left: `calc(${(i / 15) * 100}% - 2px)`,
                  top: `calc(${100 - point}% - 2px)`,
                  zIndex: 15
                }}
              />
            ))}
            
            {/* Current values highlight */}
            <div
              className="absolute w-4 h-4 rounded-full bg-red-500 border-2 border-white"
              style={{
                left: `calc(100% - 4px)`,
                top: `calc(${100 - stressProb}% - 4px)`,
                zIndex: 25
              }}
            />
            <div
              className="absolute w-3 h-3 rounded-full bg-green-500 border-2 border-white"
              style={{
                left: `calc(100% - 3px)`,
                top: `calc(${100 - noStressProb}% - 3px)`,
                zIndex: 24
              }}
            />
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="absolute left-8 right-0 bottom-0 flex justify-between text-xs text-muted-foreground">
          {timePoints.filter((_, i) => i % 3 === 0 || i === 15).map((time, i) => (
            <span key={`time-${i}`}>{time}</span>
          ))}
        </div>
        
        {/* Legend */}
        <div className="absolute top-2 right-4 flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs">Stress ({stressProb}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs">No Stress ({noStressProb}%)</span>
          </div>
        </div>
      </div>
      
      {/* Secondary indicators chart */}
      <div className="h-[35%] w-full relative border rounded-lg p-4 bg-card/50">
        <div className="absolute top-2 left-4 font-medium text-sm">Physiological Indicators</div>
        
        {/* Chart area */}
        <div className="absolute left-8 right-0 top-8 bottom-6">
          <div className="relative w-full h-full">
            {/* HRV line - manual segments */}
            {hrvPoints.map((point, i) => {
              if (i === 0) return null
              const prevPoint = hrvPoints[i-1]
              const x1 = `${((i-1) / 15) * 100}%`
              const y1 = `${100 - ((prevPoint - 30) * 1.5)}%`
              const x2 = `${(i / 15) * 100}%`
              const y2 = `${100 - ((point - 30) * 1.5)}%`
              
              return (
                <div key={`hrv-line-${i}`} 
                  className="absolute bg-blue-500" 
                  style={{
                    height: '2px',
                    transformOrigin: '0 0',
                    left: x1,
                    top: y1,
                    width: `${(1/15) * 100}%`,
                    transform: `rotate(${Math.atan2(
                      parseFloat(y2) - parseFloat(y1),
                      parseFloat(x2) - parseFloat(x1)
                    )}rad)`,
                    zIndex: 10
                  }}
                />
              )
            })}
            
            {/* EDA line - manual segments */}
            {edaPoints.map((point, i) => {
              if (i === 0) return null
              const prevPoint = edaPoints[i-1]
              const x1 = `${((i-1) / 15) * 100}%`
              const y1 = `${100 - (prevPoint * 100)}%`
              const x2 = `${(i / 15) * 100}%`
              const y2 = `${100 - (point * 100)}%`
              
              return (
                <div key={`eda-line-${i}`} 
                  className="absolute bg-purple-500" 
                  style={{
                    height: '2px',
                    transformOrigin: '0 0',
                    left: x1,
                    top: y1,
                    width: `${(1/15) * 100}%`,
                    transform: `rotate(${Math.atan2(
                      parseFloat(y2) - parseFloat(y1),
                      parseFloat(x2) - parseFloat(x1)
                    )}rad)`,
                    zIndex: 5
                  }}
                />
              )
            })}
          </div>
        </div>
        
        {/* Y-axis labels - left side (HRV) */}
        <div className="absolute left-0 top-8 bottom-6 flex flex-col justify-between text-xs text-blue-500">
          <span>90</span>
          <span>60</span>
          <span>30</span>
        </div>
        
        {/* Y-axis labels - right side (EDA) */}
        <div className="absolute right-0 top-8 bottom-6 flex flex-col justify-between text-xs text-purple-500">
          <span>1.0</span>
          <span>0.6</span>
          <span>0.2</span>
        </div>
        
        {/* Legend */}
        <div className="absolute top-2 right-4 flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs">HRV (ms)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span className="text-xs">EDA (μS)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
