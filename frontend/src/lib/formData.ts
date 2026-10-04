export function buildNestedFormData<T extends Record<string, any>>(
  payload: T,
): FormData | T {
  const files: [string, Blob][] = [];

  const walk = (value: any, path: string): any => {
    if (value instanceof Blob) {
      files.push([path, value]);
      return "__FILE__";
    }
    if (Array.isArray(value)) {
      return value.map((v, i) => walk(v, `${path}[${i}]`));
    }
    if (value && typeof value === "object" && !(value instanceof Date)) {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        if (v === undefined) continue;
        out[k] = walk(v, path ? `${path}[${k}]` : k);
      }
      return out;
    }
    return value;
  };

  const json = walk(payload, "");
  if (files.length === 0) return json;

  const fd = new FormData();
  fd.append("data", JSON.stringify(json));
  files.forEach(([p, f]) => fd.append(p, f));
  return fd;
}