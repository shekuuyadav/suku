export type Emotion = {
  emotionalState: string;
  confidenceLevel: number;
  reason: string;
};

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  emotion?: Emotion;
};

export type EmotionDataPoint = {
  name: string;
  count: number;
};
