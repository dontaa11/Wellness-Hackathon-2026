'use server';

import { createClient } from '@/lib/supabase/server';

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  error?: string;
}

export async function createBooking(
  userId: string,
  serviceName: string,
  location: string
): Promise<BookingResult> {
  try {
    // Validate inputs
    if (!userId || !serviceName || !location) {
      return {
        success: false,
        error: 'Missing required booking information',
      };
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Check user authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id !== userId) {
      return {
        success: false,
        error: 'Unauthorized: User ID does not match',
      };
    }

    // Insert booking into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: userId,
          service_name: serviceName,
          resort_location: location,
          status: 'pending',
          booked_at: new Date().toISOString(),
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        error: `Failed to create booking: ${error.message}`,
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'Booking created but no ID returned',
      };
    }

    return {
      success: true,
      bookingId: data.id,
    };
  } catch (error) {
    console.error('Booking error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
