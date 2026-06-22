import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SupabaseDataProvider, useSupabaseData } from './utils/SupabaseDataContext';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';

// Import Layouts
import AuthLayout from './layouts/auth-layout';
import AppLayout from './layouts/app-layout';
import SettingsLayout from './layouts/settings/layout';

// Import Pages
import Welcome from './pages/welcome';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import PendingApproval from './pages/auth/pending-approval';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import VerifyEmail from './pages/auth/verify-email';
import ConfirmPassword from './pages/auth/confirm-password';
import TwoFactorChallenge from './pages/auth/two-factor-challenge';

import Dashboard from './pages/dashboard';
import Pos from './pages/pos';
import Products from './pages/products/index';
import Categories from './pages/categories/index';
import DiningTables from './pages/tables/index';
import Materials from './pages/materials/index';
import Staff from './pages/staff/index';
import Attendance from './pages/attendance/index';
import PublicTerminal from './pages/attendance/public-terminal';
import Shifts from './pages/shifts/index';
import Transactions from './pages/transactions/index';
import Kitchen from './pages/kitchen/index';
import Customers from './pages/customers/index';

import SettingsProfile from './pages/settings/profile';
import SettingsAppearance from './pages/settings/appearance';
import SettingsSecurity from './pages/settings/security';

function AuthPageWrapper({ Component, authenticatedRedirect }: { Component: any; authenticatedRedirect?: (user: any) => string }) {
    const { user } = useSupabaseData();
    if (user && authenticatedRedirect) {
        return <Navigate to={authenticatedRedirect(user)} replace />;
    }
    const layoutProps = Component.layout || {};
    return (
        <AuthLayout title={layoutProps.title} description={layoutProps.description}>
            <Component />
        </AuthLayout>
    );
}

function SettingsPageWrapper({ Component }: { Component: any }) {
    return (
        <AppLayout>
            <SettingsLayout>
                <Component />
            </SettingsLayout>
        </AppLayout>
    );
}

function AppContent() {
    const { isLoading, user, refreshData } = useSupabaseData();

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#f7f9fb]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-semibold text-secondary font-mono tracking-widest uppercase">Memuat NexaPOS...</p>
                </div>
            </div>
        );
    }

    return (
        <TooltipProvider delayDuration={0}>
            {/* Refresher trigger for mock router sync */}
            <button id="supabase-data-refresher" className="hidden" onClick={refreshData}></button>
            
            <Routes>
                {/* Landing/Welcome Page */}
                <Route path="/" element={<Welcome />} />

                {/* Public Auth Routes */}
                <Route path="/login" element={<AuthPageWrapper Component={Login} authenticatedRedirect={(u) => u.role === 'owner' ? '/dashboard' : '/pos'} />} />
                <Route path="/register" element={<AuthPageWrapper Component={Register} authenticatedRedirect={() => '/dashboard'} />} />
                <Route path="/pending-approval" element={<AuthPageWrapper Component={PendingApproval} />} />
                <Route path="/forgot-password" element={<AuthPageWrapper Component={ForgotPassword} />} />
                <Route path="/reset-password" element={<AuthPageWrapper Component={ResetPassword} />} />
                <Route path="/verify-email" element={<AuthPageWrapper Component={VerifyEmail} />} />
                <Route path="/confirm-password" element={<AuthPageWrapper Component={ConfirmPassword} />} />
                <Route path="/two-factor-challenge" element={<AuthPageWrapper Component={TwoFactorChallenge} />} />

                {/* Public Terminal */}
                <Route path="/absensi/public-terminal" element={<PublicTerminal />} />

                {/* Protected Dashboard/POS Routes */}
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
                
                {/* Support both POS register routes */}
                <Route path="/pos" element={user ? <Pos /> : <Navigate to="/login" replace />} />
                <Route path="/kasir" element={user ? <Pos /> : <Navigate to="/login" replace />} />

                {/* CRUD/Admin views */}
                <Route path="/products" element={user ? <Products /> : <Navigate to="/login" replace />} />
                <Route path="/categories" element={user ? <Categories /> : <Navigate to="/login" replace />} />
                <Route path="/tables" element={user ? <DiningTables /> : <Navigate to="/login" replace />} />
                <Route path="/materials" element={user ? <Materials /> : <Navigate to="/login" replace />} />
                <Route path="/staff" element={user ? <Staff /> : <Navigate to="/login" replace />} />
                <Route path="/absensi" element={user ? <Attendance /> : <Navigate to="/login" replace />} />
                <Route path="/shifts" element={user ? <Shifts /> : <Navigate to="/login" replace />} />
                <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/login" replace />} />
                <Route path="/kitchen" element={user ? <Kitchen /> : <Navigate to="/login" replace />} />
                <Route path="/customers" element={user ? <Customers /> : <Navigate to="/login" replace />} />

                {/* Settings Routes */}
                <Route path="/settings" element={user ? <Navigate to="/settings/profile" replace /> : <Navigate to="/login" replace />} />
                <Route path="/settings/profile" element={user ? <SettingsPageWrapper Component={SettingsProfile} /> : <Navigate to="/login" replace />} />
                <Route path="/settings/appearance" element={user ? <SettingsPageWrapper Component={SettingsAppearance} /> : <Navigate to="/login" replace />} />
                <Route path="/settings/security" element={user ? <SettingsPageWrapper Component={SettingsSecurity} /> : <Navigate to="/login" replace />} />

                {/* Fallback routing */}
                <Route path="*" element={<Navigate to={user ? (user.role === 'owner' ? '/dashboard' : '/pos') : '/login'} replace />} />
            </Routes>
            <Toaster />
        </TooltipProvider>
    );
}

export default function App() {
    return (
        <SupabaseDataProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </SupabaseDataProvider>
    );
}
