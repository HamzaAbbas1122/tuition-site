"use client";

import { useState, useEffect } from "react";
import { ReactNode } from "react";

interface AdminTabsProps {
  directoryTab: ReactNode;
  studentAppsTab: ReactNode;
  teacherAppsTab: ReactNode;
  createTuitionTab: ReactNode;
  scheduleTab: ReactNode;
  rescheduleTab: ReactNode;
  paymentsTab: ReactNode;
  pendingStudentAppsCount: number;
  pendingTeacherAppsCount: number;
  pendingReschedulesCount: number;
}

type TabType = "directory" | "studentApps" | "teacherApps" | "createTuition" | "schedule" | "reschedules" | "payments";

export default function AdminTabs({
  directoryTab,
  studentAppsTab,
  teacherAppsTab,
  createTuitionTab,
  scheduleTab,
  rescheduleTab,
  paymentsTab,
  pendingStudentAppsCount,
  pendingTeacherAppsCount,
  pendingReschedulesCount,
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("directory");

  useEffect(() => {
    const handleSwitchTab = (e: CustomEvent) => {
      if (e.detail && e.detail.tab) {
        setActiveTab(e.detail.tab as TabType);
      }
    };
    window.addEventListener('switch-admin-tab', handleSwitchTab as EventListener);
    return () => window.removeEventListener('switch-admin-tab', handleSwitchTab as EventListener);
  }, []);

  const tabs: { id: TabType; label: string; icon: string; count?: number }[] = [
    { id: "directory", label: "Directory", icon: "👥" },
    { id: "studentApps", label: "Student Apps", icon: "🎓", count: pendingStudentAppsCount },
    { id: "teacherApps", label: "Teacher Apps", icon: "👨‍🏫", count: pendingTeacherAppsCount },
    { id: "createTuition", label: "Create Tuition", icon: "➕" },
    { id: "schedule", label: "Teacher Schedule", icon: "📅" },
    { id: "reschedules", label: "Reschedule Requests", icon: "⏳", count: pendingReschedulesCount },
    { id: "payments", label: "Classes & Payments", icon: "💳" },
  ];

  return (
    <div className="space-y-6">
      {/* Scrollable Tab Bar */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
        <div className="flex space-x-2 bg-slate-200/50 p-1.5 rounded-2xl w-max border border-slate-300/40 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-white text-blue-700 shadow-sm border border-slate-200/60 scale-100"
                  : "text-slate-600 hover:bg-slate-300/50 hover:text-slate-900 scale-95 hover:scale-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === tab.id ? "bg-blue-100 text-blue-800" : "bg-slate-300 text-slate-700"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "directory" && directoryTab}
        {activeTab === "studentApps" && studentAppsTab}
        {activeTab === "teacherApps" && teacherAppsTab}
        {activeTab === "createTuition" && createTuitionTab}
        {activeTab === "schedule" && scheduleTab}
        {activeTab === "reschedules" && rescheduleTab}
        {activeTab === "payments" && paymentsTab}
      </div>
    </div>
  );
}
