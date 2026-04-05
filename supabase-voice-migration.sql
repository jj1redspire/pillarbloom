-- Add voice_profile column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS voice_profile JSONB DEFAULT NULL;
