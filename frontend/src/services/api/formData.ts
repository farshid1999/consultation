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
 * Flattens an arbitrarily nested object (objects, arrays, files) into a
 * `FormData` instance using bracket notation — e.g.
 * `user[address][city]`, `user[informations][0][children][1][title]` —
 * which is the conventional way nested multipart data is represented for
 * a Django/DRF backend able to reconstruct nested structures from
 * `request.data` (a QueryDict-backed multipart parser, or a nested-writable
 * serializer set up to expect this).
 *
 * If your backend's default JSON parser doesn't reconstruct bracket-style
 * multipart keys into nested dicts/lists automatically, you'll need a
 * small custom parser on the Django side (several open-source snippets
 * exist for this, commonly named something like
 * `NestedMultiPartParser`) — this is a backend detail this client can't
 * fully guarantee without seeing your parser configuration.
 */
export function buildFormData(
  data: Record<string, unknown>,
  formData: FormData = new FormData(),
  parentKey?: string
): FormData {
  Object.entries(data).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;
    appendValue(formData, formKey, value);
  });
  return formData;
}

function appendValue(formData: FormData, key: string, value: unknown): void {
  if (value === undefined) return;

  if (value === null) {
    formData.append(key, "");
    return;
  }

  if (value instanceof File || value instanceof Blob) {
    formData.append(key, value);
    return;
  }

  if (value instanceof Date) {
    formData.append(key, value.toISOString());
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => appendValue(formData, `${key}[${index}]`, item));
    return;
  }

  if (typeof value === "object") {
    buildFormData(value as Record<string, unknown>, formData, key);
    return;
  }

  formData.append(key, String(value));
}
