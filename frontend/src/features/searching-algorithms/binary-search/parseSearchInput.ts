export function parseSearchInput(arrayText: string, targetText: string) {
  const entries = arrayText.split(",").map((entry) => entry.trim());
  if (entries.some((entry) => !entry))
    throw new Error(
      "Enter numbers separated by commas, without empty entries.",
    );
  if (entries.length > 31)
    throw new Error("Use up to 31 values so the search remains readable.");
  const values = entries.map(Number);
  if (values.some((value) => !Number.isFinite(value)))
    throw new Error("Every array value must be a finite number.");
  if (!targetText.trim() || !Number.isFinite(Number(targetText)))
    throw new Error("Enter a finite target number.");
  return { values, target: Number(targetText) };
}
