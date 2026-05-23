import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const PLAZO_LABEL: Record<string, string> = {
  '3_meses': '3 meses',
  '6_meses': '6 meses',
  '1_año': '1 año',
}

export async function POST(req: NextRequest) {
  try {
    const { meta, plazo, diagnostico } = await req.json()

    if (!meta || !plazo) {
      return NextResponse.json({ error: 'Faltan meta y plazo' }, { status: 400 })
    }

    const diagTexto = diagnostico
      ? Object.entries(diagnostico as Record<string, string>)
          .filter(([, v]) => v?.trim())
          .map(([k, v]) => `- ${k}: ${v}`)
          .join('\n')
      : 'Sin diagnóstico previo'

    const semanas = plazo === '3_meses' ? 6 : plazo === '6_meses' ? 8 : 10

    const prompt = `Eres una mentora de desarrollo personal femenino, cálida y práctica. \
La usuaria tiene esta meta: "${meta}". Su plazo es ${PLAZO_LABEL[plazo] ?? plazo}. \
Basándote en su diagnóstico personal:\n${diagTexto}\n\n\
Genera exactamente ${semanas} pasos (uno por cada bloque de semanas) concretos y alcanzables. \
Cada descripcion debe tener máximo 2 oraciones. Cada habitos_clave máximo 3 items cortos. \
Responde SOLO en JSON válido con este formato exacto (sin markdown, sin texto extra):\n\
{"pasos":[{"semana":1,"titulo":"","descripcion":"","habitos_clave":[]}]}`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { maxOutputTokens: 4096 },
    })

    const raw = response.text?.trim() ?? ''

    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Respuesta de IA no es JSON válido')

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[generar-plan]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
