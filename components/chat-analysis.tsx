"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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
} from "recharts"

interface AnalysisData {
  summary: {
    total_messages: number
    participants: string[]
    date_range: {
      start: string
      end: string
    }
    total_words: number
    chat_duration_days: number
  }
  messages_per_year: Record<string, number>
  messages_per_month: Record<string, number>
  messages_per_participant: Record<string, number>
  message_types_per_participant: Record<string, Record<string, number>>
  messages_per_hour: Record<string, number>
  messages_per_weekday: Record<string, number>
  most_active_days: [string, number][]
  word_counts: Record<string, number>
  avg_message_length: Record<string, number>
}

interface ChatAnalysisProps {
  data: AnalysisData
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function ChatAnalysis({ data }: ChatAnalysisProps) {
  // Prepare data for charts
  const yearlyData = Object.entries(data.messages_per_year).map(([year, count]) => ({
    year,
    messages: count,
  }))

  const monthlyData = Object.entries(data.messages_per_month)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: month.substring(5), // Get MM part
      fullMonth: month,
      messages: count,
    }))

  const participantData = Object.entries(data.messages_per_participant).map(([name, count]) => ({
    name,
    messages: count,
  }))

  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour: hour.toString().padStart(2, "0"),
    messages: data.messages_per_hour[hour] || 0,
  }))

  const weekdayData = Object.entries(data.messages_per_weekday).map(([day, count]) => ({
    day,
    messages: count,
  }))

  const mediaStatsData = data.summary.participants.map((participant) => {
    const types = data.message_types_per_participant[participant] || {}
    return {
      participant,
      text: types.text || 0,
      image: types.image || 0,
      sticker: types.sticker || 0,
      audio: types.audio || 0,
      video: types.video || 0,
      document: types.document || 0,
    }
  })

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="participants">Participants</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages by Year</CardTitle>
              <CardDescription>Total messages sent each year</CardDescription>
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
              <CardTitle>Messages by Participant</CardTitle>
              <CardDescription>Distribution of messages among participants</CardDescription>
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="messages"
                    >
                      {participantData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <CardTitle>Chat Summary</CardTitle>
            <CardDescription>Key statistics about your chat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{data.summary.total_messages.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Messages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{data.summary.total_words.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Words</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{data.summary.chat_duration_days}</p>
                <p className="text-sm text-gray-600">Days Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{data.summary.participants.length}</p>
                <p className="text-sm text-gray-600">Participants</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Chat Period:</strong> {data.summary.date_range.start} to {data.summary.date_range.end}
              </p>
              <p>
                <strong>Participants:</strong> {data.summary.participants.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeline" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Message Timeline</CardTitle>
            <CardDescription>Messages sent over time by month</CardDescription>
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
                  <XAxis dataKey="fullMonth" tickFormatter={(value) => value.substring(5)} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} labelFormatter={(value) => `Month: ${value}`} />
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
            <CardTitle>Most Active Days</CardTitle>
            <CardDescription>Top 10 days with the most messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.most_active_days.slice(0, 10).map(([date, count], index) => (
                <div key={date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">
                    #{index + 1} {date}
                  </span>
                  <span className="text-blue-600 font-bold">{count} messages</span>
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
              <CardTitle>Message Count by Participant</CardTitle>
              <CardDescription>Total messages sent by each person</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.messages_per_participant)
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="font-medium">{name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(data.messages_per_participant))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold w-16 text-right">{count.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Word Count by Participant</CardTitle>
              <CardDescription>Total words written by each person</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.word_counts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="font-medium">{name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(data.word_counts))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold w-16 text-right">{count.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Average Message Length</CardTitle>
            <CardDescription>Average characters per message for each participant</CardDescription>
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
                            width: `${(avgLength / Math.max(...Object.values(data.avg_message_length))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold w-16 text-right">{Math.round(avgLength)}</span>
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
              <CardTitle>Messages by Hour</CardTitle>
              <CardDescription>Activity throughout the day</CardDescription>
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
              <CardTitle>Messages by Day of Week</CardTitle>
              <CardDescription>Activity by weekday</CardDescription>
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
        <div className="grid grid-cols-1 gap-4">
          {mediaStatsData.map((participant) => (
            <Card key={participant.participant}>
              <CardHeader>
                <CardTitle>{participant.participant} - Media Statistics</CardTitle>
                <CardDescription>Breakdown of message types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{participant.text.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Text</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{participant.image.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Images</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{participant.sticker.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Stickers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{participant.audio.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Audio</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{participant.video.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Video</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">{participant.document.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Documents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Media Summary</CardTitle>
            <CardDescription>Total media shared across all participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {mediaStatsData.reduce((sum, p) => sum + p.image, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Images</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {mediaStatsData.reduce((sum, p) => sum + p.sticker, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Stickers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {mediaStatsData.reduce((sum, p) => sum + p.audio, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Audio</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {mediaStatsData.reduce((sum, p) => sum + p.video, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Videos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-600">
                  {mediaStatsData.reduce((sum, p) => sum + p.document, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
