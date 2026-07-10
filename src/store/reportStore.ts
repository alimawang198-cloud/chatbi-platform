import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report, ChatMessage } from '../types';
import { reportTemplates } from '../mock/reportTemplates';

interface ReportState {
  reports: Report[];
  drafts: Report[];
  isLoading: boolean;
  generateReport: (messages: ChatMessage[], title: string) => Promise<Report>;
  saveDraft: (report: Report) => void;
  deleteDraft: (id: string) => void;
  getReport: (id: string) => Report | undefined;
}

let reportId = 100;

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: reportTemplates,
      drafts: reportTemplates.filter(r => r.status === 'draft'),
      isLoading: false,

      generateReport: async (messages: ChatMessage[], title: string) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 1500));

        const assistantMsgs = messages.filter(m => m.role === 'assistant' && !m.isError);
        const sections: Report['sections'] = assistantMsgs.map((m, i) => {
          if (m.chartData && m.chartType) {
            return {
              type: 'chart' as const,
              title: `分析图表 ${i + 1}`,
              content: '',
              chartData: m.chartData,
              chartType: m.chartType,
            };
          }
          return {
            type: 'strategy' as const,
            title: `分析发现 ${i + 1}`,
            content: m.strategy || m.content,
          };
        });

        const newReport: Report = {
          id: `rpt-${reportId++}`,
          title,
          summary: assistantMsgs[0]?.strategy?.slice(0, 100) || '分析报告',
          createdAt: new Date().toLocaleString('zh-CN'),
          updatedAt: new Date().toLocaleString('zh-CN'),
          status: 'draft',
          author: '当前用户',
          sections: sections.length > 0 ? sections : [
            {
              type: 'text',
              title: '分析总结',
              content: assistantMsgs.map(m => m.strategy || m.content).join('\n\n'),
            },
          ],
        };

        set(state => ({
          reports: [newReport, ...state.reports],
          drafts: [newReport, ...state.drafts],
          isLoading: false,
        }));

        return newReport;
      },

      saveDraft: (report) => {
        set(state => {
          const reports = state.reports.map(r => r.id === report.id ? { ...report, status: 'draft' as const } : r);
          const exists = state.reports.find(r => r.id === report.id);
          if (!exists) {
            reports.unshift({ ...report, status: 'draft' as const });
          }
          return {
            reports,
            drafts: reports.filter(r => r.status === 'draft'),
          };
        });
      },

      deleteDraft: (id) => {
        set(state => ({
          reports: state.reports.filter(r => r.id !== id),
          drafts: state.drafts.filter(r => r.id !== id),
        }));
      },

      getReport: (id) => get().reports.find(r => r.id === id),
    }),
    {
      name: 'chatbi_reports',
      partialize: (state) => ({
        reports: state.reports,
        drafts: state.drafts,
      }),
    }
  )
);
