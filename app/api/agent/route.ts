import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { userRequest, triggerApi, actionApi } = await req.json()

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash' 
    })

    const prompt = `
You are Nexflow's AI integration agent. 
Your job is to help users connect two APIs together.

User wants to integrate:
- Trigger API: ${triggerApi}
- Action API: ${actionApi}
- Request: ${userRequest}

Respond with a clear step by step integration plan:
1. What event triggers this integration
2. What data gets extracted
3. How it maps to the action API
4. Any authentication needed
5. Potential failure points to watch

Be concise, technical, and practical.
    `

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    return NextResponse.json({ 
      success: true, 
      plan: response 
    })

  } catch (error) {
    console.error('Agent error:', error)
    return NextResponse.json(
      { success: false, error: 'Agent failed' },
      { status: 500 }
    )
  }
}