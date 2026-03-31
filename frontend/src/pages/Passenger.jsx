import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, HeartHandshake, Shield, Sparkles,
         AlertCircle, RefreshCw, Map, Loader2 } from 'lucide-react';
import { stations, getCrowdLevel } from '../data/stations';
import { apiClient } from '../data/apiClient';
import TrainCard from '../components/TrainCard';
import CrowdBadge from '../components/CrowdBadge';
import Modal from '../components/Modal';
import PredictionChart from '../components/PredictionChart';

// ── Leaflet is loaded via CDN in index.html ──────────────────────────────────
const L = typeof window !== 'undefined' ? window.L : null;

const Passenger = () => {
  const [fromStation, setFromStation] = useState('');
  const [toStation,   setToStation]   = useState('');
  const [travelDate,  setTravelDate]  = useState(new Date().toISOString().split('T')[0]);
  const [trains,      setTrains]      = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showMap, setShowMap]         = useState(false);
  const mapRef   = useRef(null);
  const mapInst  = useRef(null);

  // Load all trains on mount
  useEffect(() => {
    fetchTrains('', '');
  }, []);

  const fetchTrains = async (from, to) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.getTrains(from, to);
      setTrains(res.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchTrains(fromStation, toStation);

  const handleSwap = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  // Leaflet map initialization
  useEffect(() => {
    if (!showMap || !L || mapInst.current) return;

    const stationRef = stations.find(s => s.code === fromStation)
      || stations.find(s => s.code === toStation)
      || { lat: 22.5726, lng: 88.3639 }; // Default: Kolkata

    mapInst.current = L.map(mapRef.current).setView([stationRef.lat, stationRef.lng], 5);

    // Warm CartoDB tiles – no API key needed
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 16,
    }).addTo(mapInst.current);

    // Plot all station markers
    stations.forEach(st => {
      const isSource = st.code === fromStation;
      const isDest   = st.code === toStation;

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:${isSource || isDest ? 18 : 10}px;
          height:${isSource || isDest ? 18 : 10}px;
          border-radius:50%;
          background:${isSource ? '#C2502A' : isDest ? '#4A7C59' : '#A8A29E'};
          border:2px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
        "></div>`,
        iconSize: [isSource || isDest ? 18 : 10, isSource || isDest ? 18 : 10],
        iconAnchor: [isSource || isDest ? 9 : 5, isSource || isDest ? 9 : 5],
      });

      L.marker([st.lat, st.lng], { icon })
        .addTo(mapInst.current)
        .bindPopup(`<b>${st.name}</b><br/><span style="color:#78716C;font-size:12px">${st.code}</span>`);
    });

    // Draw route line if both selected
    if (fromStation && toStation) {
      const src = stations.find(s => s.code === fromStation);
      const dst = stations.find(s => s.code === toStation);
      if (src && dst) {
        L.polyline([[src.lat, src.lng], [dst.lat, dst.lng]], {
          color: '#C2502A', weight: 3, dashArray: '8,6', opacity: 0.8,
        }).addTo(mapInst.current);
        mapInst.current.fitBounds([[src.lat, src.lng], [dst.lat, dst.lng]], { padding: [60, 60] });
      }
    }

    return () => {
      if (mapInst.current) {
        mapInst.current.remove();
        mapInst.current = null;
      }
    };
  }, [showMap]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 'var(--space-24)' }}>
      <div className="container">

        {/* Header */}
        <div className="animate-fade-up" style={{ marginBottom: 'var(--space-12)' }}>
          <h1 className="h1" style={{ marginBottom: 'var(--space-2)' }}>Where to today?</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.125rem' }}>
            Find the quietest trains for your journey. Live crowd data, updated every few minutes.
          </p>
        </div>

        {/* Search Panel */}
        <div className="surface animate-fade-up" style={{ marginBottom: 'var(--space-8)', animationDelay: '100ms', padding: 'var(--space-8)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr auto', gap: 'var(--space-4)', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--terra)" /> From
              </label>
              <select className="form-input" value={fromStation} onChange={e => setFromStation(e.target.value)}>
                <option value="">Any origin</option>
                {stations.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
              </select>
            </div>

            <button onClick={handleSwap} title="Swap stations"
              style={{ width: '40px', height: '44px', borderRadius: '50%', border: '1.5px solid var(--cream-deep)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', flexShrink: 0 }}>
              <RefreshCw size={16} color="var(--ink-soft)" />
            </button>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--sage)" /> To
              </label>
              <select className="form-input" value={toStation} onChange={e => setToStation(e.target.value)}>
                <option value="">Any destination</option>
                {stations.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="var(--ink-soft)" /> Date
              </label>
              <input type="date" className="form-input" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
            </div>

            <button className="btn btn-primary" onClick={handleSearch}
              style={{ height: '44px', alignSelf: 'flex-end', gap: '8px', paddingInline: '1.5rem' }}>
              <Search size={18} />
              Search
            </button>
          </div>

          {/* Map toggle */}
          <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--cream-deep)' }}>
            <button
              onClick={() => setShowMap(v => !v)}
              className="btn btn-secondary"
              style={{ gap: '8px', fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}
            >
              <Map size={16} /> {showMap ? 'Hide Route Map' : 'Show Route Map'}
            </button>
          </div>
        </div>

        {/* Leaflet Map */}
        {showMap && (
          <div className="animate-fade-up" style={{ marginBottom: 'var(--space-8)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1.5px solid var(--cream-deep)', boxShadow: 'var(--shadow-md)', height: '380px' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="animate-fade-in" style={{ padding: 'var(--space-4)', background: 'var(--rose-soft)', border: '1px solid rgba(190,18,60,0.2)', borderRadius: 'var(--radius-lg)', color: 'var(--rose)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Results + Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-10)', alignItems: 'start' }}>

          {/* Train List */}
          <div>
            <div className="flex-between" style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--cream-deep)' }}>
              <h2 className="h2" style={{ fontSize: '1.5rem', margin: 0 }}>Available Journeys</h2>
              {loading
                ? <div className="flex items-center gap-2" style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}><Loader2 size={16} className="animate-spin" />Loading...</div>
                : <span className="badge badge-muted">{trains.length} {trains.length === 1 ? 'train' : 'trains'}</span>
              }
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ height: '120px', borderRadius: 'var(--radius-lg)', background: 'var(--cream-dark)', animation: 'pulse-soft 1.8s ease infinite', animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            ) : trains.length > 0 ? (
              <div className="flex flex-col gap-5">
                {trains.map(t => <TrainCard key={t.train_id} train={t} onClick={setSelectedTrain} />)}
              </div>
            ) : (
              <div className="surface" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
                <Search size={48} color="var(--ink-faint)" style={{ margin: '0 auto var(--space-4)' }} />
                <h3 className="h3">No trains found</h3>
                <p style={{ color: 'var(--ink-soft)' }}>Try adjusting your origin or destination.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="card-warm" style={{ padding: 'var(--space-6)' }}>
              <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-5)', fontSize: '1rem' }}>
                <AlertCircle size={18} color="var(--amber)" /> Service Updates
              </h3>
              <div className="flex flex-col gap-4">
                <ServiceUpdate icon={Shield} text="Extra coaches added on Delhi–Mumbai routes this weekend due to high demand." />
                <ServiceUpdate icon={AlertCircle} text="Peak hour delays expected on Howrah–Patna corridor. Best to travel after 7 PM." />
                <ServiceUpdate icon={Sparkles} text="Vande Bharat bookings open for the Bangalore–Chennai route from next Monday." />
              </div>
            </div>

            <div className="card" style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, white, var(--cream-dark))' }}>
              <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>
                <HeartHandshake size={18} color="var(--terra)" /> Smarter Travel Tip
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                Travelling just <strong>15–20 minutes</strong> before or after peak hour can reduce your carriage's crowd level by up to 40%. We highlight the best windows for you in the train details.
              </p>
            </div>
          </div>

        </div>

        {/* Train Detail Modal */}
        {selectedTrain && (
          <Modal title={selectedTrain.train_name} onClose={() => setSelectedTrain(null)}>
            <TrainDetailModal train={selectedTrain} />
          </Modal>
        )}
      </div>
    </div>
  );
};

// ── Train Detail (inside Modal) ────────────────────────────────────────────────
const TrainDetailModal = ({ train }) => {
  const [crowdData,   setCrowdData]   = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [crowd, pred] = await Promise.all([
          apiClient.getCrowdData(train.train_id),
          apiClient.getPrediction(train.train_id),
        ]);
        setCrowdData(crowd);
        // Shape prediction for PredictionChart: [{ time, density }]
        setPredictions(pred.predictions.map(p => ({
          time: new Date(p.hour).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          density: p.predicted_level,
        })));
      } catch (e) {
        console.error('Detail load failed:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [train.train_id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)', gap: '12px', color: 'var(--ink-muted)' }}>
        <Loader2 size={24} className="animate-spin" /> Loading live data...
      </div>
    );
  }

  const level        = crowdData?.current?.crowd_level ?? train.current_crowd_level ?? 50;
  const compartments = crowdData?.compartments ?? {};
  const compArray    = Object.entries(compartments).map(([name, density]) => ({ name: name.toUpperCase(), density }));

  return (
    <div className="flex flex-col gap-8">

      {/* Overview */}
      <div className="flex-between flex-wrap gap-4" style={{ paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--cream-deep)' }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', fontWeight: 500 }}>
            {train.source} → {train.destination}
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '4px' }}>
            {train.train_name}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontWeight: 600 }}>Current Load</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{level}%</div>
          </div>
          <CrowdBadge density={level} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>

        {/* Carriage Breakdown */}
        <div>
          <h3 className="h3" style={{ marginBottom: 'var(--space-2)', fontSize: '1.125rem' }}>Find your space</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-soft)', marginBottom: 'var(--space-5)' }}>
            Head to the greener carriages for more room.
          </p>
          <div className="flex flex-col gap-3">
            {compArray.map(({ name, density: d }) => (
              <div key={name} className="flex items-center gap-3"
                style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--cream-dark)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.8125rem', width: '70px', flexShrink: 0 }}>{name}</span>
                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: `${d}%`,
                    backgroundColor: d > 75 ? 'var(--rose)' : d > 50 ? 'var(--amber)' : 'var(--sage)'
                  }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', width: '36px', textAlign: 'right' }}>{d}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Chart */}
        <div className="card-warm" style={{ padding: 'var(--space-5)' }}>
          <h3 className="h3" style={{ marginBottom: '4px', fontSize: '1.125rem' }}>Busyness forecast</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-soft)', marginBottom: 'var(--space-4)' }}>
            How busy we expect the train to be over the next 8 hours.
          </p>
          <div style={{ height: '200px' }}>
            {predictions.length > 0
              ? <PredictionChart predictions={predictions} />
              : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ink-faint)' }}>No forecast data</div>
            }
          </div>
        </div>
      </div>

      {/* Book CTA */}
      <div style={{ textAlign: 'center', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--cream-deep)' }}>
        <a
          href="https://www.irctc.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ padding: '0.875rem 2.5rem', fontSize: '1rem' }}
        >
          Book on IRCTC →
        </a>
        <div style={{ marginTop: '10px', fontSize: '0.8125rem', color: 'var(--ink-faint)' }}>
          Opens the official Indian Railways booking site
        </div>
      </div>
    </div>
  );
};

const ServiceUpdate = ({ icon: Icon, text }) => (
  <div className="flex items-start gap-3" style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--cream-deep)' }}>
    <Icon size={16} color="var(--ink-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{text}</p>
  </div>
);

export default Passenger;
