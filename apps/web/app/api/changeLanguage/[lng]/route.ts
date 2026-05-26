import { NextRequest, NextResponse } from "next/server";
import {
  getDictionary,
  i18n,
  Locale,
  supportedLanguages,
} from "../../../dictionaries";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ lng: Locale }> },
) {
  const { lng } = await params;
  if (!supportedLanguages.includes(lng)) {
    return NextResponse.json(
      { error: "Unsupported language" },
      { status: 400 },
    );
  }

  i18n.currentLanguage = lng;
  const dictionary = await getDictionary(lng);

  return NextResponse.json({ dictionary }, { status: 200 });
}
