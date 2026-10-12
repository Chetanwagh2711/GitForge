import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

const generateActivityData = (startDate, endDate) => {
  const data = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    data.push({
      date: current.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 50),
    });
    current.setDate(current.getDate() + 1);
  }
  return data;
};

const getPanelColors = (maxCount) => {
  const colors = { 0: "#161b22" };
  for (let i = 1; i <= maxCount; i++) {
    const green = 80 + Math.floor((i / maxCount) * 175);
    colors[i] = `rgb(0, ${green}, 60)`;
  }
  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  useEffect(() => {
    const data = generateActivityData(startDate, endDate);
    setActivityData(data);

    const maxCount = Math.max(1, ...data.map((d) => d.count));
    setPanelColors(getPanelColors(maxCount));
  }, []);

  return (
    <div>
      <h4>Recent Contributions (sample data)</h4>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "100%", color: "#8b949e" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={startDate}
        endDate={endDate}
        rectSize={12}
        space={3}
        rectProps={{ rx: 2.5 }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;