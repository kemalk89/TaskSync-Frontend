import { NextRequest, NextResponse } from "next/server";
import {
  getDictionary,
  Locale,
  storeLanguageInCookie,
  getSupportedLanguages,
} from "../../../dictionaries";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ lng: string }> },
) {
  const { lng } = await params;
  
  // Validate that the language is one of our supported languages
  const supportedLanguages = await getSupportedLanguages();
  if (!supportedLanguages.includes(lng as Locale)) {
    return NextResponse.json(
      { error: "Unsupported language" },
      { status: 400 },
    );
  }

  await storeLanguageInCookie(lng as Locale);
  const dictionary = await getDictionary(lng as Locale);

  return NextResponse.json({ dictionary }, { status: 200 });
}
