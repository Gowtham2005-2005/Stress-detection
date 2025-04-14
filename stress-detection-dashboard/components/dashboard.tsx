"use client"

import { useEffect, useState } from "react"
import { useSidebar } from "@/components/sidebar-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mic, Activity, BarChart3, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { StressChart } from "@/components/stress-chart"
import { SignalChart } from "@/components/signal-chart"
import { ModelInfo } from "@/components/model-info"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { isBackendAvailable } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function InstagramTypingIndicator() {
  return (
    <div className="flex">
      <div className="bg-background border rounded-2xl rounded-tl-sm p-3 shadow-sm">
        <div className="flex space-x-1 items-center h-6">
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { activeMode, isLoading, results, text } = useSidebar()
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')

  // Check backend availability on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const available = await isBackendAvailable()
        setBackendStatus(available ? 'available' : 'unavailable')
      } catch (error) {
        console.error('Error checking backend:', error)
        setBackendStatus('unavailable')
      }
    }
    
    checkBackend()
  }, [])

  // Show backend status message if the backend is unavailable
  if (backendStatus === 'unavailable') {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Backend Connection Error</AlertTitle>
          <AlertDescription>
            Cannot connect to the backend API server. Please make sure it's running at{" "}
            <code className="font-mono">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</code>
            <div className="mt-2">
              <p>To start the backend server, run:</p>
              <pre className="bg-muted p-2 rounded-md mt-1 text-sm">python -m app.main</pre>
            </div>
          </AlertDescription>
        </Alert>
        
        <ModelInfo />
      </div>
    )
  }

  // Show loading state if we're still checking backend status
  if (backendStatus === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="mb-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-medium mb-2">Connecting...</h3>
        <p className="text-muted-foreground">Checking connection to the backend server</p>
      </div>
    )
  }

  if (isLoading) {
    if (activeMode === "text") {
      return (
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Text Analysis</h1>
            <p className="text-muted-foreground">Analyzing your message for stress indicators</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="max-w-md mx-auto bg-background rounded-lg overflow-hidden">
                {/* Instagram-style header */}
                <div className="flex items-center p-4 border-b">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <span className="text-sm font-semibold">AI</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Stress Detection AI</p>
                      <p className="text-xs text-muted-foreground">Active now</p>
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="p-4 space-y-4 h-[400px] bg-muted/30">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                      <p>{text}</p>
                      <p className="text-xs opacity-70 text-right mt-1">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  {/* Instagram typing indicator */}
                  <InstagramTypingIndicator />
                </div>

                {/* Instagram-style input */}
                <div className="p-3 border-t">
                  <div className="flex items-center space-x-2 bg-muted p-2 rounded-full">
                    <Input
                      placeholder="Message..."
                      className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      value=""
                      readOnly
                    />
                    <Button
                      type="button"
                      size="icon"
                      className="rounded-full bg-primary hover:bg-primary/90 h-8 w-8 p-0"
                      disabled
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 rotate-90"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="mb-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-medium mb-2">Analyzing...</h3>
          <p className="text-muted-foreground">Our AI is processing your {activeMode} data</p>
        </div>
      )
    }
  }

  if (!results) {
    return <ModelInfo />
  }

  // Use the transformed data from UIStressResult format
  const stressDetected = results.stress_detected
  // Make sure the classification is consistent with the stress detection result
  let stressClass = results.classification
  // If there's an inconsistency between the API's stress_detected flag and the classification,
  // prioritize the stress_detected flag since it's the main prediction result
  if (stressDetected && stressClass === "No Stress") {
    stressClass = "Stress"
  } else if (!stressDetected && stressClass !== "No Stress") {
    stressClass = "No Stress"
  }
  
  const indicators = results.indicators || {}
  const activeIndicators = Object.values(indicators).filter(Boolean).length

  // Ensure values from API are displayed in correct format
  const displayValues = {
    stressProb: Math.round(results.metrics.stress_probability),
    noStressProb: Math.round(results.metrics.no_stress_probability),
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stress Analysis Results</h1>
          <p className="text-muted-foreground">
            {activeMode === "text" && "Based on text analysis"}
            {activeMode === "voice" && "Based on voice patterns"}
            {activeMode === "signal" && "Based on physiological signals"}
            {activeMode === "combined" && "Based on combined analysis"}
          </p>
        </div>
        <Badge variant={stressDetected ? "destructive" : "outline"} className="text-lg py-1 px-3">
          {stressDetected ? (
            <>
              <AlertTriangle className="mr-1 h-4 w-4" /> Stress Detected
            </>
          ) : (
            <>
              <CheckCircle className="mr-1 h-4 w-4" /> No Stress Detected
            </>
          )}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {activeMode === "text" || activeMode === "combined" ? (
            <TabsTrigger value="text">Text Analysis</TabsTrigger>
          ) : null}
          {activeMode === "voice" || activeMode === "combined" ? (
            <TabsTrigger value="voice">Voice Analysis</TabsTrigger>
          ) : null}
          {activeMode === "signal" || activeMode === "combined" ? (
            <TabsTrigger value="signal">Signal Analysis</TabsTrigger>
          ) : null}
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stress Classification</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stressClass}</div>
                <p className="text-xs text-muted-foreground">
                  {stressDetected 
                    ? `Based on ${activeIndicators > 0 ? activeIndicators : 'AI analysis'} stress indicator${activeIndicators !== 1 ? 's' : ''}`
                    : "No stress indicators detected"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stress Confidence</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayValues.stressProb}%</div>
                <p className="text-xs text-muted-foreground">{stressDetected ? "Above" : "Below"} threshold (50%)</p>
              </CardContent>
            </Card>
            {results.emotion ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emotion Analysis</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{results.emotion}</div>
                  <p className="text-xs text-muted-foreground">
                    Confidence: {results.emotion_confidence ? Math.round(results.emotion_confidence) : 0}%
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Analysis Mode</CardTitle>
                  {activeMode === "text" && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                  {activeMode === "voice" && <Mic className="h-4 w-4 text-muted-foreground" />}
                  {activeMode === "signal" && <Activity className="h-4 w-4 text-muted-foreground" />}
                  {activeMode === "combined" && <BarChart3 className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{activeMode}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeMode === "combined" ? "Multi-modal analysis" : "Single modality analysis"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Stress Probability</CardTitle>
              <CardDescription>Visualization of stress vs. no-stress probability</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <StressChart
                stressProb={displayValues.stressProb}
                noStressProb={displayValues.noStressProb}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {(activeMode === "text" || activeMode === "combined") && (
          <TabsContent value="text" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Text Analysis</CardTitle>
                <CardDescription>Stress indicators detected in text content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto bg-background rounded-lg overflow-hidden">
                  {/* Instagram-style header */}
                  <div className="flex items-center p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <span className="text-sm font-semibold">AI</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Stress Detection AI</p>
                        <p className="text-xs text-muted-foreground">Active now</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat messages */}
                  <div className="p-4 space-y-4 h-[400px] overflow-y-auto bg-muted/30">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                        <p>{text}</p>
                        <p className="text-xs opacity-70 text-right mt-1">
                          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    {/* AI response */}
                    <div className="flex">
                      <div className="bg-background border rounded-2xl rounded-tl-sm p-3 max-w-[80%] shadow-sm">
                        <p className="font-medium mb-1">Stress Detection AI</p>
                        <p>
                          Based on my analysis, I {results.stress_detected ? "detected" : "did not detect"} stress
                          indicators in your message.
                        </p>
                        <p className="mt-2">
                          Classification: <span className="font-medium">{results.classification}</span>
                        </p>
                        <p className="mt-2">
                          Stress confidence:{" "}
                          <span className="font-medium">{results.metrics.stress_probability.toFixed(1)}%</span>
                        </p>
                        {results.text_analysis?.stress_words?.length > 0 && (
                          <div className="mt-2">
                            <p>Stress-related words detected:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {results.text_analysis.stress_words.map((word: string) => (
                                <Badge key={word} variant="secondary" className="text-xs">
                                  {word}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Instagram-style input */}
                  <div className="p-3 border-t">
                    <div className="flex items-center space-x-2 bg-muted p-2 rounded-full">
                      <Input
                        placeholder="Message..."
                        className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        value=""
                        readOnly
                      />
                      <Button
                        type="button"
                        size="icon"
                        className="rounded-full bg-primary hover:bg-primary/90 h-8 w-8 p-0"
                        disabled
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 rotate-90"
                        >
                          <path d="m22 2-7 20-4-9-9-4Z" />
                          <path d="M22 2 11 13" />
                        </svg>
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {(activeMode === "voice" || activeMode === "combined") && (
          <TabsContent value="voice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Voice Analysis</CardTitle>
                <CardDescription>Stress indicators detected in voice patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Pitch Variation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{results.voice_analysis?.pitch_variation?.toFixed(2) || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground">
                          {results.voice_analysis?.pitch_variation > 5
                            ? "High variation (stress indicator)"
                            : "Normal variation"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Speaking Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{results.voice_analysis?.speaking_rate?.toFixed(2) || 'N/A'} wps</div>
                        <p className="text-xs text-muted-foreground">
                          {results.voice_analysis?.speaking_rate > 4
                            ? "Fast speech (stress indicator)"
                            : "Normal speech rate"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Stress Markers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{results.voice_analysis?.stress_markers?.toFixed(2) || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground">
                          {results.voice_analysis?.stress_markers > 5 ? "High (stress detected)" : "Low (normal range)"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {(activeMode === "signal" || activeMode === "combined") && (
          <TabsContent value="signal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Signal Analysis</CardTitle>
                <CardDescription>Stress indicators from physiological signals</CardDescription>
              </CardHeader>
              <CardContent>
                <SignalChart 
                  signals={
                    // Ensure all required values are present, provide defaults if not
                    results.signal_analysis && 
                    Object.keys(results.signal_analysis).length === 6 ?
                    results.signal_analysis : 
                    {
                      HRV: -0.3,  // Stress indicator
                      EDA: 0.7,   // Stress indicator
                      ECG: 0.4,   // Stress indicator
                      RESP: -0.2, // Stress indicator
                      TEMP: 0.5,  // Stress indicator
                      BVP: 0.6    // Stress indicator
                    }
                  } 
                  indicators={
                    results.indicators && 
                    Object.keys(results.indicators).length === 6 ?
                    results.indicators :
                    {
                      HRV: true,
                      EDA: true,
                      ECG: true,
                      RESP: true,
                      TEMP: true,
                      BVP: true
                    }
                  } 
                />

                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(results.indicators || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Badge variant={value ? "destructive" : "outline"}>{key}</Badge>
                      <span className="text-sm">{value ? "Stress indicator" : "Normal range"}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stress Probability</CardTitle>
              <CardDescription>Visualization of stress vs. no-stress probability</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <StressChart
                stressProb={displayValues.stressProb}
                noStressProb={displayValues.noStressProb}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
              <CardDescription>Comprehensive breakdown of all stress indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Stress Classification</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Indicators</th>
                          <th className="text-left py-2 px-4">Classification</th>
                          <th className="text-left py-2 px-4">Stress Confidence</th>
                          <th className="text-left py-2 px-4">No Stress Confidence</th>
                          <th className="text-left py-2 px-4">Prediction</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={activeIndicators === 0 ? "bg-muted/50" : ""}>
                          <td className="py-2 px-4">0</td>
                          <td className="py-2 px-4">No stress</td>
                          <td className="py-2 px-4">20%</td>
                          <td className="py-2 px-4">80%</td>
                          <td className="py-2 px-4">No stress (0)</td>
                        </tr>
                        <tr className={activeIndicators === 1 ? "bg-muted/50" : ""}>
                          <td className="py-2 px-4">1</td>
                          <td className="py-2 px-4">Minimal stress</td>
                          <td className="py-2 px-4">40%</td>
                          <td className="py-2 px-4">60%</td>
                          <td className="py-2 px-4">No stress (0)</td>
                        </tr>
                        <tr className={activeIndicators === 2 ? "bg-muted/50" : ""}>
                          <td className="py-2 px-4">2</td>
                          <td className="py-2 px-4">Mild stress</td>
                          <td className="py-2 px-4">60%</td>
                          <td className="py-2 px-4">40%</td>
                          <td className="py-2 px-4">Stress (1)</td>
                        </tr>
                        <tr className={activeIndicators === 3 ? "bg-muted/50" : ""}>
                          <td className="py-2 px-4">3</td>
                          <td className="py-2 px-4">Moderate stress</td>
                          <td className="py-2 px-4">70%</td>
                          <td className="py-2 px-4">30%</td>
                          <td className="py-2 px-4">Stress (1)</td>
                        </tr>
                        <tr className={activeIndicators >= 4 ? "bg-muted/50" : ""}>
                          <td className="py-2 px-4">4+</td>
                          <td className="py-2 px-4">Strong stress</td>
                          <td className="py-2 px-4">80%</td>
                          <td className="py-2 px-4">20%</td>
                          <td className="py-2 px-4">Stress (1)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Signal Thresholds</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Signal</th>
                          <th className="text-left py-2 px-4">Stress Indicator</th>
                          <th className="text-left py-2 px-4">No Stress Range</th>
                          <th className="text-left py-2 px-4">Stress Range</th>
                          <th className="text-left py-2 px-4">Current Value</th>
                          <th className="text-left py-2 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 px-4">HRV</td>
                          <td className="py-2 px-4">{"< 0"}</td>
                          <td className="py-2 px-4">{">= 0"}</td>
                          <td className="py-2 px-4">{"< 0"}</td>
                          <td className="py-2 px-4">{results.signal_analysis?.HRV?.toFixed(2) || "N/A"}</td>
                          <td className="py-2 px-4">
                            <Badge variant={results.indicators?.HRV ? "destructive" : "outline"}>
                              {results.indicators?.HRV ? "Stress" : "Normal"}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">EDA</td>
                          <td className="py-2 px-4">{"> 0.5"}</td>
                          <td className="py-2 px-4">{"<= 0.5"}</td>
                          <td className="py-2 px-4">{"> 0.5"}</td>
                          <td className="py-2 px-4">{results.signal_analysis?.EDA?.toFixed(2) || "N/A"}</td>
                          <td className="py-2 px-4">
                            <Badge variant={results.indicators?.EDA ? "destructive" : "outline"}>
                              {results.indicators?.EDA ? "Stress" : "Normal"}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">ECG</td>
                          <td className="py-2 px-4">{"> 0.3"}</td>
                          <td className="py-2 px-4">{"<= 0.3"}</td>
                          <td className="py-2 px-4">{"> 0.3"}</td>
                          <td className="py-2 px-4">{results.signal_analysis?.ECG?.toFixed(2) || "N/A"}</td>
                          <td className="py-2 px-4">
                            <Badge variant={results.indicators?.ECG ? "destructive" : "outline"}>
                              {results.indicators?.ECG ? "Stress" : "Normal"}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">RESP</td>
                          <td className="py-2 px-4">{"< 0"}</td>
                          <td className="py-2 px-4">{">= 0"}</td>
                          <td className="py-2 px-4">{"< 0"}</td>
                          <td className="py-2 px-4">{results.signal_analysis?.RESP?.toFixed(2) || "N/A"}</td>
                          <td className="py-2 px-4">
                            <Badge variant={results.indicators?.RESP ? "destructive" : "outline"}>
                              {results.indicators?.RESP ? "Stress" : "Normal"}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">TEMP</td>
                          <td className="py-2 px-4">{"> 0.3"}</td>
                          <td className="py-2 px-4">{"<= 0.3"}</td>
                          <td className="py-2 px-4">{"> 0.3"}</td>
                          <td className="py-2 px-4">{results.signal_analysis?.TEMP?.toFixed(2) || "N/A"}</td>
                          <td className="py-2 px-4">
                            <Badge variant={results.indicators?.TEMP ? "destructive" : "outline"}>
                              {results.indicators?.TEMP ? "Stress" : "Normal"}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">BVP</td>
                          <td className="py-2 px-4">{"> 0.5"}</td>
                          <td className="py-2 px-4">{"<= 0.5"}</td>
                          <td className="py-2 px-4">{"> 0.5"}</td>
                          <td className="py-2 px-4">{results.signal_analysis?.BVP?.toFixed(2) || "N/A"}</td>
                          <td className="py-2 px-4">
                            <Badge variant={results.indicators?.BVP ? "destructive" : "outline"}>
                              {results.indicators?.BVP ? "Stress" : "Normal"}
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
