"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AnalysisData } from "@/types/analysis";

interface ChatAnalysisProps {
  data: AnalysisData;
  language?: "es" | "en";
}

const translations = {
  es: {
    overview: "Resumen",
    timeline: "Cronología",
    participants: "Participantes",
    activity: "Actividad",
    media: "Multimedia",
    messagesByYear: "Mensajes por Año",
    messagesByYearDesc: "Total de mensajes enviados cada año",
    messagesByParticipant: "Mensajes por Participante",
    messagesByParticipantDesc: "Distribución de mensajes entre participantes",
    chatSummary: "Resumen del Chat",
    chatSummaryDesc: "Estadísticas clave sobre tu chat",
    totalMessages: "Mensajes Totales",
    totalWords: "Palabras Totales",
    daysActive: "Días Activos",
    chatPeriod: "Período del Chat",
    monthlyTimeline: "Cronología Mensual de Mensajes",
    monthlyTimelineDesc: "Mensajes enviados a lo largo del tiempo por mes",
    mostActiveDays: "Días Más Activos",
    mostActiveDaysDesc: "Los 10 días con más mensajes",
    messages: "mensajes",
    messageCountByParticipant: "Recuento de Mensajes por Participante",
    messageCountByParticipantDesc:
      "Total de mensajes enviados por cada persona",
    wordCountByParticipant: "Recuento de Palabras por Participante",
    wordCountByParticipantDesc: "Total de palabras escritas por cada persona",
    avgMessageLength: "Longitud Promedio de Mensaje",
    avgMessageLengthDesc:
      "Promedio de caracteres por mensaje para cada participante",
    messagesByHour: "Mensajes por Hora",
    messagesByHourDesc: "Actividad a lo largo del día",
    messagesByWeekday: "Mensajes por Día de la Semana",
    messagesByWeekdayDesc: "Actividad por día de la semana",
    mediaStatistics: "Estadísticas de Multimedia",
    mediaStatisticsDesc: "Desglose de tipos de mensaje",
    text: "Texto",
    images: "Imágenes",
    stickers: "Stickers",
    audio: "Audio",
    video: "Video",
    documents: "Documentos",
    mediaSummary: "Resumen de Multimedia",
    mediaSummaryDesc:
      "Total de multimedia compartido entre todos los participantes",
    totalImages: "Total de Imágenes",
    totalStickers: "Total de Stickers",
    totalAudio: "Total de Audio",
    totalVideos: "Total de Videos",
    totalDocuments: "Total de Documentos",
    month: "Mes",
  },
  en: {
    overview: "Overview",
    timeline: "Timeline",
    participants: "Participants",
    activity: "Activity",
    media: "Media",
    messagesByYear: "Messages by Year",
    messagesByYearDesc: "Total messages sent each year",
    messagesByParticipant: "Messages by Participant",
    messagesByParticipantDesc: "Distribution of messages among participants",
    chatSummary: "Chat Summary",
    chatSummaryDesc: "Key statistics about your chat",
    totalMessages: "Total Messages",
    totalWords: "Total Words",
    daysActive: "Days Active",
    chatPeriod: "Chat Period",
    monthlyTimeline: "Monthly Message Timeline",
    monthlyTimelineDesc: "Messages sent over time by month",
    mostActiveDays: "Most Active Days",
    mostActiveDaysDesc: "Top 10 days with the most messages",
    messages: "messages",
    messageCountByParticipant: "Message Count by Participant",
    messageCountByParticipantDesc: "Total messages sent by each person",
    wordCountByParticipant: "Word Count by Participant",
    wordCountByParticipantDesc: "Total words written by each person",
    avgMessageLength: "Average Message Length",
    avgMessageLengthDesc: "Average characters per message for each participant",
    messagesByHour: "Messages by Hour",
    messagesByHourDesc: "Activity throughout the day",
    messagesByWeekday: "Messages by Day of Week",
    messagesByWeekdayDesc: "Activity by weekday",
    mediaStatistics: "Media Statistics",
    mediaStatisticsDesc: "Breakdown of message types",
    text: "Text",
    images: "Images",
    stickers: "Stickers",
    audio: "Audio",
    video: "Video",
    documents: "Documents",
    mediaSummary: "Media Summary",
    mediaSummaryDesc: "Total media shared across all participants",
    totalImages: "Total Images",
    totalStickers: "Total Stickers",
    totalAudio: "Total Audio",
    totalVideos: "Total Videos",
    totalDocuments: "Total Documents",
    month: "Month",
  },
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export function ChatAnalysis({ data, language = "es" }: ChatAnalysisProps) {
  const t = translations[language];
  // Prepare data for charts
  const yearlyData = Object.entries(data.messages_per_year).map(
    ([year, count]) => ({
      year,
      messages: count,
    })
  );

  const monthlyData = Object.entries(data.messages_per_month)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: month.substring(5), // Get MM part
      fullMonth: month,
      messages: count,
    }));

  const participantData = Object.entries(data.messages_per_participant).map(
    ([name, count]) => ({
      name,
      messages: count,
    })
  );

  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour: hour.toString().padStart(2, "0"),
    messages: data.messages_per_hour[hour] || 0,
  }));

  const weekdayData = Object.entries(data.messages_per_weekday).map(
    ([day, count]) => ({
      day,
      messages: count,
    })
  );

  const mediaStatsData = data.summary.participants.map((participant) => {
    const types = data.message_types_per_participant[participant] || {};
    return {
      participant,
      text: types.text || 0,
      image: types.image || 0,
      sticker: types.sticker || 0,
      audio: types.audio || 0,
      video: types.video || 0,
      document: types.document || 0,
    };
  });

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">{t.overview}</TabsTrigger>
        <TabsTrigger value="timeline">{t.timeline}</TabsTrigger>
        <TabsTrigger value="participants">{t.participants}</TabsTrigger>
        <TabsTrigger value="activity">{t.activity}</TabsTrigger>
        <TabsTrigger value="media">{t.media}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.messagesByYear}</CardTitle>
              <CardDescription>{t.messagesByYearDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  messages: {
                    label: "Messages",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="messages" fill="var(--color-messages)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.messagesByParticipant}</CardTitle>
              <CardDescription>{t.messagesByParticipantDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  messages: {
                    label: "Messages",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participantData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="messages"
                    >
                      {participantData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.chatSummary}</CardTitle>
            <CardDescription>{t.chatSummaryDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {data.summary.total_messages.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{t.totalMessages}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {data.summary.total_words.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{t.totalWords}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {data.summary.chat_duration_days}
                </p>
                <p className="text-sm text-gray-600">{t.daysActive}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {data.summary.participants.length}
                </p>
                <p className="text-sm text-gray-600">{t.participants}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>{t.chatPeriod}:</strong> {data.summary.date_range.start}{" "}
                to {data.summary.date_range.end}
              </p>
              <p>
                <strong>{t.participants}:</strong>{" "}
                {data.summary.participants.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeline" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t.monthlyTimeline}</CardTitle>
            <CardDescription>{t.monthlyTimelineDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                messages: {
                  label: "Messages",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fullMonth"
                    tickFormatter={(value) => value.substring(5)}
                  />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => `${t.month}: ${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="var(--color-messages)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.mostActiveDays}</CardTitle>
            <CardDescription>{t.mostActiveDaysDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.most_active_days
                .slice(0, 10)
                .map(([date, count], index) => (
                  <div
                    key={date}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">
                      #{index + 1} {date}
                    </span>
                    <span className="text-blue-600 font-bold">
                      {count} {t.messages}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="participants" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.messageCountByParticipant}</CardTitle>
              <CardDescription>
                {t.messageCountByParticipantDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.messages_per_participant)
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, count]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (count /
                                  Math.max(
                                    ...Object.values(
                                      data.messages_per_participant
                                    )
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold w-16 text-right">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.wordCountByParticipant}</CardTitle>
              <CardDescription>{t.wordCountByParticipantDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.word_counts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, count]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (count /
                                  Math.max(
                                    ...Object.values(data.word_counts)
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold w-16 text-right">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.avgMessageLength}</CardTitle>
            <CardDescription>{t.avgMessageLengthDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.avg_message_length)
                .sort(([, a], [, b]) => b - a)
                .map(([name, avgLength]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="font-medium">{name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (avgLength /
                                Math.max(
                                  ...Object.values(data.avg_message_length)
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold w-16 text-right">
                        {Math.round(avgLength)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.messagesByHour}</CardTitle>
              <CardDescription>{t.messagesByHourDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  messages: {
                    label: "Messages",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="messages" fill="var(--color-messages)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.messagesByWeekday}</CardTitle>
              <CardDescription>{t.messagesByWeekdayDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  messages: {
                    label: "Messages",
                    color: "hsl(var(--chart-5))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekdayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="messages" fill="var(--color-messages)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="media" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.mediaSummary}</CardTitle>
              <CardDescription>{t.mediaSummaryDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  images: {
                    label: t.images,
                    color: "#22c55e",
                  },
                  stickers: {
                    label: t.stickers,
                    color: "#eab308",
                  },
                  audio: {
                    label: t.audio,
                    color: "#a855f7",
                  },
                  video: {
                    label: t.video,
                    color: "#ef4444",
                  },
                  documents: {
                    label: t.documents,
                    color: "#6b7280",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: t.images,
                          value: mediaStatsData.reduce((sum, p) => sum + p.image, 0),
                          fill: "#22c55e"
                        },
                        {
                          name: t.stickers,
                          value: mediaStatsData.reduce((sum, p) => sum + p.sticker, 0),
                          fill: "#eab308"
                        },
                        {
                          name: t.audio,
                          value: mediaStatsData.reduce((sum, p) => sum + p.audio, 0),
                          fill: "#a855f7"
                        },
                        {
                          name: t.video,
                          value: mediaStatsData.reduce((sum, p) => sum + p.video, 0),
                          fill: "#ef4444"
                        },
                        {
                          name: t.documents,
                          value: mediaStatsData.reduce((sum, p) => sum + p.document, 0),
                          fill: "#6b7280"
                        }
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(1)}%`
                      }
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { fill: "#22c55e" },
                        { fill: "#eab308" },
                        { fill: "#a855f7" },
                        { fill: "#ef4444" },
                        { fill: "#6b7280" }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.messagesByParticipant} - {t.media}</CardTitle>
              <CardDescription>Media shared by each participant</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  images: {
                    label: t.images,
                    color: "#22c55e",
                  },
                  stickers: {
                    label: t.stickers,
                    color: "#eab308",
                  },
                  audio: {
                    label: t.audio,
                    color: "#a855f7",
                  },
                  video: {
                    label: t.video,
                    color: "#ef4444",
                  },
                  documents: {
                    label: t.documents,
                    color: "#6b7280",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mediaStatsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="participant" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="image" stackId="a" fill="#22c55e" name={t.images} />
                    <Bar dataKey="sticker" stackId="a" fill="#eab308" name={t.stickers} />
                    <Bar dataKey="audio" stackId="a" fill="#a855f7" name={t.audio} />
                    <Bar dataKey="video" stackId="a" fill="#ef4444" name={t.video} />
                    <Bar dataKey="document" stackId="a" fill="#6b7280" name={t.documents} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mediaStatsData.map((participant) => (
            <Card key={participant.participant}>
              <CardHeader>
                <CardTitle>
                  {participant.participant} - {t.mediaStatistics}
                </CardTitle>
                <CardDescription>{t.mediaStatisticsDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {participant.text.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{t.text}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {participant.image.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{t.images}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {participant.sticker.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{t.stickers}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {participant.audio.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{t.audio}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {participant.video.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{t.video}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">
                      {participant.document.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{t.documents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.mediaSummary}</CardTitle>
            <CardDescription>{t.mediaSummaryDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {mediaStatsData
                    .reduce((sum, p) => sum + p.image, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{t.totalImages}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {mediaStatsData
                    .reduce((sum, p) => sum + p.sticker, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{t.totalStickers}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {mediaStatsData
                    .reduce((sum, p) => sum + p.audio, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{t.totalAudio}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {mediaStatsData
                    .reduce((sum, p) => sum + p.video, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{t.totalVideos}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-600">
                  {mediaStatsData
                    .reduce((sum, p) => sum + p.document, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{t.totalDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
