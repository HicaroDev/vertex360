import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase environment variables are missing. ' +
        'Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
}

// Initialize only if variables are present to avoid build-time crashes
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;

// Types for our database tables
export type Client = {
    id: string;
    name: string;
    company: string;
    status: string;
    segment: string;
    progress: number;
    health: string;
    since: string;
    next_meeting?: string;
    access_login?: string;
    access_password?: string;
    created_at: string;
    updated_at: string;
};

export type Document = {
    id: string;
    client_id: string;
    title: string;
    category: string;
    content?: string;
    is_public: boolean;
    status: 'draft' | 'analyzing' | 'published' | 'archived' | string;
    last_edit: string;
    created_at: string;
    updated_at: string;
};

export type Workspace = {
    id: string;
    client_id: string;
    folder_name: string;
    icon: string;
    color: string;
    order_position?: number;
    created_at: string;
    updated_at: string;
};
