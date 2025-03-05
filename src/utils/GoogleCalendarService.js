// Google Calendar API integration service for LexiMentis

// Your Google Calendar API credentials
// NOTE: These should be stored in environment variables in production
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const CALENDAR_ID = 'lj.cox@leximentis.com'; // Your primary calendar ID

// Scopes for Google Calendar API
const SCOPES = 'https://www.googleapis.com/auth/calendar';

export class GoogleCalendarService {
  constructor() {
    this.gapi = window.gapi;
    this.isInitialized = false;
    this.isAuthenticated = false;
  }

  // Initialize the Google API client
  async initialize() {
    if (this.isInitialized) return;
    
    return new Promise((resolve, reject) => {
      this.gapi.load('client:auth2', async () => {
        try {
          await this.gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: SCOPES
          });
          
          this.isInitialized = true;
          this.isAuthenticated = this.gapi.auth2.getAuthInstance().isSignedIn.get();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Sign in the user
  async signIn() {
    if (!this.isInitialized) await this.initialize();
    if (this.isAuthenticated) return;
    
    try {
      await this.gapi.auth2.getAuthInstance().signIn();
      this.isAuthenticated = true;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Check available time slots for a specific date
  async getAvailableSlots(date) {
    if (!this.isInitialized) await this.initialize();
    if (!this.isAuthenticated) await this.signIn();
    
    try {
      // Get busy times for the specified date
      const timeMin = new Date(date);
      timeMin.setHours(0, 0, 0, 0);
      
      const timeMax = new Date(date);
      timeMax.setHours(23, 59, 59, 999);
      
      const response = await this.gapi.client.calendar.freebusy.query({
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: CALENDAR_ID }]
      });
      
      const busyTimes = response.result.calendars[CALENDAR_ID].busy;
      
      // Define standard business hours time slots (9 AM to 5 PM)
      const timeSlots = [
        { id: 1, time: '9:00 AM', available: true },
        { id: 2, time: '10:00 AM', available: true },
        { id: 3, time: '11:00 AM', available: true },
        { id: 4, time: '1:00 PM', available: true },
        { id: 5, time: '2:00 PM', available: true },
        { id: 6, time: '3:00 PM', available: true },
        { id: 7, time: '4:00 PM', available: true }
      ];
      
      // Mark slots as unavailable if they overlap with busy times
      busyTimes.forEach(busy => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        
        timeSlots.forEach(slot => {
          const [hour, minute] = slot.time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
          let slotHour = parseInt(hour, 10);
          if (slot.time.includes('PM') && slotHour !== 12) slotHour += 12;
          if (slot.time.includes('AM') && slotHour === 12) slotHour = 0;
          
          const slotStart = new Date(date);
          slotStart.setHours(slotHour, parseInt(minute, 10), 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotStart.getMinutes() + 60); // 1 hour slots
          
          if (
            (slotStart >= busyStart && slotStart < busyEnd) ||
            (slotEnd > busyStart && slotEnd <= busyEnd) ||
            (slotStart <= busyStart && slotEnd >= busyEnd)
          ) {
            slot.available = false;
          }
        });
      });
      
      return timeSlots;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }

  // Create a calendar event for the booking
  async createBooking(date, timeSlot, contactInfo) {
    if (!this.isInitialized) await this.initialize();
    if (!this.isAuthenticated) await this.signIn();
    
    try {
      // Parse the time from the time slot
      const [hour, minute] = timeSlot.time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
      let bookingHour = parseInt(hour, 10);
      if (timeSlot.time.includes('PM') && bookingHour !== 12) bookingHour += 12;
      if (timeSlot.time.includes('AM') && bookingHour === 12) bookingHour = 0;
      
      // Set up start and end times
      const startTime = new Date(date);
      startTime.setHours(bookingHour, parseInt(minute, 10), 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + 30); // 30 minute meeting
      
      // Create the event
      const event = {
        summary: 'LexiMentis Demo Call with ' + contactInfo.name,
        description: `
Demo call with ${contactInfo.name} from ${contactInfo.company || 'N/A'}
          
Contact: ${contactInfo.email}
Message: ${contactInfo.message || 'N/A'}
        `,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'America/Chicago' // Central Time
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'America/Chicago'
        },
        attendees: [
          { email: contactInfo.email, displayName: contactInfo.name },
          { email: CALENDAR_ID }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 30 } // 30 minutes before
          ]
        },
        sendUpdates: 'all'
      };
      
      await this.gapi.client.calendar.events.insert({
        calendarId: CALENDAR_ID,
        resource: event
      });
      
      return true;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
}

export const calendarService = new GoogleCalendarService();

export default calendarService;
