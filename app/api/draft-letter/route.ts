import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { 
      topicAr, 
      recipientOrg, 
      recipientPerson,
      keyPointsAr,
      directorName = "مصطفى محمود البكشي",
      refNumber = "WICS-SJJ/2026-___"
    } = await req.json();

    if (!topicAr || typeof topicAr !== 'string') {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are the chief legal consultant and executive secretary for the World Islamic Call Society (WICS) - Sarajevo Office, Bosnia and Herzegovina.
The authorized director is: ${directorName}.
The official paper mandate is Reference No. 1232/1.1 dated September 3, 2026, issued by WICS Legal Representative Prof. Dr. Saleh Salim Al-Fakhri.

Generate an official formal governmental correspondence draft based on the user's Arabic prompt.
Provide the output in JSON format with exact fields:
- titleAr: Official subject line in Arabic (e.g. "الموضوع: ...")
- titleBs: Official subject line in formal Bosnian (e.g. "Predmet: ...")
- recipientAr: Formal greeting in Arabic
- recipientBs: Formal greeting in Bosnian
- contentAr: Full official, respectful, diplomatic letter text in Arabic, with well-crafted paragraphs, legal citations if applicable, attachments list, and closing.
- contentBs: Accurate, certified-grade formal Bosnian translation of the letter text conforming to administrative protocol in Bosnia and Herzegovina.

Return ONLY a valid JSON object matching this schema.`;

    const userPrompt = `Target Recipient Organization: ${recipientOrg || 'Bosnian Government Ministry / Institution'}
Recipient Person / Title: ${recipientPerson || 'Glavni rukovodilac / Ministar'}
Letter Subject / Topic (in Arabic): ${topicAr}
Key Points / Instructions: ${keyPointsAr || 'Official administrative procedure for opening and operating the WICS Sarajevo office'}
Reference Number: ${refNumber}

Generate the formal Arabic and Bosnian letter draft now.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text?.trim() || "{}";
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = {
        titleAr: topicAr,
        titleBs: topicAr,
        contentAr: rawText,
        contentBs: rawText,
      };
    }

    return NextResponse.json({ draft: data, success: true });
  } catch (error: unknown) {
    console.error("Draft letter API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate draft";
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}
