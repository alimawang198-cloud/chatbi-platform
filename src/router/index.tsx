import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ChatBIPage } from '../pages/chatbi/ChatBIPage';
import { ReportListPage } from '../pages/reports/ReportListPage';
import { ReportDetailPage } from '../pages/reports/ReportDetailPage';
import { AnalyzePage } from '../pages/analyze/AnalyzePage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { SemanticLayerPage } from '../pages/semantic/SemanticLayerPage';
import { AuthGuard } from '../components/layout/AuthGuard';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'chatbi', element: <ChatBIPage /> },
          { path: 'reports', element: <ReportListPage /> },
          { path: 'reports/:id', element: <ReportDetailPage /> },
          { path: 'analyze', element: <AnalyzePage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'semantic', element: <SemanticLayerPage /> },
        ],
      },
    ],
  },
]);
