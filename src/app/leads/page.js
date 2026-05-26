'use client';

import { useEffect, useState } from 'react';

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data.leads.reverse());
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Brady's Detail Shop</h1>
          <p className="text-gray-400 text-sm mt-1">Appointment Requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Total Leads</p>
            <p className="text-3xl font-bold mt-1">{leads.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Today</p>
            <p className="text-3xl font-bold mt-1">
              {leads.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide">This Week</p>
            <p className="text-3xl font-bold mt-1">
              {leads.filter(l => {
                const diff = (new Date() - new Date(l.timestamp)) / (1000 * 60 * 60 * 24);
                return diff <= 7;
              }).length}
            </p>
          </div>
        </div>

        {/* Leads Table */}
        {loading ? (
          <p className="text-gray-500">Loading leads...</p>
        ) : leads.length === 0 ? (
          <p className="text-gray-500">No leads yet.</p>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Phone</th>
                  <th className="text-left px-5 py-3">Requested Time</th>
                  <th className="text-left px-5 py-3">Captured</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr key={i} className="border-b border-gray-800 last:border-0 hover:bg-gray-800 transition">
                    <td className="px-5 py-4 font-medium">{lead.name}</td>
                    <td className="px-5 py-4 text-gray-300">{lead.phone}</td>
                    <td className="px-5 py-4 text-gray-300">{lead.time}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(lead.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}