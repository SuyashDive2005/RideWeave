export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enum types matching your SQL schema
export type RideRequestStatus =
  | "CREATED"
  | "WAITING"
  | "MATCHED"
  | "EXPIRED"
  | "CANCELLED";
export type SharedRideStatus = "ASSIGNED" | "ONGOING" | "COMPLETED" | "FAILED";
export type ParticipantRole = "PASSENGER" | "PROVIDER";
export type WalletTransactionType = "CREDIT" | "DEBIT";
export type WalletTransactionReason =
  | "RIDE_PAYMENT"
  | "RIDE_EARNING"
  | "WALLET_TOPUP"
  | "REFUND"
  | "CANCELLATION_PENALTY";
export type PaymentStatus = "INITIATED" | "SUCCESS" | "FAILED" | "REFUNDED";
export type PaymentMethod = "WALLET" | "UPI" | "CARD" | "NET_BANKING";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          service_active: boolean;
          last_lat: number | null;
          last_lng: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          service_active?: boolean;
          last_lat?: number | null;
          last_lng?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          service_active?: boolean;
          last_lat?: number | null;
          last_lng?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          vehicle_type: string;
          vehicle_name: string;
          vehicle_number: string;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_type: string;
          vehicle_name: string;
          vehicle_number: string;
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vehicle_type?: string;
          vehicle_name?: string;
          vehicle_number?: string;
          is_verified?: boolean;
          created_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      shared_rides: {
        Row: {
          id: string;
          provider_id: string;
          status: SharedRideStatus;
          total_distance: number | null;
          total_fare: number | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          status?: SharedRideStatus;
          total_distance?: number | null;
          total_fare?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          status?: SharedRideStatus;
          total_distance?: number | null;
          total_fare?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      ride_requests: {
        Row: {
          id: string;
          user_id: string;
          pickup_lat: number;
          pickup_lng: number;
          destination_lat: number;
          destination_lng: number;
          status: RideRequestStatus;
          pre_consent: boolean;
          shared_ride_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pickup_lat: number;
          pickup_lng: number;
          destination_lat: number;
          destination_lng: number;
          status?: RideRequestStatus;
          pre_consent?: boolean;
          shared_ride_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pickup_lat?: number;
          pickup_lng?: number;
          destination_lat?: number;
          destination_lng?: number;
          status?: RideRequestStatus;
          pre_consent?: boolean;
          shared_ride_id?: string | null;
          created_at?: string;
        };
      };
      ride_participants: {
        Row: {
          id: string;
          shared_ride_id: string;
          user_id: string;
          role: ParticipantRole;
          individual_distance: number | null;
          fare_share: number | null;
          earning: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          shared_ride_id: string;
          user_id: string;
          role: ParticipantRole;
          individual_distance?: number | null;
          fare_share?: number | null;
          earning?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          shared_ride_id?: string;
          user_id?: string;
          role?: ParticipantRole;
          individual_distance?: number | null;
          fare_share?: number | null;
          earning?: number | null;
          created_at?: string;
        };
      };
      wallet_transactions: {
        Row: {
          id: string;
          wallet_id: string;
          user_id: string;
          shared_ride_id: string | null;
          amount: number;
          transaction_type: WalletTransactionType;
          reason: WalletTransactionReason;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet_id: string;
          user_id: string;
          shared_ride_id?: string | null;
          amount: number;
          transaction_type: WalletTransactionType;
          reason: WalletTransactionReason;
          created_at?: string;
        };
        Update: {
          id?: string;
          wallet_id?: string;
          user_id?: string;
          shared_ride_id?: string | null;
          amount?: number;
          transaction_type?: WalletTransactionType;
          reason?: WalletTransactionReason;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          shared_ride_id: string;
          amount: number;
          payment_method: PaymentMethod;
          status: PaymentStatus;
          transaction_reference: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shared_ride_id: string;
          amount: number;
          payment_method: PaymentMethod;
          status?: PaymentStatus;
          transaction_reference?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shared_ride_id?: string;
          amount?: number;
          payment_method?: PaymentMethod;
          status?: PaymentStatus;
          transaction_reference?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      ride_request_status: RideRequestStatus;
      shared_ride_status: SharedRideStatus;
      participant_role: ParticipantRole;
      wallet_transaction_type: WalletTransactionType;
      wallet_transaction_reason: WalletTransactionReason;
      payment_status: PaymentStatus;
      payment_method: PaymentMethod;
    };
  };
}

// Helper types for easier usage
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type Wallet = Database["public"]["Tables"]["wallets"]["Row"];
export type SharedRide = Database["public"]["Tables"]["shared_rides"]["Row"];
export type RideRequest = Database["public"]["Tables"]["ride_requests"]["Row"];
export type RideParticipant =
  Database["public"]["Tables"]["ride_participants"]["Row"];
export type WalletTransaction =
  Database["public"]["Tables"]["wallet_transactions"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
