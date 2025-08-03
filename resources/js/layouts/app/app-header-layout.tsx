import { AppContent } from '@/components/app-content';
import AppFooter from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children }: PropsWithChildren) {
    return (
        <AppShell>
            <AppHeader />
            <AppContent>{children}</AppContent>
            <AppFooter />
        </AppShell>
    );
}
