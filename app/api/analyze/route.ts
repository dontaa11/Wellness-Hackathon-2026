import { Groq } from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a wellness AI assistant for FitEthio, an application connecting users to local wellness services in Ethiopia.

CRITICAL: You MUST suggest ONLY specific, real-world services and locations available in Ethiopia. Do NOT suggest generic recommendations.

**Available Ethiopian Wellness Services & Resorts:**
- Kuriftu Bishoftu (recovery retreat near Addis Ababa)
- Entoto Resort (mountain wellness retreat, Addis Ababa)
- Awash National Park (nature wellness activities)
- Tana Hotel & Resort (health-focused accommodation)
- Fitness Clubs in Addis Ababa: GoldGym Addis, CrossFit Addis, Elite Fitness Center
- Traditional Massage: Ethiopian Spa & Wellness Centers across major cities
- Yoga Studios: Yoga Addis, Zen Wellness Studio
- Trekking/Hiking: Simien Mountains, Bale Mountains

When providing wellness recommendations, ALWAYS include:
1. A specific service name (exact name from the list above or confirmed local provider)
2. The exact location/city in Ethiopia
3. Why this specific service is recommended based on the user's profile
4. Any relevant contact or booking information

Your response MUST be valid JSON with this structure:
{
  "service_name": "specific service name",
  "location": "city/region in Ethiopia",
  "recommendation": "personalized recommendation",
  "reasoning": "why this is suitable",
  "estimated_cost": "approximate cost in ETB or USD",
  "best_time": "when to book/visit"
}

NEVER suggest services outside Ethiopia or generic options. Always prioritize Ethiopian local businesses.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, userProfile, checkInData } = body;

    let userMessage = '';

    if (mode === 'mode1') {
      userMessage = `I just completed a morning check-in with my wellness profile. Based on my health data, what specific Ethiopian wellness service should I book for recovery?

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Goal: ${userProfile.goal}
- Activity Level: ${userProfile.activity_level}
- Weight: ${userProfile.weight_kg}kg
- Height: ${userProfile.height_cm}cm

Recommend a specific Ethiopian service that will help me achieve my wellness goals.`;
    } else if (mode === 'mode2') {
      userMessage = `Based on my wellness check-in and current fitness goals, what Ethiopian fitness facility or wellness resort should I book?

User Profile:
- Name: ${userProfile.name}
- Goal: ${userProfile.goal}
- Activity Level: ${userProfile.activity_level}
- Dietary Goal: Weight management

Recommend a specific Ethiopian gym or fitness center with their exact location.`;
    } else if (mode === 'mode3') {
      userMessage = `Based on my skin type and wellness needs, what Ethiopian beauty/spa service should I book?

User Profile:
- Skin Type: ${userProfile.skin_type}
- Goal: ${userProfile.goal}

Recommend a specific Ethiopian spa or wellness center in Ethiopia.`;
    } else {
      return NextResponse.json(
        { error: 'Invalid mode' },
        { status: 400 }
      );
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'No response from Groq' },
        { status: 500 }
      );
    }

    // Parse the JSON response from Groq
    let jsonResponse;
    try {
      // Extract JSON from the response text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      jsonResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', content);
      // Return a fallback response
      return NextResponse.json(
        {
          service_name: 'Kuriftu Bishoftu',
          location: 'Bishoftu',
          recommendation: 'A premium recovery retreat perfect for wellness goals',
          reasoning: 'Based on your profile, this resort offers the best facilities',
          estimated_cost: '500-800 USD',
          best_time: 'Weekends for day visits, or extended stays',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(jsonResponse, { status: 200 });
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: `Failed to analyze wellness data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
