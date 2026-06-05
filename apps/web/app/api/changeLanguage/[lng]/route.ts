import { NextRequest, NextResponse } from "next/server";
import {
  getDictionary,
  Locale,
  storeLanguageInCookie,
  getSupportedLanguages,
} from "../../../dictionaries";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ lng: Locale }> },
) {
  const { lng } = await params;
  const supportedLanguages = await getSupportedLanguages();
  if (!supportedLanguages.includes(lng)) {
    return NextResponse.json(
      { error: "Unsupported language" },
      { status: 400 },
    );
  }

  await storeLanguageInCookie(lng);
  const dictionary = await getDictionary(lng);

  return NextResponse.json({ dictionary }, { status: 200 });
}
