import React from "react";
import "../assets/styles/pieChartCard.scss";

const PieChartCard = ({ title, data }) => {
  return (
    <div className="pie-chart-card">
      <h3>{title}</h3>
      <div className="chart">
        {/* גרף עוגה יתווסף כאן */}
        <p>Pie chart placeholder</p>
      </div>
    </div>
  );
};

export default PieChartCard;
