import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text, mode = 'letter', targetLang = 'bs', sourceLang = 'ar' } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const ai = getGeminiClient();

    let contextInstruction = "";
    if (mode === 'letter') {
      contextInstruction = `You are a high-level certified legal translator and diplomatic correspondence specialist for the World Islamic Call Society (WICS) branch office in Sarajevo, Bosnia and Herzegovina.
Translate the following Arabic administrative/governmental letter text into official, formal, professional Bosnian language (Bosanski jezik - standard legal/administrative style used by Ministries, courts, and cantonal authorities in Bosnia and Herzegovina).
Use accurate Bosnian legal terms (e.g. 'Ministarstvo pravde Bosne i Hercegovine', 'Predstavništvo strane nevladine organizacije', 'Jedinstveni identifikacioni broj - JIB', 'rješenje', 'upis u registar', 'ovlašteno lice', 'potpisnik').
Maintain the exact paragraphs, structure, politeness, and official tone. Do not add conversational fluff or quotes. Output only the translated text.`;
    } else if (mode === 'invoice') {
      contextInstruction = `You are an expert accountant and certified legal translator in Sarajevo, Bosnia and Herzegovina.
Translate this invoice description, financial item, or receipt notes from Arabic to official Bosnian business terminology (or vice-versa if requested).
Use standard financial terms in Bosnia and Herzegovina (KM/BAM, PDV, faktura/račun, bankovni transfer, ugovor o zakupu, advokatski honorar, sudske takse).
Keep it concise and clear for invoices. Output only the translation.`;
    } else if (mode === 'title') {
      contextInstruction = `Translate this official document title or subject line from Arabic to formal Bosnian (or vice-versa).
Keep it in standard bureaucratic title casing format (e.g. 'Predmet: Zahtjev za upis u registar predstavništava...'). Output only the title.`;
    } else {
      contextInstruction = `Translate the following text accurately between Arabic and Bosnian, preserving formal and respectful tone. Output only the translation.`;
    }

    const prompt = `${contextInstruction}

Source text (${sourceLang === 'ar' ? 'Arabic' : 'Bosnian'}):
"""
${text}
"""

Target text (${targetLang === 'bs' ? 'Bosnian' : 'Arabic'}):`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const translation = response.text?.trim() || "";

    return NextResponse.json({ translation, success: true });
  } catch (error: unknown) {
    console.error("Translation API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to translate text";
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}
