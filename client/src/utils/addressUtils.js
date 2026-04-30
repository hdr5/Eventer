export const parseAddress = (address = "") => {
  const [streetPart = "", city = ""] = address.split(",");

  const street = streetPart.replace(/[0-9]/g, "").trim();
  const numberMatch = streetPart.match(/\d+/);

  return {
    street,
    houseNumber: numberMatch ? numberMatch[0] : "",
    city: city.trim(),
  };
};

export const formatShortAddress = (item) => {
  const a = item.address || {};

  const street =
    a.road ||
    a.pedestrian ||
    a.footway ||
    "";

  const number = a.house_number || "";

  const city =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    "";

  const streetPart = [street, number].filter(Boolean).join(" ");

  if (!streetPart && !city) return item.display_name || "";

  return [streetPart, city].filter(Boolean).join(", ");
};