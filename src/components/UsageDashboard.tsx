import React, { useEffect, useState } from 'react';
import { APIManager } from '../services/api/APIManager';

interface UsageStats {
  calls: number;
  bytesProcessed: number;
  quotaRemaining: number;
  cacheHits: number;
  lastReset: Date;
}

export const UsageDashboard: React.FC = () => {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const apiManager = APIManager.getInstance();

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStats = () => {
    const usage = apiManager.getUsageStats();
    setStats({
      calls: usage.calls,
      bytesProcessed: usage.bytesProcessed,
      quotaRemaining: apiManager.getRemainingQuota(),
      cacheHits: apiManager.getCacheHits(),
      lastReset: usage.lastReset
    });
  };

  if (!stats) return null;

  return (
    <div className="usage-dashboard">
      <div className="dashboard-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>API Usage {isExpanded ? '▼' : '▶'}</h3>
        <div className="quota-indicator">
          Remaining: {((stats.quotaRemaining / 3600000) * 100).toFixed(1)}%
        </div>
      </div>

      {isExpanded && (
        <div className="dashboard-details">
          <div className="stat-row">
            <label>API Calls:</label>
            <span>{stats.calls}</span>
          </div>
          <div className="stat-row">
            <label>Data Processed:</label>
            <span>{(stats.bytesProcessed / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="stat-row">
            <label>Cache Hits:</label>
            <span>{stats.cacheHits}</span>
          </div>
          <div className="stat-row">
            <label>Last Reset:</label>
            <span>{stats.lastReset.toLocaleDateString()}</span>
          </div>
          <div className="usage-bar">
            <div 
              className="usage-fill" 
              style={{ 
                width: `${(stats.calls / (stats.calls + stats.quotaRemaining)) * 100}%`,
                backgroundColor: stats.quotaRemaining < 1000 ? '#dc3545' : '#28a745'
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}; 