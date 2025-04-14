"use client"

import { useSidebar } from "@/components/sidebar-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Mic, Activity, BarChart3, Brain } from "lucide-react"

export function ModelInfo() {
  const { activeMode } = useSidebar()

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Stress Detection AI</h1>
        <p className="text-muted-foreground">Multi-modal stress detection using transformer models</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About the System</CardTitle>
              <CardDescription>Understanding the stress detection capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This AI-powered stress detection system uses transformer-based models to analyze multiple modalities of
                data for detecting stress indicators. The system can process text, speech, physiological signals, or a
                combination of all three to provide comprehensive stress analysis.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <Card>
                  <CardHeader className="py-2">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <CardTitle className="text-sm">Text Analysis</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Analyzes written content for stress indicators, sentiment, and stress-related language patterns.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <div className="flex items-center space-x-2">
                      <Mic className="h-4 w-4" />
                      <CardTitle className="text-sm">Voice Analysis</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Detects stress through voice patterns, pitch variations, speaking rate, and vocal stress markers.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <CardTitle className="text-sm">Signal Analysis</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Processes physiological signals like HRV, EDA, ECG, RESP, TEMP, and BVP to identify stress
                      indicators.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <CardTitle className="text-sm">Combined Analysis</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Integrates all modalities for a comprehensive stress assessment with higher accuracy and
                      confidence.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Models</CardTitle>
              <CardDescription>Technical details about the transformer models used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    Text Analysis Model
                  </h3>
                  <p className="mt-1 text-sm">
                    A fine-tuned transformer model based on RoBERTa architecture, specifically trained on stress-related
                    text corpora. The model identifies linguistic patterns, emotional content, and stress indicators in
                    written text.
                  </p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Architecture: RoBERTa-base</li>
                      <li>Parameters: 125M</li>
                      <li>Training data: 1.2M stress-related text samples</li>
                      <li>Accuracy: 92% on benchmark datasets</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    Voice Analysis Model
                  </h3>
                  <p className="mt-1 text-sm">
                    A Wav2Vec2-based model fine-tuned on stress-related speech patterns. The model analyzes acoustic
                    features, prosody, and speech characteristics to detect stress indicators.
                  </p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Architecture: Wav2Vec2</li>
                      <li>Parameters: 95M</li>
                      <li>Training data: 800 hours of annotated speech</li>
                      <li>Accuracy: 88% on benchmark datasets</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    Signal Analysis Model
                  </h3>
                  <p className="mt-1 text-sm">
                    A custom transformer architecture designed for time-series physiological data. The model processes
                    multiple signal channels simultaneously to detect stress patterns.
                  </p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Architecture: Custom Transformer</li>
                      <li>Parameters: 75M</li>
                      <li>Training data: 50,000 hours of physiological recordings</li>
                      <li>Accuracy: 94% on benchmark datasets</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    Combined Analysis Model
                  </h3>
                  <p className="mt-1 text-sm">
                    A multi-modal fusion transformer that integrates outputs from all three specialized models. This
                    model weighs and combines evidence from different modalities for a comprehensive stress assessment.
                  </p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Architecture: Multi-modal Fusion Transformer</li>
                      <li>Parameters: 150M</li>
                      <li>Training approach: Multi-task learning</li>
                      <li>Accuracy: 96% on benchmark datasets</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stress Detection Thresholds</CardTitle>
              <CardDescription>Understanding how stress is classified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 px-4">HRV</td>
                          <td className="py-2 px-4">{"< 0"}</td>
                          <td className="py-2 px-4">{">= 0"}</td>
                          <td className="py-2 px-4">{"< 0"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">EDA</td>
                          <td className="py-2 px-4">{"> 0.5"}</td>
                          <td className="py-2 px-4">{"<= 0.5"}</td>
                          <td className="py-2 px-4">{"> 0.5"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">ECG</td>
                          <td className="py-2 px-4">{"> 0.3"}</td>
                          <td className="py-2 px-4">{"<= 0.3"}</td>
                          <td className="py-2 px-4">{"> 0.3"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">RESP</td>
                          <td className="py-2 px-4">{"< 0"}</td>
                          <td className="py-2 px-4">{">= 0"}</td>
                          <td className="py-2 px-4">{"< 0"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">TEMP</td>
                          <td className="py-2 px-4">{"> 0.3"}</td>
                          <td className="py-2 px-4">{"<= 0.3"}</td>
                          <td className="py-2 px-4">{"> 0.3"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">BVP</td>
                          <td className="py-2 px-4">{"> 0.5"}</td>
                          <td className="py-2 px-4">{"<= 0.5"}</td>
                          <td className="py-2 px-4">{"> 0.5"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

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
                        <tr>
                          <td className="py-2 px-4">0</td>
                          <td className="py-2 px-4">No stress</td>
                          <td className="py-2 px-4">20%</td>
                          <td className="py-2 px-4">80%</td>
                          <td className="py-2 px-4">No stress (0)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">1</td>
                          <td className="py-2 px-4">Minimal stress</td>
                          <td className="py-2 px-4">40%</td>
                          <td className="py-2 px-4">60%</td>
                          <td className="py-2 px-4">No stress (0)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">2</td>
                          <td className="py-2 px-4">Mild stress</td>
                          <td className="py-2 px-4">60%</td>
                          <td className="py-2 px-4">40%</td>
                          <td className="py-2 px-4">Stress (1)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">3</td>
                          <td className="py-2 px-4">Moderate stress</td>
                          <td className="py-2 px-4">70%</td>
                          <td className="py-2 px-4">30%</td>
                          <td className="py-2 px-4">Stress (1)</td>
                        </tr>
                        <tr>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Guide</CardTitle>
              <CardDescription>How to use the stress detection system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Text Analysis</h3>
                  <p className="text-sm mt-1">
                    Enter text in the input field on the left sidebar. The system will analyze the content for stress
                    indicators, sentiment, and stress-related language patterns. Ideal for analyzing written
                    communications, journal entries, or social media posts.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Voice Analysis</h3>
                  <p className="text-sm mt-1">
                    Upload an audio file containing speech. The system will analyze voice patterns, pitch variations,
                    speaking rate, and other vocal stress markers. Best for analyzing recorded conversations, voice
                    notes, or speech samples.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Signal Analysis</h3>
                  <p className="text-sm mt-1">
                    Adjust the sliders to input physiological signal values or connect to a compatible biometric device.
                    The system analyzes these signals based on established thresholds to detect stress indicators.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Combined Analysis</h3>
                  <p className="text-sm mt-1">
                    For the most accurate assessment, provide data for all three modalities. The system will perform a
                    comprehensive analysis by integrating evidence from text, voice, and physiological signals.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">API Integration</h3>
                  <p className="text-sm mt-1">
                    The system can be integrated with other applications via the following API endpoints:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-sm">
                    <li>
                      Text Analysis: <code>localhost:8000/api/v1/text/detect</code>
                    </li>
                    <li>
                      Voice Analysis: <code>localhost:8000/api/v1/voice/detect</code>
                    </li>
                    <li>
                      Signal Analysis: <code>localhost:8000/api/v1/signal/detect</code>
                    </li>
                    <li>
                      Combined Analysis: <code>localhost:8000/api/v1/combined/detect</code>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
