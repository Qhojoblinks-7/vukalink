// src/features/company/components/CompanyAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  EyeIcon, 
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { supabase } from '@services/supabaseClient';
import { useAuth } from '@hooks/useAuth';

const CompanyAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalOpportunities: 0,
    totalApplications: 0,
    activeOpportunities: 0,
    averageApplications: 0,
    topOpportunities: [],
    recentActivity: [],
    applicationTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('30'); // days

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeFrame]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const companyId = user.id;
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - parseInt(timeFrame));

      // Fetch opportunities
      const { data: opportunities, error: oppError } = await supabase
        .from('internships')
        .select('id, title, status, posted_at, application_deadline')
        .eq('company_id', companyId);

      if (oppError) throw oppError;

      // Fetch applications for company's opportunities
      const opportunityIds = opportunities.map(opp => opp.id);
      let applicationsQuery = supabase
        .from('applications')
        .select('id, internship_id, status, applied_at, internships(title)')
        .in('internship_id', opportunityIds);

      if (timeFrame !== 'all') {
        applicationsQuery = applicationsQuery.gte('applied_at', dateLimit.toISOString());
      }

      const { data: applications, error: appError } = await applicationsQuery;

      if (appError) throw appError;

      // Calculate analytics
      const totalOpportunities = opportunities.length;
      const activeOpportunities = opportunities.filter(opp => opp.status === 'Open').length;
      const totalApplications = applications.length;
      const averageApplications = totalOpportunities > 0 ? (totalApplications / totalOpportunities).toFixed(1) : 0;

      // Top opportunities by application count
      const oppApplicationCounts = opportunityIds.map(oppId => {
        const oppApplications = applications.filter(app => app.internship_id === oppId);
        const opportunity = opportunities.find(opp => opp.id === oppId);
        return {
          id: oppId,
          title: opportunity?.title || 'Unknown',
          applications: oppApplications.length,
          status: opportunity?.status || 'Unknown'
        };
      });

      const topOpportunities = oppApplicationCounts
        .sort((a, b) => b.applications - a.applications)
        .slice(0, 5);

      // Recent activity
      const recentActivity = applications
        .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
        .slice(0, 10)
        .map(app => ({
          id: app.id,
          type: 'application',
          title: `New application for ${app.internships?.title || 'Unknown Position'}`,
          time: app.applied_at,
          status: app.status
        }));

      // Application trends (last 7 days)
      const trends = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayApplications = applications.filter(app => {
          const appDate = new Date(app.applied_at);
          return appDate >= dayStart && appDate <= dayEnd;
        });

        trends.push({
          date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          applications: dayApplications.length
        });
      }

      setAnalytics({
        totalOpportunities,
        totalApplications,
        activeOpportunities,
        averageApplications,
        topOpportunities,
        recentActivity,
        applicationTrends: trends
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' ? (
                <TrendingUpIcon className="h-4 w-4 mr-1" />
              ) : trend === 'down' ? (
                <TrendingDownIcon className="h-4 w-4 mr-1" />
              ) : null}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Frame Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Opportunities"
          value={analytics.totalOpportunities}
          icon={ChartBarIcon}
          color="blue"
        />
        <StatCard
          title="Active Opportunities"
          value={analytics.activeOpportunities}
          icon={EyeIcon}
          color="green"
        />
        <StatCard
          title="Total Applications"
          value={analytics.totalApplications}
          icon={UserGroupIcon}
          color="purple"
        />
        <StatCard
          title="Avg Applications/Job"
          value={analytics.averageApplications}
          icon={ClockIcon}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Opportunities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Opportunities by Applications</h3>
          <div className="space-y-3">
            {analytics.topOpportunities.length > 0 ? (
              analytics.topOpportunities.map((opp, index) => (
                <div key={opp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900 truncate">{opp.title}</p>
                      <p className="text-sm text-gray-500">{opp.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{opp.applications}</p>
                    <p className="text-xs text-gray-500">applications</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No opportunities found</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <UserGroupIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.time).toLocaleDateString()} at{' '}
                      {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                    activity.status === 'Viewed' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'Offer' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Application Trends Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends (Last 7 Days)</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {analytics.applicationTrends.map((day, index) => {
            const maxApplications = Math.max(...analytics.applicationTrends.map(d => d.applications));
            const height = maxApplications > 0 ? (day.applications / maxApplications) * 100 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '200px' }}>
                  <div
                    className="w-full bg-blue-500 rounded-t-lg absolute bottom-0 transition-all duration-500"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-900">{day.applications}</p>
                  <p className="text-xs text-gray-500">{day.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;