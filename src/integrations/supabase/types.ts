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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      coupons_claimed: {
        Row: {
          claimed_at: string
          coupon_code: string
          id: string
          notes: string | null
          promotion_id: string | null
          referrer: string | null
          session_id: string | null
          source_cta: string | null
          user_agent: string | null
          validated_at: string | null
        }
        Insert: {
          claimed_at?: string
          coupon_code: string
          id?: string
          notes?: string | null
          promotion_id?: string | null
          referrer?: string | null
          session_id?: string | null
          source_cta?: string | null
          user_agent?: string | null
          validated_at?: string | null
        }
        Update: {
          claimed_at?: string
          coupon_code?: string
          id?: string
          notes?: string | null
          promotion_id?: string | null
          referrer?: string | null
          session_id?: string | null
          source_cta?: string | null
          user_agent?: string | null
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_claimed_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotion"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          active: boolean
          answer: string
          created_at: string
          display_order: number
          id: string
          question: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          question: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      holiday_overrides: {
        Row: {
          closed: boolean
          created_at: string
          custom_close_time: string | null
          custom_label: string | null
          custom_open_time: string | null
          id: string
          override_date: string
        }
        Insert: {
          closed?: boolean
          created_at?: string
          custom_close_time?: string | null
          custom_label?: string | null
          custom_open_time?: string | null
          id?: string
          override_date: string
        }
        Update: {
          closed?: boolean
          created_at?: string
          custom_close_time?: string | null
          custom_label?: string | null
          custom_open_time?: string | null
          id?: string
          override_date?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_slot_key: string | null
          name: string
          price_cents: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_slot_key?: string | null
          name: string
          price_cents?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_slot_key?: string | null
          name?: string
          price_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      operating_hours: {
        Row: {
          close_time: string | null
          closed: boolean
          day_of_week: number
          id: string
          label: string | null
          open_time: string | null
          updated_at: string
        }
        Insert: {
          close_time?: string | null
          closed?: boolean
          day_of_week: number
          id?: string
          label?: string | null
          open_time?: string | null
          updated_at?: string
        }
        Update: {
          close_time?: string | null
          closed?: boolean
          day_of_week?: number
          id?: string
          label?: string | null
          open_time?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promotion: {
        Row: {
          active: boolean
          badge_text: string
          cta_button_text: string
          description: string
          eligibility_text: string
          headline: string
          id: string
          title: string
          updated_at: string
          whatsapp_message_template: string
        }
        Insert: {
          active?: boolean
          badge_text?: string
          cta_button_text?: string
          description?: string
          eligibility_text?: string
          headline?: string
          id?: string
          title?: string
          updated_at?: string
          whatsapp_message_template?: string
        }
        Update: {
          active?: boolean
          badge_text?: string
          cta_button_text?: string
          description?: string
          eligibility_text?: string
          headline?: string
          id?: string
          title?: string
          updated_at?: string
          whatsapp_message_template?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          address_city: string
          address_neighborhood: string
          address_postal_code: string
          address_state: string
          address_street: string
          business_name: string
          ga4_measurement_id: string | null
          google_ads_conversion_id: string | null
          google_ads_conversion_label: string | null
          google_maps_embed_url: string
          google_maps_url: string
          gtm_id: string | null
          id: string
          instagram_url: string | null
          meta_pixel_id: string | null
          reference_distance: string
          reference_landmark: string
          updated_at: string
          whatsapp_default_message: string
          whatsapp_number: string
        }
        Insert: {
          address_city?: string
          address_neighborhood?: string
          address_postal_code?: string
          address_state?: string
          address_street?: string
          business_name?: string
          ga4_measurement_id?: string | null
          google_ads_conversion_id?: string | null
          google_ads_conversion_label?: string | null
          google_maps_embed_url?: string
          google_maps_url?: string
          gtm_id?: string | null
          id?: string
          instagram_url?: string | null
          meta_pixel_id?: string | null
          reference_distance?: string
          reference_landmark?: string
          updated_at?: string
          whatsapp_default_message?: string
          whatsapp_number?: string
        }
        Update: {
          address_city?: string
          address_neighborhood?: string
          address_postal_code?: string
          address_state?: string
          address_street?: string
          business_name?: string
          ga4_measurement_id?: string | null
          google_ads_conversion_id?: string | null
          google_ads_conversion_label?: string | null
          google_maps_embed_url?: string
          google_maps_url?: string
          gtm_id?: string | null
          id?: string
          instagram_url?: string | null
          meta_pixel_id?: string | null
          reference_distance?: string
          reference_landmark?: string
          updated_at?: string
          whatsapp_default_message?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      site_images: {
        Row: {
          alt_text: string | null
          id: string
          slot_key: string
          storage_path: string | null
          updated_at: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          id?: string
          slot_key: string
          storage_path?: string | null
          updated_at?: string
          url?: string
        }
        Update: {
          alt_text?: string | null
          id?: string
          slot_key?: string
          storage_path?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          active: boolean
          author_context: string | null
          author_name: string
          content: string
          created_at: string
          display_order: number
          id: string
          rating: number | null
          source: string | null
        }
        Insert: {
          active?: boolean
          author_context?: string | null
          author_name: string
          content: string
          created_at?: string
          display_order?: number
          id?: string
          rating?: number | null
          source?: string | null
        }
        Update: {
          active?: boolean
          author_context?: string | null
          author_name?: string
          content?: string
          created_at?: string
          display_order?: number
          id?: string
          rating?: number | null
          source?: string | null
        }
        Relationships: []
      }
      urgent_banner: {
        Row: {
          active: boolean
          id: string
          link_url: string | null
          text: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          id?: string
          link_url?: string | null
          text?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          id?: string
          link_url?: string | null
          text?: string
          updated_at?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
