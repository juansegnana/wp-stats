import re
import json
import sys
from datetime import datetime
from collections import defaultdict, Counter
import argparse

def parse_whatsapp_chat(file_content):
    """Parse WhatsApp chat content and extract message data."""
    
    # Regex pattern to match WhatsApp messages
    # Handles both [DD/MM/YY, HH:MM:SS] and [DD/MM/YYYY, HH:MM:SS] formats
    pattern = r'\[(\d{1,2}/\d{1,2}/\d{2,4}),\s(\d{1,2}:\d{2}:\d{2})\]\s([^:]+):\s(.+)'
    
    messages = []
    lines = file_content.split('\n')
    
    for line in lines:
        # Remove zero-width characters and whitespace
        line = line.strip().replace('\u200e', '').replace('\u200f', '')
        
        if not line:
            continue
            
        match = re.match(pattern, line)
        if match:
            date_str, time_str, sender, content = match.groups()
            
            # Parse date - handle both YY and YYYY formats
            try:
                if len(date_str.split('/')[-1]) == 2:
                    # YY format
                    date_obj = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%y %H:%M:%S")
                else:
                    # YYYY format
                    date_obj = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%Y %H:%M:%S")
            except ValueError:
                continue
            
            # Classify message type
            message_type = "text"
            if "imagen omitida" in content.lower() or "image omitted" in content.lower():
                message_type = "image"
            elif "sticker omitido" in content.lower() or "sticker omitted" in content.lower():
                message_type = "sticker"
            elif "audio omitido" in content.lower() or "audio omitted" in content.lower():
                message_type = "audio"
            elif "video omitido" in content.lower() or "video omitted" in content.lower():
                message_type = "video"
            elif "documento omitido" in content.lower() or "document omitted" in content.lower():
                message_type = "document"
            
            messages.append({
                'datetime': date_obj,
                'date': date_obj.date(),
                'time': date_obj.time(),
                'sender': sender.strip(),
                'content': content.strip(),
                'type': message_type,
                'year': date_obj.year,
                'month': date_obj.month,
                'day': date_obj.day,
                'hour': date_obj.hour,
                'weekday': date_obj.weekday()  # 0 = Monday, 6 = Sunday
            })
    
    return messages

def analyze_messages(messages):
    """Generate comprehensive statistics from parsed messages."""
    
    if not messages:
        return {"error": "No messages found in the chat"}
    
    # Basic statistics
    total_messages = len(messages)
    participants = list(set(msg['sender'] for msg in messages))
    date_range = {
        'start': min(msg['datetime'] for msg in messages).strftime('%Y-%m-%d'),
        'end': max(msg['datetime'] for msg in messages).strftime('%Y-%m-%d')
    }
    
    # Messages per year
    messages_per_year = defaultdict(int)
    for msg in messages:
        messages_per_year[msg['year']] += 1
    
    # Messages per month (across all years)
    messages_per_month = defaultdict(int)
    for msg in messages:
        month_key = f"{msg['year']}-{msg['month']:02d}"
        messages_per_month[month_key] += 1
    
    # Messages per participant
    messages_per_participant = defaultdict(int)
    for msg in messages:
        messages_per_participant[msg['sender']] += 1
    
    # Message types per participant
    message_types_per_participant = defaultdict(lambda: defaultdict(int))
    for msg in messages:
        message_types_per_participant[msg['sender']][msg['type']] += 1
    
    # Messages per hour of day
    messages_per_hour = defaultdict(int)
    for msg in messages:
        messages_per_hour[msg['hour']] += 1
    
    # Messages per day of week
    messages_per_weekday = defaultdict(int)
    weekday_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for msg in messages:
        messages_per_weekday[weekday_names[msg['weekday']]] += 1
    
    # Most active days
    daily_counts = defaultdict(int)
    for msg in messages:
        day_key = msg['datetime'].strftime('%Y-%m-%d')
        daily_counts[day_key] += 1
    
    most_active_days = sorted(daily_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    
    # Word count analysis (for text messages only)
    word_counts = defaultdict(int)
    total_words = 0
    for msg in messages:
        if msg['type'] == 'text':
            words = len(msg['content'].split())
            word_counts[msg['sender']] += words
            total_words += words
    
    # Average message length per participant
    avg_message_length = {}
    for participant in participants:
        participant_messages = [msg for msg in messages if msg['sender'] == participant and msg['type'] == 'text']
        if participant_messages:
            total_chars = sum(len(msg['content']) for msg in participant_messages)
            avg_message_length[participant] = total_chars / len(participant_messages)
        else:
            avg_message_length[participant] = 0
    
    return {
        'summary': {
            'total_messages': total_messages,
            'participants': participants,
            'date_range': date_range,
            'total_words': total_words,
            'chat_duration_days': (max(msg['datetime'] for msg in messages) - min(msg['datetime'] for msg in messages)).days
        },
        'messages_per_year': dict(sorted(messages_per_year.items())),
        'messages_per_month': dict(sorted(messages_per_month.items())),
        'messages_per_participant': dict(messages_per_participant),
        'message_types_per_participant': dict(message_types_per_participant),
        'messages_per_hour': dict(sorted(messages_per_hour.items())),
        'messages_per_weekday': dict(messages_per_weekday),
        'most_active_days': most_active_days,
        'word_counts': dict(word_counts),
        'avg_message_length': avg_message_length
    }

def main():
    parser = argparse.ArgumentParser(description='Analyze WhatsApp chat logs')
    parser.add_argument('file_path', help='Path to the WhatsApp chat .txt file')
    parser.add_argument('--output', '-o', help='Output JSON file path', default=None)
    
    args = parser.parse_args()
    
    try:
        with open(args.file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        messages = parse_whatsapp_chat(content)
        analysis = analyze_messages(messages)
        
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as output_file:
                json.dump(analysis, output_file, indent=2, ensure_ascii=False)
            print(f"Analysis saved to {args.output}")
        else:
            print(json.dumps(analysis, indent=2, ensure_ascii=False))
            
    except FileNotFoundError:
        print(f"Error: File '{args.file_path}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
