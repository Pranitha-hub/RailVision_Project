import React, { useState, useEffect } from 'react';
import { stations, allTrains, allAlerts, searchTrains, getCrowdDensity, getCrowdLevel } from '../data/mockData';
import { predictCrowdDensity, getRecommendations, getCompartmentBreakdown } from '../data/predictionEngine';
import TrainCard from '../components/TrainCard';
import AlertBanner from '../components/AlertBanner';
import CrowdBadge from '../components/CrowdBadge';
import Modal from '../components/Modal';
import PredictionChart from '../components/PredictionChart';

const Passenger = () => {
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchResults, setSearchResults] = useState(allTrains.slice(0, 6)); // Initial state
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleSearch = () => {
    const results = searchTrains(fromStation, toStation);
    setSearchResults(results);
  };

  const handleSwap = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const openTrainModal = (train) => {
    setSelectedTrain(train);
  };

  return (
    <div className="container page-enter" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="heading-display" style={{ fontSize: 'var(--fs-3xl)', marginBottom: 'var(--space-2)' }}>
          Find Your <span className="text-gradient">Train</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Search trains and check real-time crowd levels with AI predictions</p>
      </div>

      {/* Search Panel */}
      <div className="card" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">From Station</label>
            <select className="form-select" value={fromStation} onChange={(e) => setFromStation(e.target.value)}>
              <option value="">Select Source</option>
              {stations.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
            </select>
          </div>

          <button onClick={handleSwap} type="button" className="btn btn-ghost" style={{ marginBottom: '2px', fontSize: '1.2rem' }}>⇄</button>

          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">To Station</label>
            <select className="form-select" value={toStation} onChange={(e) => setToStation(e.target.value)}>
              <option value="">Select Destination</option>
              {stations.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
            </select>
          </div>

          <div className="form-group" style={{ minWidth: '160px' }}>
            <label className="form-label">Travel Date</label>
            <input type="date" className="form-input" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleSearch} style={{ marginBottom: '2px' }}>
            🔍 Search Trains
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div id="alerts-section" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Alerts</span>
          <span className="badge badge-red" style={{ fontSize: '10px' }}>LIVE</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {allAlerts.slice(0, 3).map(a => <AlertBanner key={a.id} alert={a} />)}
        </div>
      </div>

      {/* Train Results */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h2 className="heading-section" style={{ fontSize: 'var(--fs-xl)' }}>Available Trains</h2>
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>{searchResults.length} trains found</span>
        </div>
        <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
          {searchResults.map(train => <TrainCard key={train.id} train={train} onClick={openTrainModal} />)}
        </div>
      </div>

      {/* Train Details Modal */}
      {selectedTrain && (
        <Modal title={`Train Details — #${selectedTrain.trainNumber}`} onClose={() => setSelectedTrain(null)}>
          <TrainDetailContent train={selectedTrain} />
        </Modal>
      )}
    </div>
  );
};

const TrainDetailContent = ({ train }) => {
  const now = new Date();
  const density = getCrowdDensity(train.id, now.getHours(), now.getDay());
  const compartments = getCompartmentBreakdown(train.id);
  const predictions = predictCrowdDensity(train.id, 8);
  const recommendations = getRecommendations(allTrains, train.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)' }}>{train.trainName}</div>
          <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>{train.from.name} → {train.to.name}</div>
        </div>
        <CrowdBadge density={density} />
      </div>

      <div>
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-3)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compartment Breakdown</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {compartments.map(comp => (
            <div key={comp.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: 'var(--fs-sm)', minWidth: '100px', fontWeight: 500 }}>{comp.name}</span>
              <div style={{ flex: 1 }}>
                <div className="crowd-bar">
                  <div className={`crowd-bar-fill ${comp.level}`} style={{ width: `${comp.density}%` }}></div>
                </div>
              </div>
              <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, minWidth: '60px', textAlign: 'right', color: comp.level === 'low' ? 'var(--crowd-low)' : comp.level === 'moderate' ? 'var(--crowd-moderate)' : 'var(--crowd-high)' }}>{comp.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-3)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Crowd Prediction (Next 8 Hours)</h4>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', height: '220px' }}>
          <PredictionChart predictions={predictions} />
        </div>
      </div>

      {recommendations.length > 0 && (
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 'var(--space-3)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>💡 Less Crowded Alternatives</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {recommendations.slice(0, 3).map(rec => (
              <div key={rec.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{rec.trainName.split(' ').slice(0, 4).join(' ')}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>Best time: {rec.bestTimeToTravel.label}</div>
                </div>
                <CrowdBadge density={rec.currentDensity} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Passenger;
