import { createClient } from "@supabase/supabase-js";
import { readFileSync as read } from "fs";

/* @ts-ignore */
export const env: {
	supabase_url: string;
	supabase_key: string;
} = {};
read(".env").toString().split("\n").map(s => s.split("="))
	.forEach(entry => entry[0] && entry[0][0] !== "#" && (env[entry[0].toLowerCase()] = entry[1]));

console.log(env);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      channels: {
        Row: {
          createdAt: string
          id: number
          messageIds: number[]
          sender: number
          sendTo: number
        }
        Insert: {
          createdAt?: string
          id?: number
          messageIds?: number[]
          sender: number
          sendTo: number
        }
        Update: {
          createdAt?: string
          id?: number
          messageIds?: number[]
          sender?: number
          sendTo?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_channels_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          content: string | null
          created_at: string
          file: string[]
          id: number
          sentBy: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          file?: string[]
          id?: number
          sentBy: string
        }
        Update: {
          content?: string | null
          created_at?: string
          file?: string[]
          id?: number
          sentBy?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          channels: number[]
          created_at: string
          id: number
          linkedTo: number | null
          schedule: Json | null
          username: string | null
        }
        Insert: {
          channels?: number[]
          created_at?: string
          id?: number
          linkedTo?: number | null
          schedule?: Json | null
          username?: string | null
        }
        Update: {
          channels?: number[]
          created_at?: string
          id?: number
          linkedTo?: number | null
          schedule?: Json | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never


export const supabase = createClient<Database>(env.supabase_url, env.supabase_key);