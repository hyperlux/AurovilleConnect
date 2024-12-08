import React from 'react';
import { Users, Leaf, Heart, Globe } from 'lucide-react';
import WelcomeBanner from './components/WelcomeBanner';
import TodayEvents from './components/TodayEvents';
import CriticalAnnouncements from './components/CriticalAnnouncements';
import DecisionHub from './components/DecisionHub';
import Bazaar from './components/Bazaar';
import StatsGrid from './components/StatsGrid';
import CommunityHighlights from './components/CommunityHighlights';
import LatestPosts from './components/LatestPosts';

const stats = [
  { label: 'Residents', value: '3,246', icon: Users, trend: '+12%' },
  { label: 'Active Projects', value: '186', icon: Leaf, trend: '+8%' },
  { label: 'Volunteer Programs', value: '42', icon: Heart, trend: '+15%' },
  { label: 'Visiting Groups', value: '24', icon: Globe, trend: '+5%' },
];

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-[#1E1E1E]">
      <div className="max-w-full mx-auto pt-2 px-3">
        {/* Priority 1: Critical Announcements */}
        <div className="mb-4">
          <CriticalAnnouncements />
        </div>

        {/* Priority 2: Welcome Banner */}
        <div className="mb-4">
          <WelcomeBanner />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Left Column - Spans 2 columns */}
          <div className="lg:col-span-2 space-y-4">            
            {/* Priority 3: Today's Events */}
            <TodayEvents />
            
            {/* Priority 4: Decision Hub */}
            <DecisionHub />

            {/* Priority 5: Community Highlights */}
            <CommunityHighlights />

            {/* Priority 6: Latest Posts */}
            <LatestPosts />
          </div>

          {/* Right Column */}
          <div className="space-y-4">            
            {/* Priority 7: Marketplace */}
            <Bazaar />
            
            {/* Priority 8: Stats Grid */}
            <StatsGrid stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}
