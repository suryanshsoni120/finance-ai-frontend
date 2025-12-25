export const formatDate = (
  date: string | Date,
  locale: string = "en-GB"
) => {
  if (!date) return "-";

  return new Date(date)
    .toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
    .replaceAll("/", "-");
};