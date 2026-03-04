import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import './App.css';

// Get API URL from environment variable or default to local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [source, setSource] = useState('');
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`survey-backend-g4gc.onrender.com/api/sources`);
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source) return;
    try {
      const res = await fetch(`${API_URL}/api/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source }),
      });
      if (res.ok) {
        setSource('');
        fetchEntries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>How did you find out about Aquatech Scientific Instruments?</h1>
      </header>
      <main>
        <div className="card">
          
          <form onSubmit={handleSubmit} className="source-form">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="" disabled>How did you find out about us?</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Our website">Our website</option>
            </select>
            <button type="submit" disabled={!source}>Choose</button>
          </form>


          <div className="chart-wrapper" style={{ height: 250, marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(() => {
                  const counts = entries.reduce((acc, e) => { acc[e.source] = (acc[e.source] || 0) + 1; return acc; }, {});
                  return Object.entries(counts).map(([name, value]) => ({ name, value }));
                })()}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="stats">
            <div className="stat">
              <h3># of customers surveyed</h3>
              <p>{entries.length}</p>
            </div>
            <div className="stat">
              <h3>#1 way customers found out about us</h3>
              <p>{(() => {
                if (!entries.length) return '-';
                const counts = entries.reduce((acc, e) => { acc[e.source] = (acc[e.source] || 0) + 1; return acc; }, {});
                const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
                return `${top[0]} (${top[1]})`;
              })()}</p>
            </div>
          </div>

          <ul className="entries-list">
            {entries.map((entry) => (
              <li key={entry._id}>
                <span>{entry.source}</span>
                <span className="meta">{new Date(entry.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
