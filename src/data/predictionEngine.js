// ============================================
// RailVision AI Prediction Engine
// Time-series crowd prediction with confidence intervals
// ============================================

import { getCrowdDensity, getCrowdLevel, generateHistoricalData } from './mockData.js';

// ─── Weighted Moving Average Prediction ───
export function predictCrowdDensity(trainId, hoursAhead = 6) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();
  const predictions = [];

  // Get historical patterns
  const history = generateHistoricalData(trainId, 14);

  for (let h = 0; h <= hoursAhead; h++) {
    const targetHour = (currentHour + h) % 24;
    const targetDay = (currentDay + Math.floor((currentHour + h) / 24)) % 7;

    // Weighted average from historical same-hour, same-day data
    let weightedSum = 0;
    let weightTotal = 0;

    history.forEach((dayData, idx) => {
      const recency = 1 / (history.length - idx); // More recent = higher weight
      const sameDayBonus = dayData.dayOfWeek === targetDay ? 2 : 1;
      const weight = recency * sameDayBonus;

      weightedSum += dayData.hourlyData[targetHour].density * weight;
      weightTotal += weight;
    });

    const predicted = Math.round(weightedSum / weightTotal);

    // Calculate confidence interval
    const deviations = history.map(d => d.hourlyData[targetHour].density - predicted);
    const stdDev = Math.sqrt(deviations.reduce((sum, d) => sum + d * d, 0) / deviations.length);
    const confidenceMargin = Math.round(stdDev * 1.5);

    // Confidence score decreases with prediction distance
    const confidence = Math.max(55, Math.round(95 - h * 5 - stdDev * 0.5));

    predictions.push({
      hour: targetHour,
      hourLabel: `${String(targetHour).padStart(2, '0')}:00`,
      predicted,
      lower: Math.max(0, predicted - confidenceMargin),
      upper: Math.min(100, predicted + confidenceMargin),
      confidence,
      level: getCrowdLevel(predicted),
      isCurrentHour: h === 0,
    });
  }

  return predictions;
}

// ─── Alternative Train Recommendations ───
export function getRecommendations(trains, selectedTrainId, targetHour = null) {
  const now = new Date();
  const hour = targetHour ?? now.getHours();
  const day = now.getDay();
  const selectedTrain = trains.find(t => t.id === selectedTrainId);

  if (!selectedTrain) return [];

  // Find trains on similar routes
  const alternatives = trains.filter(t =>
    t.id !== selectedTrainId &&
    ((t.from.code === selectedTrain.from.code && t.to.code === selectedTrain.to.code) ||
     (t.from.code === selectedTrain.from.code) ||
     (t.to.code === selectedTrain.to.code))
  );

  return alternatives.map(train => {
    const density = getCrowdDensity(train.id, hour, day);
    const level = getCrowdLevel(density);
    const predictions = predictCrowdDensity(train.id, 4);

    return {
      ...train,
      currentDensity: density,
      level,
      bestTimeToTravel: findBestTime(train.id, day),
      predictedTrend: predictions.length > 2
        ? predictions[predictions.length - 1].predicted > predictions[0].predicted ? 'increasing' : 'decreasing'
        : 'stable',
    };
  }).sort((a, b) => a.currentDensity - b.currentDensity).slice(0, 5);
}

// ─── Find Best Travel Time ───
function findBestTime(trainId, dayOfWeek) {
  let minDensity = Infinity;
  let bestHour = 6;

  for (let h = 5; h <= 22; h++) {
    const density = getCrowdDensity(trainId, h, dayOfWeek);
    if (density < minDensity) {
      minDensity = density;
      bestHour = h;
    }
  }

  return {
    hour: bestHour,
    label: `${String(bestHour).padStart(2, '0')}:00`,
    density: minDensity,
    level: getCrowdLevel(minDensity),
  };
}

// ─── Compartment Level Breakdown ───
export function getCompartmentBreakdown(trainId) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const baseDensity = getCrowdDensity(trainId, hour, day);

  const compartments = [
    { name: 'General (GN)', count: 4, icon: '🟢' },
    { name: 'Sleeper (SL)', count: 6, icon: '🔵' },
    { name: '3rd AC (3A)', count: 3, icon: '🟡' },
    { name: '2nd AC (2A)', count: 2, icon: '🟠' },
    { name: '1st AC (1A)', count: 1, icon: '🔴' },
  ];

  return compartments.map((comp, idx) => {
    // General class is always more crowded, AC classes less
    const modifier = comp.name.includes('General') ? 1.4
      : comp.name.includes('Sleeper') ? 1.1
      : comp.name.includes('3A') ? 0.8
      : comp.name.includes('2A') ? 0.6
      : 0.4;

    const density = Math.min(100, Math.max(5, Math.round(baseDensity * modifier + (Math.sin(idx * 7 + hour) * 10))));

    return {
      ...comp,
      density,
      level: getCrowdLevel(density),
      label: getCrowdLevel(density) === 'low' ? 'Available' : getCrowdLevel(density) === 'moderate' ? 'Filling Up' : 'Full',
    };
  });
}

// ─── Coach Deployment Recommendation ───
export function getDeploymentRecommendations(trains) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  const recommendations = [];

  trains.forEach(train => {
    const density = getCrowdDensity(train.id, hour, day);
    if (density > 70) {
      const additionalCoaches = density > 85 ? 3 : density > 75 ? 2 : 1;
      recommendations.push({
        trainId: train.id,
        trainName: train.trainName,
        route: `${train.from.code} → ${train.to.code}`,
        currentDensity: density,
        level: getCrowdLevel(density),
        recommendation: `Add ${additionalCoaches} extra General/Sleeper coach${additionalCoaches > 1 ? 'es' : ''}`,
        priority: density > 85 ? 'Critical' : density > 75 ? 'High' : 'Medium',
        estimatedImpact: `Reduce density by ~${additionalCoaches * 8}-${additionalCoaches * 12}%`,
      });
    }
  });

  return recommendations.sort((a, b) => b.currentDensity - a.currentDensity);
}
