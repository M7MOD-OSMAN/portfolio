import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

import { CONTENT_TAG } from "@/sanity/env";

/**
 * Sanity webhook target: purges cached CMS content so edits appear without
 * waiting out the revalidate window.
 *
 * Set this up in Sanity under API > Webhooks, pointing at
 * `https://<your-domain>/api/revalidate`, with the same secret as
 * `SANITY_REVALIDATE_SECRET`.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  // Without a secret anyone could force cache purges, so refuse to run.
  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not set." },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature." },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Payload is missing _type." },
        { status: 400 },
      );
    }

    // Every section shares one tag; the site is small enough that finer
    // granularity would cost more in complexity than it saves in rebuilds.
    // "max" marks the tag stale and serves stale-while-revalidate, so an edit
    // never makes a visitor wait on a blocking refetch.
    revalidateTag(CONTENT_TAG, "max");

    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (error) {
    console.error("[revalidate] Webhook failed.", error);
    return NextResponse.json(
      { message: "Webhook handling failed." },
      { status: 500 },
    );
  }
}
