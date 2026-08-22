/**
 * Whether `value` contains a `File`/`Blob` anywhere inside it, at any
 * depth. Services use this to decide whether a request must go out as
 * `multipart/form-data` (required whenever a real file is attached) or can
 * stay plain JSON (simpler, and always safe when there's no file).
 */
export function containsFile(value: unknown): boolean {
  if (value instanceof File || value instanceof Blob) return true;
  if (Array.isArray(value)) return value.some(containsFile);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(containsFile);
  }
  return false;
}

/**
 * Builds a `FormData` payload for requests that contain at least one
 * File/Blob anywhere in a (possibly deeply nested) object.
 *
 * multipart/form-data has no standard wire format for nested objects, so
 * rather than relying on the backend to reconstruct bracket-notation keys
 * (e.g. `user[informations][0][file]`) into nested dicts — which plain
 * Django/DRF does NOT do automatically — we instead:
 *
 *   1. Walk the object and replace every File/Blob with a placeholder
 *      string ("__FILE__0", "__FILE__1", ...), remembering each
 *      placeholder's bracket-notation "path".
 *   2. Serialize the resulting (file-free) object to JSON and send it
 *      under a single "data" field.
 *   3. Append each real File/Blob under its own path as a normal
 *      multipart field (e.g. "user[informations][0][file]").
 *
 * The backend parses `data` as JSON, then walks it looking for
 * "__FILE__N" placeholders and swaps in the matching `request.FILES[path]`
 * — no custom multipart parser required, just a small recursive helper
 * (see `_inject_files` on the Django view).
 */
export function buildFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();
  const files: { path: string; file: File | Blob }[] = [];

  function extractFiles(value: unknown, path: string): unknown {
    if (value instanceof File || value instanceof Blob) {
      const placeholder = `__FILE__${files.length}`;
      files.push({ path, file: value });
      return placeholder;
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.map((item, i) => extractFiles(item, `${path}[${i}]`));
    }
    if (value && typeof value === "object") {
      const result: Record<string, unknown> = {};
      Object.entries(value as Record<string, unknown>).forEach(([key, val]) => {
        result[key] = extractFiles(val, path ? `${path}[${key}]` : key);
      });
      return result;
    }
    return value;
  }

  const cleaned = extractFiles(data, "");
  formData.append("data", JSON.stringify(cleaned));
  files.forEach(({ path, file }) => formData.append(path, file));

  return formData;
}