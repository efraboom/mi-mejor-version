import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { review, planEtapa, weekLabel } = await req.json()

    const planCtx = planEtapa
      ? `\nActualmente está trabajando en la Etapa ${planEtapa.semana}: "${planEtapa.titulo}". \
Hábitos clave de esta etapa: ${planEtapa.habitos_clave?.join(', ')}.`
      : ''

    const prompt = `Eres una mentora de desarrollo personal femenino, cálida y cercana. \
La usuaria completó su revisión semanal de la semana del ${weekLabel}.${planCtx}

Su reflexión:
- ¿Qué celebra?: ${review.celebro || '(no respondió)'}
- Hábitos cumplidos: ${review.habitos_cumplidos || '(no respondió)'}
- Qué ajustar: ${review.ajustes || '(no respondió)'}
- Intención próxima semana: ${review.intencion || '(no respondió)'}

Escribe un resumen personal de 3-4 oraciones que reconozca su progreso, la motive y la ancle en su intención. \
Tono cálido y directo como mentora cercana. Solo texto fluido, sin listas, sin markdown.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { maxOutputTokens: 512 },
    })

    return NextResponse.json({ resumen: response.text?.trim() ?? '' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[resumen-semanal]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
