import Groq from 'groq-sdk';
import type {
  Mode1Response,
  Mode2Response,
  Mode3Response,
  MindWellnessResponse,
  Profile,
  SleepRecommendation,
  WeeklyReport,
} from '@/types';

const MODEL = 'llama3-70b-8192';

function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey });
}

async function callGroq<T>(prompt: string, fallback: T): Promise<T> {
  const groq = getGroqClient();
  if (!groq) return fallback;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) return fallback;
    return JSON.parse(content) as T;
  } catch (error) {
    console.error('Groq API error:', error);
    return fallback;
  }
}

function langInstruction(locale: string): string {
  return locale === 'am' ? 'Respond entirely in Amharic (አማርኛ).' : 'Respond in English.';
}

export async function generateMode1(
  profile: Profile,
  meal: string,
  locale: string = 'en'
): Promise<Mode1Response> {
  const fastingNote = profile.fasting_mode
    ? 'User follows Ethiopian Orthodox fasting — adapt workout intensity and timing accordingly. No heavy meat-based meal assumptions.'
    : '';

  const prompt = `You are FitEthio's nutrition & fitness AI. User profile: age ${profile.age}, gender ${profile.gender}, weight ${profile.weight_kg}kg, height ${profile.height_cm}cm, goal ${profile.goal}, activity_level ${profile.activity_level}. They plan to eat: ${meal}. Analyze the meal's macros (calories, protein, carbs, fat). Then recommend a specific workout plan for today — include exercise names, sets, reps, duration, and best time to work out after eating. ${fastingNote} ${langInstruction(locale)} Output ONLY valid JSON: {"meal_analysis":{"calories":number,"protein_g":number,"carbs_g":number,"fat_g":number,"notes":"string"},"workout":{"type":"string","duration_min":number,"exercises":[{"name":"string","sets":number,"reps":"string","muscle_group":"string","type":"bodyweight|gym|cardio|flexibility"}],"best_time":"string","water_glasses":number}}`;

  return callGroq(prompt, {
    meal_analysis: { calories: 450, protein_g: 20, carbs_g: 55, fat_g: 15, notes: 'Estimated macros for your meal.' },
    workout: {
      type: 'Moderate cardio + bodyweight',
      duration_min: 30,
      exercises: [
        { name: 'Brisk walking', sets: 1, reps: '20 min', muscle_group: 'cardio', type: 'cardio' },
        { name: 'Push-ups', sets: 3, reps: '12', muscle_group: 'chest', type: 'bodyweight' },
        { name: 'Squats', sets: 3, reps: '15', muscle_group: 'legs', type: 'bodyweight' },
      ],
      best_time: '1-2 hours after eating',
      water_glasses: 8,
    },
  });
}

export async function generateMode2(
  profile: Profile,
  workoutDescription: string,
  locale: string = 'en'
): Promise<Mode2Response> {
  const fastingNote = profile.fasting_mode
    ? 'User follows Ethiopian Orthodox fasting. ALL meal suggestions MUST be fasting-friendly (vegan/plant-based, no meat, dairy, or eggs). Use Ethiopian fasting dishes like shiro, misir wot, gomen, atkilt.'
    : 'Include authentic Ethiopian meals with English and Amharic names.';

  const prompt = `You are FitEthio's recovery nutrition AI. User profile: age ${profile.age}, gender ${profile.gender}, weight ${profile.weight_kg}kg, height ${profile.height_cm}cm, goal ${profile.goal}, activity_level ${profile.activity_level}, fasting_mode ${profile.fasting_mode}. They did: ${workoutDescription}. Calculate calories burned. Recommend specific Ethiopian meals for breakfast, lunch, and dinner today to fuel recovery. Include portions, macros, and reasoning. ${fastingNote} ${langInstruction(locale)} Output ONLY valid JSON: {"calories_burned":number,"meals":{"breakfast":{"name_en":"string","name_am":"string","portion":"string","calories":number,"protein_g":number,"carbs_g":number,"fat_g":number,"reasoning":"string"},"lunch":{...},"dinner":{...}},"water_liters":number,"avoid":["string"]}`;

  return callGroq(prompt, {
    calories_burned: 350,
    meals: {
      breakfast: { name_en: 'Ful', name_am: 'ፉል', portion: '1 bowl', calories: 320, protein_g: 14, carbs_g: 45, fat_g: 8, reasoning: 'High protein recovery after morning workout.' },
      lunch: { name_en: 'Tibs with injera', name_am: 'ጥብስ በእንጀራ', portion: '2 pieces injera + 150g', calories: 550, protein_g: 28, carbs_g: 60, fat_g: 18, reasoning: 'Balanced macros for afternoon recovery.' },
      dinner: { name_en: 'Shiro wot', name_am: 'ሽሮ ወጥ', portion: '1 cup with injera', calories: 400, protein_g: 18, carbs_g: 50, fat_g: 12, reasoning: 'Light evening meal for recovery.' },
    },
    water_liters: 2.5,
    avoid: ['Processed foods', 'Excessive sugar'],
  });
}

export async function generateMode3(
  profile: Profile,
  locale: string = 'en'
): Promise<Mode3Response> {
  const prompt = `You are FitEthio's wellness AI for Ethiopian users. User profile: ${profile.gender}, age ${profile.age}, skin_type ${profile.skin_type}, activity_level ${profile.activity_level}, location: Addis Ababa (high UV year-round). Generate a personalized skincare routine (morning + evening steps), 3 supplement suggestions with reasons, and 3 natural Ethiopian ingredient options (teff, moringa, flaxseed, coffee, honey, etc.) that match their profile. Be specific about what to avoid. ${langInstruction(locale)} Output ONLY valid JSON: {"skincare":{"morning":["string"],"evening":["string"]},"supplements":[{"name":"string","reason":"string"}],"natural_options":[{"name":"string","benefit":"string","usage":"string"}],"avoid":["string"]}`;

  return callGroq(prompt, {
    skincare: {
      morning: ['Gentle cleanser', 'Vitamin C serum', 'SPF 50 sunscreen (essential in Addis Ababa)'],
      evening: ['Double cleanse', 'Moisturizer suited for ' + profile.skin_type + ' skin', 'Night cream'],
    },
    supplements: [
      { name: 'Vitamin D', reason: 'Common deficiency despite sunny climate' },
      { name: 'Omega-3 (flaxseed)', reason: 'Supports skin barrier and inflammation' },
      { name: 'Teff iron supplement', reason: 'Ethiopian staple rich in minerals' },
    ],
    natural_options: [
      { name: 'Teff flour mask', benefit: 'Rich in minerals for skin', usage: 'Mix with honey, apply 15 min weekly' },
      { name: 'Moringa powder', benefit: 'Antioxidant boost', usage: 'Add to smoothies daily' },
      { name: 'Ethiopian honey', benefit: 'Natural moisturizer', usage: 'Spot treatment for dry areas' },
    ],
    avoid: ['Harsh alcohol-based toners', 'Skipping sunscreen', 'Over-exfoliation'],
  });
}

export async function generateSleepRecommendation(
  profile: Profile,
  bedtimeGoal: string,
  stressLevel: number,
  locale: string = 'en'
): Promise<SleepRecommendation> {
  const prompt = `You are FitEthio's sleep wellness AI. User: ${profile.name}, age ${profile.age}, activity ${profile.activity_level}. Bedtime goal: ${bedtimeGoal}. Stress level: ${stressLevel}/5. Generate ideal sleep duration, a 3-step bedtime routine, wake-up time, and tips. Ethiopian cultural context welcome. ${langInstruction(locale)} Output ONLY valid JSON: {"ideal_duration_hours":number,"bedtime_routine":["string","string","string"],"wake_up_time":"string","tips":["string"]}`;

  return callGroq(prompt, {
    ideal_duration_hours: 7.5,
    bedtime_routine: ['Dim lights and put away screens', 'Gentle stretching for 5 minutes', 'Deep breathing (4-7-8 technique)'],
    wake_up_time: '6:30 AM',
    tips: ['Keep bedroom cool', 'Avoid coffee after 2pm', 'Try traditional buna only in the morning'],
  });
}

export async function generateMindWellness(
  profile: Profile,
  moodScore: number,
  locale: string = 'en'
): Promise<MindWellnessResponse> {
  const prompt = `You are FitEthio's mental wellness AI. User ${profile.name} in Ethiopia reports mood ${moodScore}/5 today. Provide 3 practical, culturally sensitive wellness tips and a warm encouragement message. ${langInstruction(locale)} Output ONLY valid JSON: {"tips":["string","string","string"],"encouragement":"string"}`;

  return callGroq(prompt, {
    tips: [
      'Take a short walk in fresh air — common Ethiopian remedy for clearing the mind',
      'Connect with family or friends over coffee (buna) ceremony',
      'Practice gratitude — name 3 things going well today',
    ],
    encouragement: 'Every day is a new chance. You are doing better than you think.',
  });
}

export async function generateWeeklyReport(
  name: string,
  data: {
    avgCalories: number;
    workoutsCompleted: number;
    avgWater: number;
    avgMood: number;
    avgSleep: number;
    weightChange: number;
  },
  locale: string = 'en'
): Promise<WeeklyReport> {
  const prompt = `Generate a friendly weekly wellness report for ${name}. Data: avg_calories ${data.avgCalories}, workouts_completed ${data.workoutsCompleted}, avg_water ${data.avgWater}L, avg_mood ${data.avgMood}, avg_sleep ${data.avgSleep}hrs, weight_change ${data.weightChange}kg. Write in second person, warm tone. Include: what they did well, one area to improve, and 3 specific goals for next week. Ethiopian context where relevant. ${langInstruction(locale)} Output ONLY valid JSON: {"summary":"string","highlight":"string","improve":"string","goals":["string","string","string"]}`;

  return callGroq(prompt, {
    summary: `Great week, ${name}! You stayed committed to your wellness journey.`,
    highlight: 'Consistent water intake and regular check-ins.',
    improve: 'Try adding one more workout session next week.',
    goals: ['Log meals daily', 'Hit water target 5/7 days', 'Sleep before 10pm'],
  });
}
