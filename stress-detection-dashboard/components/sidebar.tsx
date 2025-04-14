"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, Mic, Activity, BarChart3, ChevronDown } from "lucide-react"
import { useSidebar } from "@/components/sidebar-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoadingDots } from "@/components/loading-dots"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { 
  detectStressFromText, 
  detectStressFromVoice, 
  detectStressFromSignals, 
  detectStressFromCombined 
} from "@/lib/api";
import { 
  transformTextResponse, 
  transformVoiceResponse, 
  transformSignalResponse, 
  transformCombinedResponse 
} from "@/lib/transformers";
import { fileToBase64 } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Sidebar() {
  const { 
    activeMode, 
    setActiveMode, 
    isLoading, 
    setIsLoading, 
    setResults, 
    text, 
    setText,
    error,
    setError
  } = useSidebar();
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [signalValues, setSignalValues] = useState({
    HRV: 0,
    EDA: 0,
    ECG: 0,
    RESP: 0,
    TEMP: 0,
    BVP: 0,
  })

  const handleModeChange = (mode: "text" | "voice" | "signal" | "combined") => {
    setActiveMode(mode);
    setResults(null);
    setError(null); // Clear any previous error when changing modes
  }

  const handleDetect = async () => {
    setIsLoading(true);
    setError(null); // Clear any previous error

    try {
      let result;

      switch (activeMode) {
        case "text":
          if (!text.trim()) {
            throw new Error("Please enter some text to analyze")
          }
          console.log("Sending text data:", { text });
          const textResponse = await detectStressFromText(text);
          console.log("Received text response:", textResponse);
          result = transformTextResponse(textResponse, text);
          break;
          
        case "voice":
          if (!audioFile) {
            throw new Error("Please upload an audio file to analyze")
          }
          
          // Convert the audio file to base64
          const audioBase64 = await fileToBase64(audioFile);
          console.log("Sending voice data, file size:", audioBase64.length);
          const voiceResponse = await detectStressFromVoice(audioBase64);
          console.log("Received voice response:", voiceResponse);
          result = transformVoiceResponse(voiceResponse);
          break;
          
        case "signal":
          // The backend expects signals as either a dictionary or a 2D array
          // Format the signals to match what the backend expects
          console.log("Sending signal data:", signalValues);
          const signalResponse = await detectStressFromSignals(signalValues);
          console.log("Received signal response:", signalResponse);
          result = transformSignalResponse(signalResponse, signalValues);
          break;
          
        case "combined":
          if (!text.trim()) {
            throw new Error("Please enter some text to analyze")
          }
          
          // Convert audio file to base64 if available
          let combinedAudioBase64 = "";
          if (audioFile) {
            combinedAudioBase64 = await fileToBase64(audioFile);
          }
          
          console.log("Sending combined data:", { text, audioSize: combinedAudioBase64.length, signals: signalValues });
          const combinedResponse = await detectStressFromCombined(
            text, 
            combinedAudioBase64, 
            signalValues
          );
          console.log("Received combined response:", combinedResponse);
          result = transformCombinedResponse(combinedResponse, text);
          break;
      }

      console.log("Transformed result for UI:", result);
      setResults(result);
    } catch (error) {
      console.error("Error detecting stress:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unknown error occurred";
      
      setError(errorMessage);
      setResults(null); // Clear any previous results on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignalChange = (key: keyof typeof signalValues, value: number[]) => {
    setSignalValues((prev) => ({
      ...prev,
      [key]: value[0],
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0])
    }
  }

  return (
    <div className="w-80 border-r bg-background h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Stress Detection AI</h1>
        <p className="text-sm text-muted-foreground">Detect stress through multiple modalities</p>
      </div>

      <div className="p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {activeMode === "text" && "Text Analysis"}
              {activeMode === "voice" && "Voice Analysis"}
              {activeMode === "signal" && "Signal Analysis"}
              {activeMode === "combined" && "Combined Analysis"}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => handleModeChange("text")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Text Analysis</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeChange("voice")}>
              <Mic className="mr-2 h-4 w-4" />
              <span>Voice Analysis</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeChange("signal")}>
              <Activity className="mr-2 h-4 w-4" />
              <span>Signal Analysis</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeChange("combined")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Combined Analysis</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {activeMode === "text" || activeMode === "combined" ? (
          <div className="mb-4">
            <div className="bg-background rounded-lg border overflow-hidden">
              {/* Instagram-style header */}
              <div className="flex items-center p-3 border-b">
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

              {/* Simplified chat area */}
              <div className="p-3 h-[200px] bg-muted/20 overflow-y-auto">
                {text && (
                  <div className="flex justify-end mb-2">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-2 max-w-[80%]">
                      <p className="text-sm">{text}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instagram-style input */}
              <div className="p-2 border-t">
                <div className="flex items-center space-x-2 bg-muted p-2 rounded-full">
                  <Input
                    id="text-input"
                    placeholder="Message..."
                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="rounded-full bg-primary hover:bg-primary/90 h-8 w-8 p-0"
                    onClick={handleDetect}
                    disabled={isLoading || !text}
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
          </div>
        ) : null}

        {activeMode === "voice" || activeMode === "combined" ? (
          <div className="mb-4">
            <Label htmlFor="voice-input" className="mb-2 block">
              Upload voice recording:
            </Label>
            <Input id="voice-input" type="file" accept="audio/*" onChange={handleFileChange} />
            {audioFile && <p className="text-sm mt-2">Selected: {audioFile.name}</p>}
          </div>
        ) : null}

        {activeMode === "signal" || activeMode === "combined" ? (
          <div className="space-y-4">
            <h3 className="font-medium">Signal Parameters</h3>

            {Object.entries(signalValues).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor={`${key}-slider`}>{key}</Label>
                  <span className="text-sm">{value.toFixed(2)}</span>
                </div>
                <Slider
                  id={`${key}-slider`}
                  min={-1}
                  max={1}
                  step={0.01}
                  value={[value]}
                  onValueChange={(val) => handleSignalChange(key as keyof typeof signalValues, val)}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="p-4 border-t">
        {activeMode === "text" ? (
          <div className="hidden">{/* We're handling the text submission in the input field now */}</div>
        ) : (
          <Button
            className="w-full"
            onClick={handleDetect}
            disabled={isLoading || (activeMode === "voice" && !audioFile)}
          >
            {isLoading ? <LoadingDots /> : "Detect Stress"}
          </Button>
        )}
      </div>
    </div>
  )
}
