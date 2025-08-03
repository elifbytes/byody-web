import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { Cart } from './cart';
import { Collection } from './collection';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    cart?: Cart;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    collections: Collection[];
    exchangeRate?: number;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    phone?: string | null;
    [key: string]: unknown; // This allows for additional properties...
}

export type Language = Record<string, string>;

export type Link = { url: string | null; label: string; active: boolean };

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Link[];
    path: string;
    first_page_url: string;
    last_page_url: string;
};

export type UrlParams = {
    filter?: Record<string, string>;
    sort?: string;
};
