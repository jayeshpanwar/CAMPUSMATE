import { generateBookingId, getPaymentStatus } from '../utils/helpers'

const today = new Date()
const formatDateStr = (date) => date.toISOString().split('T')[0]

const createBooking = (data) => ({
  id: generateBookingId(),
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  paymentStatus: getPaymentStatus(data.advanceAmount, data.totalAmount),
  ...data
})

export const INITIAL_BOOKINGS = [
  createBooking({
    customerName: 'Rahul Sharma',
    phoneNumber: '9876543210',
    date: formatDateStr(today),
    timeSlot: 'evening',
    numberOfPersons: 4,
    hasDecor: true,
    decorTheme: 'Birthday - Balloon Arch',
    addons: ['Cake', 'Fog Machine'],
    totalAmount: 8500,
    advanceAmount: 5000,
    notes: 'Surprise party for wife'
  }),
  createBooking({
    customerName: 'Priya Patel',
    phoneNumber: '9123456789',
    date: formatDateStr(today),
    timeSlot: 'night',
    numberOfPersons: 2,
    hasDecor: true,
    decorTheme: 'Anniversary - Rose Petals',
    addons: ['Photography', 'Candle Light Setup'],
    totalAmount: 12000,
    advanceAmount: 12000,
    notes: '5th Anniversary celebration'
  }),
  createBooking({
    customerName: 'Amit Kumar',
    phoneNumber: '9988776655',
    date: formatDateStr(new Date(today.getTime() + 24 * 60 * 60 * 1000)),
    timeSlot: 'afternoon',
    numberOfPersons: 6,
    hasDecor: false,
    decorTheme: '',
    addons: ['Snacks Package'],
    totalAmount: 5000,
    advanceAmount: 2000,
    notes: 'Movie screening for friends'
  }),
  createBooking({
    customerName: 'Sneha Reddy',
    phoneNumber: '9567891234',
    date: formatDateStr(new Date(today.getTime() + 24 * 60 * 60 * 1000)),
    timeSlot: 'morning',
    numberOfPersons: 3,
    hasDecor: true,
    decorTheme: 'Kids Birthday - Cartoon Theme',
    addons: ['Cake', 'Balloons', 'Return Gifts'],
    totalAmount: 9500,
    advanceAmount: 0,
    notes: 'Sons 5th birthday'
  }),
  createBooking({
    customerName: 'Vikram Singh',
    phoneNumber: '9876512340',
    date: formatDateStr(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
    timeSlot: 'evening',
    numberOfPersons: 8,
    hasDecor: true,
    decorTheme: 'Proposal Setup',
    addons: ['Photographer', 'Fog Machine', 'Flower Bouquet', 'Guitarist'],
    totalAmount: 25000,
    advanceAmount: 15000,
    notes: 'Surprise proposal - Need privacy'
  }),
  createBooking({
    customerName: 'Deepa Nair',
    phoneNumber: '9012345678',
    date: formatDateStr(new Date(today.getTime() - 24 * 60 * 60 * 1000)),
    timeSlot: 'night',
    numberOfPersons: 2,
    hasDecor: true,
    decorTheme: 'Romantic Date Night',
    addons: ['Dinner', 'Candle Light'],
    totalAmount: 7500,
    advanceAmount: 7500,
    notes: ''
  }),
  createBooking({
    customerName: 'Arjun Mehta',
    phoneNumber: '9234567890',
    date: formatDateStr(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
    timeSlot: 'late-night',
    numberOfPersons: 5,
    hasDecor: false,
    decorTheme: '',
    addons: ['Premium Sound System'],
    totalAmount: 6000,
    advanceAmount: 3000,
    notes: 'Gaming session with friends'
  }),
  createBooking({
    customerName: 'Kavya Iyer',
    phoneNumber: '9345678901',
    date: formatDateStr(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
    timeSlot: 'afternoon',
    numberOfPersons: 10,
    hasDecor: true,
    decorTheme: 'Baby Shower - Pink Theme',
    addons: ['Cake', 'Photography', 'Games Kit', 'Snacks'],
    totalAmount: 18000,
    advanceAmount: 10000,
    notes: 'Baby shower for sister'
  })
]

export const TIME_SLOTS = [
  { value: 'morning', label: '9:00 AM - 12:00 PM', shortLabel: 'Morning' },
  { value: 'afternoon', label: '12:00 PM - 3:00 PM', shortLabel: 'Afternoon' },
  { value: 'evening', label: '3:00 PM - 6:00 PM', shortLabel: 'Evening' },
  { value: 'night', label: '6:00 PM - 9:00 PM', shortLabel: 'Night' },
  { value: 'late-night', label: '9:00 PM - 12:00 AM', shortLabel: 'Late Night' }
]

export const DECOR_THEMES = [
  'Birthday - Balloon Arch',
  'Birthday - Neon Theme',
  'Kids Birthday - Cartoon Theme',
  'Kids Birthday - Princess Theme',
  'Kids Birthday - Superhero Theme',
  'Anniversary - Rose Petals',
  'Anniversary - Gold & White',
  'Romantic Date Night',
  'Proposal Setup',
  'Baby Shower - Pink Theme',
  'Baby Shower - Blue Theme',
  'Graduation Party',
  'Farewell Party',
  'Corporate Event',
  'Custom Theme'
]

export const ADDON_OPTIONS = [
  'Cake',
  'Photography',
  'Videography',
  'Fog Machine',
  'Candle Light Setup',
  'Flower Bouquet',
  'Guitarist',
  'DJ Setup',
  'Premium Sound System',
  'Projector Upgrade',
  'Snacks Package',
  'Dinner',
  'Balloons',
  'Return Gifts',
  'Games Kit',
  'Confetti Cannon'
]
