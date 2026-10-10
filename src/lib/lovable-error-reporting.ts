/** Standalone error reporting fallback.
 * The original implementation forwarded errors to editor-only Lovable hooks.
 * Keep this local logger until a production error-monitoring service is selected.
 */
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}): void {
  if (typeof console === "undefined") return;
  console.error("[QuickQuote] Application error", { error, ...context });
}
