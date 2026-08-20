export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          username: string | null
          house_id: string | null
          role: "student" | "teacher" | "admin"
          level: number
          xp: number
          coins: number
          trash_coins: number
          reading_points: number
          conduct_points: number
          streak_days: number
          streak_last_at: string | null
          avatar_config: Record<string, unknown>
          class_name: string | null
          year_group: number | null
          is_prefect: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          status: "open" | "closed" | "results"
          created_by: string | null
          closes_at: string | null
          show_results_early: boolean
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["polls"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["polls"]["Insert"]>
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          label: string
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["poll_options"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["poll_options"]["Insert"]>
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["votes"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["votes"]["Insert"]>
      }
      proposals: {
        Row: {
          id: string
          title: string
          description: string
          status: "pending" | "under_review" | "accepted" | "rejected" | "implemented"
          created_by: string
          reviewed_by: string | null
          review_note: string | null
          upvotes: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["proposals"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["proposals"]["Insert"]>
      }
      proposal_votes: {
        Row: {
          id: string
          proposal_id: string
          user_id: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["proposal_votes"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["proposal_votes"]["Insert"]>
      }
      point_transactions: {
        Row: {
          id: string
          user_id: string
          type: "trash" | "reading" | "conduct" | "coin_bonus" | "coin_spend" | "xp_bonus"
          amount: number
          source: string
          description: string | null
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["point_transactions"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["point_transactions"]["Insert"]>
      }
      badges: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          category: "eco" | "reading" | "conduct" | "event" | "streak" | "special"
          criteria: Record<string, unknown> | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["badges"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["user_badges"]["Row"], "id" | "earned_at">
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time_start: string | null
          time_end: string | null
          location: string | null
          capacity: number | null
          organizer: string | null
          image_url: string | null
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["event_registrations"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["event_registrations"]["Insert"]>
      }
      news_articles: {
        Row: {
          id: string
          title: string
          body: string
          category: "culture" | "ecology" | "house_cup" | "general" | "event" | "academic"
          image_url: string | null
          author_id: string | null
          published: boolean
          published_at: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["news_articles"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["news_articles"]["Insert"]>
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          pages: number | null
          cover_url: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["books"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["books"]["Insert"]>
      }
      reading_logs: {
        Row: {
          id: string
          user_id: string
          book_id: string
          pages_read: number
          minutes: number
          date: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["reading_logs"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["reading_logs"]["Insert"]>
      }
      cafeteria_transactions: {
        Row: {
          id: string
          student_id: string
          type: "purchase" | "credit"
          amount: number
          description: string | null
          processed_by: string | null
          balance_after: number | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["cafeteria_transactions"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["cafeteria_transactions"]["Insert"]>
      }
      avatar_items: {
        Row: {
          id: string
          name: string
          slug: string
          category: "skin" | "hair" | "eyes" | "outfit" | "accessory" | "background" | "frame"
          rarity: "common" | "rare" | "epic" | "legendary"
          cost_coins: number
          unlock_criteria: Record<string, unknown> | null
          config: Record<string, unknown>
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["avatar_items"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["avatar_items"]["Insert"]>
      }
      user_avatar_items: {
        Row: {
          id: string
          user_id: string
          item_id: string
          equipped: boolean
          acquired_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["user_avatar_items"]["Row"], "id" | "acquired_at">
        Update: Partial<Database["public"]["Tables"]["user_avatar_items"]["Insert"]>
      }
      smartbin_deposits: {
        Row: {
          id: string
          user_id: string
          nfc_tag: string | null
          weight_grams: number | null
          trash_coins_earned: number
          house_points_earned: number
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["smartbin_deposits"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["smartbin_deposits"]["Insert"]>
      }
    }
    Views: {
      house_rankings: {
        Row: {
          house_id: string
          name: string
          slug: string
          motto: string | null
          color: string
          color_ink: string
          color_soft: string
          color_fg: string
          member_count: number
          total_trash_coins: number
          total_reading_points: number
          total_conduct_points: number
          total_points: number
        }
      }
      individual_trash_ranking: {
        Row: {
          user_id: string
          first_name: string
          last_name: string
          username: string | null
          house_name: string
          house_slug: string
          trash_coins: number
          rank: number
        }
      }
      individual_reading_ranking: {
        Row: {
          user_id: string
          first_name: string
          last_name: string
          username: string | null
          house_name: string
          house_slug: string
          reading_points: number
          rank: number
        }
      }
      individual_conduct_ranking: {
        Row: {
          user_id: string
          first_name: string
          last_name: string
          username: string | null
          house_name: string
          house_slug: string
          conduct_points: number
          rank: number
        }
      }
      individual_overall_ranking: {
        Row: {
          user_id: string
          first_name: string
          last_name: string
          username: string | null
          house_name: string
          house_slug: string
          total_points: number
          xp: number
          level: number
          rank: number
        }
      }
    }
  }
}