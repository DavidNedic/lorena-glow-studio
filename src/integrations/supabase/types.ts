export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      invite_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          id: string
          used_at: string | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          id?: string
          used_at?: string | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          id?: string
          used_at?: string | null
        }
        Relationships: []
      }
      member_feedback: {
        Row: {
          created_at: string
          id: string
          member_id: string
          sterne: number
          text: string
          veroeffentlichen: boolean
          voucher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          sterne: number
          text?: string
          veroeffentlichen?: boolean
          voucher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          sterne?: number
          text?: string
          veroeffentlichen?: boolean
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_feedback_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_feedback_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: true
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      member_offers: {
        Row: {
          active: boolean
          code: string
          condition: string
          created_at: string
          id: string
          title: string
          valid_until: string | null
        }
        Insert: {
          active?: boolean
          code: string
          condition?: string
          created_at?: string
          id?: string
          title: string
          valid_until?: string | null
        }
        Update: {
          active?: boolean
          code?: string
          condition?: string
          created_at?: string
          id?: string
          title?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          confirm_token: string
          created_at: string
          email: string
          id: string
          invite_code: string
          member_code: string
          nachname: string
          newsletter: boolean
          newsletter_confirmed_at: string | null
          newsletter_token: string
          unsubscribed_at: string | null
          vorname: string
        }
        Insert: {
          confirm_token?: string
          created_at?: string
          email: string
          id?: string
          invite_code?: string
          member_code?: string
          nachname?: string
          newsletter?: boolean
          newsletter_confirmed_at?: string | null
          newsletter_token?: string
          unsubscribed_at?: string | null
          vorname: string
        }
        Update: {
          confirm_token?: string
          created_at?: string
          email?: string
          id?: string
          invite_code?: string
          member_code?: string
          nachname?: string
          newsletter?: boolean
          newsletter_confirmed_at?: string | null
          newsletter_token?: string
          unsubscribed_at?: string | null
          vorname?: string
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          betreff: string
          button_text: string
          button_url: string
          created_at: string
          empfaenger: number
          gesendet_at: string | null
          id: string
          status: string
          text: string
          ueberschrift: string
          updated_at: string
          vorschau: string
        }
        Insert: {
          betreff: string
          button_text?: string
          button_url?: string
          created_at?: string
          empfaenger?: number
          gesendet_at?: string | null
          id?: string
          status?: string
          text: string
          ueberschrift: string
          updated_at?: string
          vorschau?: string
        }
        Update: {
          betreff?: string
          button_text?: string
          button_url?: string
          created_at?: string
          empfaenger?: number
          gesendet_at?: string | null
          id?: string
          status?: string
          text?: string
          ueberschrift?: string
          updated_at?: string
          vorschau?: string
        }
        Relationships: []
      }
      rechnungen: {
        Row: {
          bezahlt: boolean
          brutto: number
          created_at: string
          datum: string
          id: string
          kunde_adresse: string
          kunde_email: string
          kunde_name: string
          leistungsdatum: string
          netto: number
          notiz: string
          nummer: string
          positionen: Json
          storniert_at: string | null
          ust: number
          ust_satz: number
          zahlungsart: string
        }
        Insert: {
          bezahlt?: boolean
          brutto: number
          created_at?: string
          datum?: string
          id?: string
          kunde_adresse?: string
          kunde_email?: string
          kunde_name: string
          leistungsdatum?: string
          netto: number
          notiz?: string
          nummer: string
          positionen?: Json
          storniert_at?: string | null
          ust: number
          ust_satz?: number
          zahlungsart?: string
        }
        Update: {
          bezahlt?: boolean
          brutto?: number
          created_at?: string
          datum?: string
          id?: string
          kunde_adresse?: string
          kunde_email?: string
          kunde_name?: string
          leistungsdatum?: string
          netto?: number
          notiz?: string
          nummer?: string
          positionen?: Json
          storniert_at?: string | null
          ust?: number
          ust_satz?: number
          zahlungsart?: string
        }
        Relationships: []
      }
      signup_attempts: {
        Row: {
          created_at: string
          id: string
          ip_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          code: string
          created_at: string
          feedback_sent_at: string | null
          feedback_token: string
          id: string
          member_id: string
          rabatt_prozent: number
          redeemed_at: string | null
          redeemed_note: string | null
        }
        Insert: {
          code: string
          created_at?: string
          feedback_sent_at?: string | null
          feedback_token?: string
          id?: string
          member_id: string
          rabatt_prozent?: number
          redeemed_at?: string | null
          redeemed_note?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          feedback_sent_at?: string | null
          feedback_token?: string
          id?: string
          member_id?: string
          rabatt_prozent?: number
          redeemed_at?: string | null
          redeemed_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: true
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      member_offers_public: {
        Row: {
          condition: string | null
          id: string | null
          title: string | null
          valid_until: string | null
        }
        Insert: {
          condition?: string | null
          id?: string | null
          title?: string | null
          valid_until?: string | null
        }
        Update: {
          condition?: string | null
          id?: string | null
          title?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      next_rechnung_nummer: { Args: never; Returns: string }
      redeem_invite: {
        Args: {
          _code: string
          _email: string
          _newsletter: boolean
          _vorname: string
        }
        Returns: string
      }
      reveal_offer_code: {
        Args: { _member_code: string; _offer_id: string }
        Returns: string
      }
      unsubscribe_newsletter: { Args: { _token: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
