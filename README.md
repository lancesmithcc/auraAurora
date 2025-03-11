# Aura Aurora

Aura Aurora is a web application that analyzes emotions in real-time using the Hume.ai API. It captures video and audio from your device's camera and microphone, then displays an emotional "aura" around your face based on the detected emotions.

## Features

- Real-time emotion analysis from facial expressions and voice
- Visual representation of emotions as a colorful aura
- Emotion symbols (emojis) displayed for each detected emotion
- Percentage breakdown of emotional states

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Hume.ai API for emotion analysis

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- A Hume.ai API key and secret key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/aura-aurora.git
   cd aura-aurora
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Hume.ai API credentials:
   ```
   HUME_API_KEY=your_api_key_here
   HUME_SECRET_KEY=your_secret_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click the "Start Camera" button to activate your camera and microphone.
2. Click "Start Analysis" to begin analyzing your emotions.
3. Your emotional aura will appear around your face, with different colors representing different emotions.
4. The percentage breakdown of each emotion will be displayed below the video.
5. Click "Stop Analysis" to pause the emotion analysis.
6. Click "Stop Camera" to deactivate your camera and microphone.

## Emotion Color Mapping

- Joy: Gold (😊)
- Sadness: Steel Blue (😢)
- Anger: Red Orange (😠)
- Fear: Purple (😨)
- Surprise: Cyan (😲)
- Disgust: Lime Green (🤢)
- Contempt: Brown (😏)
- Neutral: Gray (😐)

## Privacy Notice

This application processes video and audio data locally in your browser. Data is sent to the Hume.ai API for emotion analysis, but is not stored permanently. Please review Hume.ai's privacy policy for more information on how they handle your data.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 