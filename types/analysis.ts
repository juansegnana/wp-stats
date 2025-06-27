export interface AnalysisData {
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
