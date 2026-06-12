import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function badRequest(errors: string[], status = 400) {
  return NextResponse.json({ ok: false, errors }, { status });
}
