export const formatDateLabel = (date) => {
  const eventDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date();

  today.setHours(0, 0, 0, 0);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  eventDate.setHours(0, 0, 0, 0);

//   if (eventDate.getTime() === today.getTime()) return "Today";
//   if (eventDate.getTime() === tomorrow.getTime()) return "Tomorrow";

//   return eventDate.toLocaleDateString("en-GB"); // או "he-IL" לעברית
  let label = eventDate.getTime() === today.getTime()
    ? "Today"
    : eventDate.getTime() === tomorrow.getTime()
    ? "Tomorrow"
    : eventDate.toLocaleDateString("en-GB");

  // הוספת שעה: hh:mm
  const hours = new Date(date).getHours();
  const minutes = new Date(date).getMinutes();
  const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return `${label} ${time}`;
};
