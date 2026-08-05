'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Trash2, Edit3, FileJson, FileSpreadsheet, FileText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface HistoryRecord {
  id: string;
  location: string;
  city?: string;
  country?: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  airQuality: string;
  notes?: string;
  searchedAt: string;
}

export function HistoryTable() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Edit modal state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState('');
  const [editTemp, setEditTemp] = useState<number | string>('');
  const [editCondition, setEditCondition] = useState('');
  const [editNote, setEditNote] = useState('');
  const [savingRecord, setSavingRecord] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history?page=${page}&limit=10&search=${encodeURIComponent(search)}`);
      const json = await res.json();
      if (json.success) {
        setHistory(json.data.items || []);
        setTotalPages(json.data.totalPages || 1);
        setTotalCount(json.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleSaveRecord = async () => {
    if (!editingId) return;
    setSavingRecord(true);
    try {
      const res = await fetch(`/api/history/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: editLocation || undefined,
          temperature: editTemp !== '' ? Number(editTemp) : undefined,
          weatherCondition: editCondition || undefined,
          notes: editNote || undefined,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchHistory();
      } else {
        const json = await res.json();
        alert(json.error?.message || 'Failed to update record');
      }
    } catch (err) {
      console.error('Failed to update record:', err);
    } finally {
      setSavingRecord(false);
    }
  };

  const handleExport = (format: 'json' | 'csv' | 'pdf') => {
    window.open(`/api/export/${format}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Search History & Audit Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total Logged Queries: {totalCount} records
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2" suppressHydrationWarning>
          <button
            suppressHydrationWarning
            onClick={() => handleExport('json')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition-all"
          >
            <FileJson className="w-4 h-4" />
            <span>JSON</span>
          </button>
          <button
            suppressHydrationWarning
            onClick={() => handleExport('csv')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            suppressHydrationWarning
            onClick={() => handleExport('pdf')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* Filter Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          suppressHydrationWarning
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter history by city or weather condition..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl glass-card border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      {/* Table Container */}
      <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-xs font-bold uppercase text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Temp</th>
                <th className="px-6 py-4">Humidity</th>
                <th className="px-6 py-4">Wind</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">AQI</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4">Searched At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                    <span className="mt-2 block text-xs">Loading database records...</span>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    No history records found. Try performing a location search!
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {record.location}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">
                      {record.temperature}°C
                    </td>
                    <td className="px-6 py-4">{record.humidity}%</td>
                    <td className="px-6 py-4">{record.windSpeed} km/h</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {record.weatherCondition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">{record.airQuality}</td>
                    <td className="px-6 py-4 text-xs italic max-w-xs truncate">
                      {record.notes || <span className="text-slate-400 font-normal">No notes</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400" suppressHydrationWarning>
                      {new Date(record.searchedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(record.id);
                          setEditLocation(record.location);
                          setEditTemp(record.temperature);
                          setEditCondition(record.weatherCondition);
                          setEditNote(record.notes || '');
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Record Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Edit Weather Record (UPDATE)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Location Name:
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Temperature (°C):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editTemp}
                    onChange={(e) => setEditTemp(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Weather Condition:
                  </label>
                  <input
                    type="text"
                    value={editCondition}
                    onChange={(e) => setEditCondition(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  User Notes:
                </label>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Add user annotations or location comments..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRecord}
                disabled={savingRecord}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                {savingRecord ? 'Saving...' : 'Update Record'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
