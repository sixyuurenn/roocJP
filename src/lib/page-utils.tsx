export function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function renderLines(text: string | null) {
  if (!text) {
    return null;
  }

  return text.split("\n").map((line, index) => (
    <p key={`${line}-${index}`} className="text-sm leading-7 text-slate-700">
      {line}
    </p>
  ));
}
