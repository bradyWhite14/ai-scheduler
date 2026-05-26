'use client';

import { useEffect, useState, useMemo } from 'react';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const STATUS_ROW_CLASS = {
  confirmed: 'border-l-4 border-l-green-500',
  cancelled: 'border-l-4 border-l-red-500',
  pending: 'border-l-4 border-l-yellow-400',
};

const STATUS_BADGE_CLASS = {
  confirmed: 'bg-green-900 text-green-400',
  cancelled: 'bg-red-900 text-red-400',
  pending: 'bg-yellow-900 text-yellow-400',
};

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  async function handleLogin() {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthed(true);
        setAuthError('');
      } else {
        setAuthError('Incorrect password.');
      }
    } catch {
      setAuthError('Login failed. Please try again.');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin();
  }

  useEffect(() => {
    if (!authed) return;
    fetch('/api/leads')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setLeads(data.leads || []);
        setLoading(false);
      })
      .catch(() => {
        setFetchError(true);
        setLoading(false);
      });
  }, [authed]);

  async function updateStatus(id, status) {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
    try {
      await fetch('/api/leads/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch {
      // Silent failure; optimistic update stays
    }
  }

  const todayStr = new Date().toDateString();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter(l => {
      const matchesSearch =
        !q ||
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q));
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: leads.length,
      today: leads.filter(l => new Date(l.created_at).toDateString() === todayStr).length,
      pending: leads.filter(l => l.status === 'pending').length,
    }),
    [leads, todayStr]
  );

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold mb-1">Dashboard Login</h1>
          <p className="text-gray-400 text-sm mb-6">Brady's Detail Shop</p>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-3 outline-none placeholder-gray-500 mb-3"
          />

          {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition"
          >
            Log In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold">Brady's Detail Shop</h1>
          <p className="text-gray-400 text-sm mt-1">Appointment Requests</p>
        </div>

        {/* Stats — reflect filtered results */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Total</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Today</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.today}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Pending</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.pending}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none placeholder-gray-500 focus:border-blue-600 transition"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-600 transition"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading leads...</p>
        ) : fetchError ? (
          <p className="text-red-400">Failed to load leads. Please refresh the page.</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">
            {leads.length === 0 ? 'No leads yet.' : 'No leads match your search.'}
          </p>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-160">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Phone</th>
                    <th className="text-left px-5 py-3">Service</th>
                    <th className="text-left px-5 py-3">Requested Time</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Captured</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <tr
                      key={lead.id}
                      className={`border-b border-gray-800 last:border-0 hover:bg-gray-800 transition ${STATUS_ROW_CLASS[lead.status] ?? STATUS_ROW_CLASS.pending}`}
                    >
                      <td className="px-5 py-4 font-medium">{lead.name}</td>
                      <td className="px-5 py-4 text-gray-300">{lead.phone}</td>
                      <td className="px-5 py-4 text-gray-300">{lead.service || '—'}</td>
                      <td className="px-5 py-4 text-gray-300">{lead.time || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_BADGE_CLASS[lead.status] ?? STATUS_BADGE_CLASS.pending}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {lead.status !== 'confirmed' && (
                            <button
                              onClick={() => updateStatus(lead.id, 'confirmed')}
                              className="text-xs bg-green-900 hover:bg-green-800 text-green-400 px-3 py-1 rounded-lg transition"
                            >
                              Confirm
                            </button>
                          )}
                          {lead.status !== 'cancelled' && (
                            <button
                              onClick={() => updateStatus(lead.id, 'cancelled')}
                              className="text-xs bg-red-900 hover:bg-red-800 text-red-400 px-3 py-1 rounded-lg transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
