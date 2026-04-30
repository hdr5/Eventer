import axios from "axios";

const USER_AGENT = "Eventer";

// פונקציה כללית לביצוע בקשת Nominatim עם Axios
const fetchNominatim = async (url) => {
  try {
    const { data, status } = await axios.get(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (status !== 200) {
      throw new Error(`Nominatim error: ${status}`);
    }

    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};

// Search
export const searchLocation = async (req, res) => {
  try {
    console.log('searchLocation - SERVER');
    
    const q = req.query.q;
    if (!q) return res.json([]);

    // const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
    //   q
    // )}`;

    // const data = await fetchNominatim(url);
   //חיפוש בישראל
   let url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
  q
)}&countrycodes=il&limit=5`;

let data = await fetchNominatim(url);

// אם אין תוצאות → חיפוש גלובלי
if (!data.length) {
  url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
    q
  )}&limit=5`;

  data = await fetchNominatim(url);
}
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reverse
export const reverseLocation = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lon}`;

    const data = await fetchNominatim(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};