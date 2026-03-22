type MutedAssistTextProps = {
  text: string | null;
  className?: string;
  truncate?: boolean;
};

export function MutedAssistText({ text, className, truncate = false }: MutedAssistTextProps) {
  if (!text) {
    return null;
  }

  const classes = ["text-xs leading-5 text-slate-500", truncate ? "truncate" : null, className]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  return <p className={classes}>{text}</p>;
}
