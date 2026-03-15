import { useEffect, useState } from "react";

const Counter = ({ value, isCurrency = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // Animation duration in ms
    const stepTime = Math.max(10, Math.floor(duration / (value || 1))); // Avoid divide by zero

    if (value > 0) {
      const timer = setInterval(() => {
        start += Math.ceil(value / 50); // Dynamic increment
        setCount(start >= value ? value : start);
        if (start >= value) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setCount(0); // Default to zero if value is zero or undefined
    }
  }, [value]);

  // Format as currency or regular number
  const formattedValue = isCurrency
    ? count.toLocaleString(undefined, { minimumFractionDigits: count % 1 === 0 ? 0 : 2 })
    : count.toLocaleString();

  return <>{formattedValue}</>;
};

export default Counter;
