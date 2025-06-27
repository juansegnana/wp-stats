"use client";

import type React from "react";

import { useState } from "react";
import {
  Upload,
  FileText,
  BarChart3,
  MessageCircle,
  ImageIcon,
  Globe,
  UserX,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChatAnalysis } from "@/components/chat-analysis";
import { AnalysisData } from "@/types/analysis";

const translations = {
  es: {
    title: "Analizador de Chats de WhatsApp",
    subtitle:
      "Sube tu archivo de exportación de WhatsApp y descubre información sobre tus conversaciones",
    uploadTitle: "Subir archivo de chat",
    uploadDescription:
      "Selecciona tu archivo de exportación de WhatsApp (.txt) para comenzar el análisis",
    clickToUpload: "Haz clic para subir",
    dragAndDrop: "o arrastra y suelta tu archivo .txt aquí",
    selected: "Seleccionado",
    size: "Tamaño",
    analyzing: "Analizando chat...",
    analyzeButton: "Analizar Chat",
    analyzingButton: "Analizando...",
    howToExport: "Cómo exportar tu chat de WhatsApp:",
    step1: "1. Abre WhatsApp y ve al chat que quieres analizar",
    step2: "2. Toca el menú de tres puntos → Más → Exportar chat",
    step3: "3. Elige 'Sin archivos multimedia' para obtener un archivo .txt",
    step4: "4. Sube el archivo exportado aquí",
    resultsTitle: "Resultados del Análisis del Chat",
    analyzeAnother: "Analizar Otro Chat",
    totalMessages: "Mensajes Totales",
    totalWords: "Palabras Totales",
    participants: "Participantes",
    duration: "Duración (Días)",
    errorFileType: "Por favor selecciona un archivo .txt",
    errorAnalysis: "Error al analizar el chat",
    language: "Idioma",
    warningTitle: "Aviso importante",
    warningMessage:
      "El análisis actualmente solo funciona correctamente con chats exportados en español. Los chats en otros idiomas pueden no ser analizados correctamente.",
    anonymizeParticipants: "Anonimizar participantes",
    anonymizeDescription: "Reemplazar nombres reales con nombres aleatorios de juegos",
  },
  en: {
    title: "WhatsApp Chat Analyzer",
    subtitle:
      "Upload your WhatsApp chat export and discover insights about your conversations",
    uploadTitle: "Upload Chat File",
    uploadDescription:
      "Select your WhatsApp chat export (.txt file) to begin analysis",
    clickToUpload: "Click to upload",
    dragAndDrop: "or drag and drop your .txt file here",
    selected: "Selected",
    size: "Size",
    analyzing: "Analyzing chat...",
    analyzeButton: "Analyze Chat",
    analyzingButton: "Analyzing...",
    howToExport: "How to export your WhatsApp chat:",
    step1: "1. Open WhatsApp and go to the chat you want to analyze",
    step2: "2. Tap the three dots menu → More → Export chat",
    step3: "3. Choose 'Without Media' to get a .txt file",
    step4: "4. Upload the exported file here",
    resultsTitle: "Chat Analysis Results",
    analyzeAnother: "Analyze Another Chat",
    totalMessages: "Total Messages",
    totalWords: "Total Words",
    participants: "Participants",
    duration: "Duration (Days)",
    errorFileType: "Please select a .txt file",
    errorAnalysis: "Failed to analyze chat",
    language: "Language",
    warningTitle: "Important Notice",
    warningMessage:
      "The analysis currently only works correctly with chats exported in Spanish. Chats in other languages may not be analyzed properly.",
    anonymizeParticipants: "Anonymize participants",
    anonymizeDescription: "Replace real names with random gaming names",
  },
};

export default function WhatsAppAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [anonymizeParticipants, setAnonymizeParticipants] = useState(false);

  const t = translations[language];
  
  // Gaming-themed name generator
  const generateGamingNames = (participants: string[]) => {
    const adjectives = [
      'Shadow', 'Dark', 'Mystic', 'Thunder', 'Fire', 'Ice', 'Storm', 'Night',
      'Steel', 'Golden', 'Silver', 'Crimson', 'Azure', 'Emerald', 'Phantom',
      'Savage', 'Wild', 'Ancient', 'Legendary', 'Epic', 'Divine', 'Eternal'
    ];
    
    const nouns = [
      'Dragon', 'Wolf', 'Eagle', 'Tiger', 'Phoenix', 'Warrior', 'Knight',
      'Mage', 'Hunter', 'Rogue', 'Paladin', 'Assassin', 'Archer', 'Wizard',
      'Berserker', 'Guardian', 'Champion', 'Slayer', 'Templar', 'Vanguard',
      'Sentinel', 'Reaper', 'Titan', 'Gladiator', 'Crusader', 'Ranger'
    ];
    
    const usedNames = new Set<string>();
    const nameMap = new Map<string, string>();
    
    participants.forEach((participant, index) => {
      let gamingName;
      do {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        gamingName = `${adj}${noun}`;
      } while (usedNames.has(gamingName));
      
      usedNames.add(gamingName);
      nameMap.set(participant, gamingName);
    });
    
    return nameMap;
  };
  
  // Anonymize data function
  const anonymizeData = (data: AnalysisData): AnalysisData => {
    if (!anonymizeParticipants) return data;
    
    const nameMap = generateGamingNames(data.summary.participants);
    
    const anonymizedData = { ...data };
    
    // Anonymize participants list
    anonymizedData.summary = {
      ...data.summary,
      participants: data.summary.participants.map(p => nameMap.get(p) || p)
    };
    
    // Anonymize messages_per_participant
    anonymizedData.messages_per_participant = {};
    Object.entries(data.messages_per_participant).forEach(([name, count]) => {
      anonymizedData.messages_per_participant[nameMap.get(name) || name] = count;
    });
    
    // Anonymize message_types_per_participant
    anonymizedData.message_types_per_participant = {};
    Object.entries(data.message_types_per_participant).forEach(([name, types]) => {
      anonymizedData.message_types_per_participant[nameMap.get(name) || name] = types;
    });
    
    // Anonymize word_counts
    anonymizedData.word_counts = {};
    Object.entries(data.word_counts).forEach(([name, count]) => {
      anonymizedData.word_counts[nameMap.get(name) || name] = count;
    });
    
    // Anonymize avg_message_length
    anonymizedData.avg_message_length = {};
    Object.entries(data.avg_message_length).forEach(([name, length]) => {
      anonymizedData.avg_message_length[nameMap.get(name) || name] = length;
    });
    
    return anonymizedData;
  };

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
        setError(t.errorFileType);
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
        throw new Error(t.errorAnalysis);
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
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserX className="h-4 w-4 text-gray-600" />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymize"
                    checked={anonymizeParticipants}
                    onCheckedChange={setAnonymizeParticipants}
                  />
                  <Label htmlFor="anonymize" className="text-sm font-medium">
                    {t.anonymizeParticipants}
                  </Label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <Select
                  value={language}
                  onValueChange={(value: "es" | "en") => setLanguage(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </div>

        {!analysisData ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t.uploadTitle}
              </CardTitle>
              <CardDescription>{t.uploadDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      {t.clickToUpload}
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500">{t.dragAndDrop}</p>
                </div>
              </div>

              {file && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    {t.selected}: {file.name}
                  </p>
                  <p className="text-sm text-green-600">
                    {t.size}: {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}

              <Alert
                variant="destructive"
                className="border-orange-200 bg-orange-50"
              >
                <AlertTitle className="text-orange-800">
                  {t.warningTitle}
                </AlertTitle>
                <AlertDescription className="text-orange-700">
                  {t.warningMessage}
                </AlertDescription>
              </Alert>
              
              {anonymizeParticipants && (
                <Alert className="border-blue-200 bg-blue-50">
                  <UserX className="h-4 w-4" />
                  <AlertTitle className="text-blue-800">
                    {t.anonymizeParticipants}
                  </AlertTitle>
                  <AlertDescription className="text-blue-700">
                    {t.anonymizeDescription}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t.analyzing}</span>
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
                {isAnalyzing ? t.analyzingButton : t.analyzeButton}
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  <strong>{t.howToExport}</strong>
                </p>
                <p>{t.step1}</p>
                <p>{t.step2}</p>
                <p>{t.step3}</p>
                <p>{t.step4}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {t.resultsTitle}
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  setAnalysisData(null);
                  setFile(null);
                }}
              >
                {t.analyzeAnother}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {t.totalMessages}
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
                        {t.totalWords}
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
                        {t.participants}
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
                        {t.duration}
                      </p>
                      <p className="text-2xl font-bold">
                        {analysisData.summary.chat_duration_days.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ChatAnalysis data={anonymizeData(analysisData)} language={language} />
          </div>
        )}
      </div>
    </div>
  );
}
