-- Polar (merchant of record) takes USD card payments for the yearly membership.
ALTER TYPE "SubscriptionProvider" ADD VALUE IF NOT EXISTS 'POLAR';
