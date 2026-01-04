
import { SystemTemplate } from './types';

export const SYSTEM_TEMPLATES: SystemTemplate[] = [
  {
    id: 'uber',
    name: 'Uber / Ride Sharing',
    icon: '🚗',
    prompt: 'Design a ride-sharing service like Uber. Focus on real-time location tracking, matching algorithms (QuadTrees/H3), and surge pricing.'
  },
  {
    id: 'zomato',
    name: 'Zomato / Food Delivery',
    icon: '🛵',
    prompt: 'Design a food delivery system like Zomato/Swiggy. Focus on the 3-sided marketplace (Customer, Restaurant, Rider), real-time order status, and routing.'
  },
  {
    id: 'ticketmaster',
    name: 'Ticketmaster / Booking',
    icon: '🎟️',
    prompt: 'Design a high-scale ticket booking system. Focus on handling flash sales, concurrency (distributed locking), and ACID transactions for seat selection.'
  },
  {
    id: 'paytm',
    name: 'Paytm / Payment Gateway',
    icon: '💳',
    prompt: 'Design a payment gateway like Paytm. Focus on idempotent APIs, double-entry bookkeeping, and distributed transactions (Saga pattern).'
  },
  {
    id: 'parking-lot',
    name: 'Parking Lot (Machine Coding)',
    icon: '🅿️',
    prompt: 'Machine Coding: Design a Parking Lot system. Handle multiple floors, vehicle types, and automated ticketing.'
  },
  {
    id: 'splitwise',
    name: 'Splitwise (Machine Coding)',
    icon: '⚖️',
    prompt: 'Machine Coding: Design Splitwise. Focus on expense sharing, debt simplification (min cash flow), and group balances.'
  },
  {
    id: 'snake-ladder',
    name: 'Snake & Ladder (Coding)',
    icon: '🐍',
    prompt: 'Machine Coding: Design Snake and Ladder game. Focus on modularity, extensible board elements, and concurrency for multiple games.'
  },
  {
    id: 'instagram',
    name: 'Instagram / Photo Sharing',
    icon: '📸',
    prompt: 'Design a social media platform like Instagram. Focus on feed generation (Pull vs Push), high availability, and blob storage management.'
  },
  {
    id: 'spotify',
    name: 'Spotify / Audio Streaming',
    icon: '🎵',
    prompt: 'Design a music streaming service like Spotify. Focus on CDNs, wide-column stores for play-history, and recommendation pipelines.'
  }
];
