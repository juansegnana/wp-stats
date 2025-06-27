"use client";

import type React from "react";

import { useState } from "react";
import {
  Upload,
  FileText,
  BarChart3,
  MessageCircle,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChatAnalysis } from "@/components/chat-analysis";

interface AnalysisData {
  summary: {
    total_messages: number;
    participants: string[];
    date_range: {
      start: string;
      end: string;
    };
    total_words: number;
    chat_duration_days: number;
  };
  messages_per_year: Record<string, number>;
  messages_per_month: Record<string, number>;
  messages_per_participant: Record<string, number>;
  message_types_per_participant: Record<string, Record<string, number>>;
  messages_per_hour: Record<string, number>;
  messages_per_weekday: Record<string, number>;
  most_active_days: [string, number][];
  word_counts: Record<string, number>;
  avg_message_length: Record<string, number>;
}

export default function WhatsAppAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "text/plain" ||
        selectedFile.name.endsWith(".txt")
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please select a .txt file");
      }
    }
  };

  const analyzeChat = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/analyze-chat", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error("Failed to analyze chat");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            WhatsApp Chat Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Upload your WhatsApp chat export and discover insights about your
            conversations
          </p>
        </div>

        {!analysisData ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Chat File
              </CardTitle>
              <CardDescription>
                Select your WhatsApp chat export (.txt file) to begin analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    or drag and drop your .txt file here
                  </p>
                </div>
              </div>

              {file && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Selected: {file.name}
                  </p>
                  <p className="text-sm text-green-600">
                    Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyzing chat...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              <Button
                onClick={analyzeChat}
                disabled={!file || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Chat"}
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  <strong>How to export your WhatsApp chat:</strong>
                </p>
                <p>1. Open WhatsApp and go to the chat you want to analyze</p>
                <p>2. Tap the three dots menu → More → Export chat</p>
                <p>3. Choose "Without Media" to get a .txt file</p>
                <p>4. Upload the exported file here</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Chat Analysis Results
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  setAnalysisData(null);
                  setFile(null);
                }}
              >
                Analyze Another Chat
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Messages
                      </p>
                      <p className="text-2xl font-bold">
                        {analysisData.summary.total_messages.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Words
                      </p>
                      <p className="text-2xl font-bold">
                        {analysisData.summary.total_words.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Participants
                      </p>
                      <p className="text-2xl font-bold">
                        {analysisData.summary.participants.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Duration (Days)
                      </p>
                      <p className="text-2xl font-bold">
                        {analysisData.summary.chat_duration_days.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ChatAnalysis data={analysisData} />
          </div>
        )}
      </div>
    </div>
  );
}
