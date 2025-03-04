import React, { useState, useMemo } from 'react';
import { Calendar, Clock, ArrowRight, Check, CalendarDays } from 'lucide-react';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', company: '', message: '' });
  const [currentStep, setCurrentStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Generate dummy available days for the demo (weekdays only)
  const availableDays = useMemo(() => {
    const days = [];
    const tempDate = new Date(currentDate);
    tempDate.setDate(1);
    const month = tempDate.getMonth();

    while (tempDate.getMonth() === month) {
      if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) { // Skip weekends
        days.push(new Date(tempDate));
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    return days;
  }, [currentDate]);

  // Generate dummy time slots
  const timeSlots = useMemo(() => ([
    { id: 1, time: '9:00 AM', available: true },
    { id: 2, time: '10:00 AM', available: true },
    { id: 3, time: '11:00 AM', available: true },
    { id: 4, time: '1:00 PM', available: true },
    { id: 5, time: '2:00 PM', available: true },
    { id: 6, time: '3:00 PM', available: true },
    { id: 7, time: '4:00 PM', available: true }
  ]), []);

  // Helpers for date formatting
  const getDayName = (date) => new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  const formatDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date);

  // Month navigation
  const goToPrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  // Selection handlers
  const handleDateSelect = (date) => setSelectedDate(date);
  const handleTimeSelect = (timeSlot) => setSelectedTime(timeSlot);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const goToNextStep = () => {
    if (currentStep === 1 && selectedDate) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedTime) {
      setCurrentStep(3);
    } else if (currentStep === 3 && contactInfo.name && contactInfo.email) {
      setIsConfirmed(true);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render calendar grid
  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    // Get first day of month (0 = Sunday)
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDay = firstDayOfMonth.getDay();

    // Empty cells for days before the first of month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isAvailable = availableDays.some(availableDate => 
        availableDate.getDate() === date.getDate() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getFullYear() === date.getFullYear()
      );
      const isSelected = selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={`day-${date.toISOString()}`}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm cursor-pointer
            ${isAvailable ? 'hover:bg-blue-100' : 'text-gray-300 cursor-not-allowed'}
            ${isSelected ? 'bg-blue-600 text-white' : ''}
          `}
          onClick={() => isAvailable && handleDateSelect(date)}
          aria-label={isAvailable ? formatDate(date) : `${formatDate(date)} - Not available`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Book a Demo Call</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule a personalized demo to see how our AI Workers Comp Assistant can transform your practice and reduce administrative burden.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-3xl mx-auto">
          {/* Stepper */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1 font-medium">Date</span>
              </div>
              
              <div className="w-16 h-0.5 bg-gray-200"></div>
              
              <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1 font-medium">Time</span>
              </div>
              
              <div className="w-16 h-0.5 bg-gray-200"></div>
              
              <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                  <span className="text-xs font-bold">i</span>
                </div>
                <span className="text-xs mt-1 font-medium">Details</span>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-6">
            {!isConfirmed ? (
              <>
                {/* Step 1: Select Date */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Select a Date</h3>
                    
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={goToPrevMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Previous month">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <h4 className="text-lg font-medium text-gray-700">
                        {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
                      </h4>
                      
                      <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Next month">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Calendar weekdays header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1 mb-6">
                      {renderCalendarDays()}
                    </div>
                    
                    <div className="flex items-center mt-6">
                      <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                      <span className="text-sm text-gray-600">Available for booking</span>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Select Time */}
                {currentStep === 2 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Select a Time</h3>
                    <p className="text-gray-600 mb-6">{selectedDate && `${getDayName(selectedDate)}, ${formatDate(selectedDate)}`}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {timeSlots.map(slot => (
                        <div
                          key={slot.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors
                            ${selectedTime && selectedTime.id === slot.id ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'}
                          `}
                          onClick={() => handleTimeSelect(slot)}
                          aria-label={`Select ${slot.time}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{slot.time}</span>
                            {selectedTime && selectedTime.id === slot.id && (
                              <Check className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-500">All times are in Central Time (CT)</p>
                  </div>
                )}
                
                {/* Step 3: Contact Info */}
                {currentStep === 3 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h3>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                      <CalendarDays className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-800 font-medium">Your selected time</p>
                        <p className="text-blue-600">{selectedDate && `${getDayName(selectedDate)}, ${formatDate(selectedDate)} at ${selectedTime.time}`}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={contactInfo.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={contactInfo.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Organization
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={contactInfo.company}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your company (optional)"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={contactInfo.message}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Any specific questions or areas of interest? (optional)"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation buttons */}
                <div className="mt-8 flex justify-between">
                  {currentStep > 1 ? (
                    <button onClick={goToPrevStep} className="px-4 py-2 text-gray-600 hover:text-gray-800" aria-label="Go back">
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  <button
                    onClick={goToNextStep}
                    disabled={
                      (currentStep === 1 && !selectedDate) ||
                      (currentStep === 2 && !selectedTime) ||
                      (currentStep === 3 && (!contactInfo.name || !contactInfo.email))
                    }
                    className={`px-6 py-2 rounded-lg flex items-center 
                      ${((currentStep === 1 && !selectedDate) ||
                         (currentStep === 2 && !selectedTime) ||
                         (currentStep === 3 && (!contactInfo.name || !contactInfo.email)))
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }
                    `}
                    aria-label="Continue to next step"
                  >
                    {currentStep === 3 ? 'Confirm Booking' : 'Continue'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              // Confirmation screen
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6">
                  {selectedDate && `${getDayName(selectedDate)}, ${formatDate(selectedDate)} at ${selectedTime.time}`}
                </p>
                <p className="text-gray-600 mb-8">
                  A calendar invitation has been sent to <strong>{contactInfo.email}</strong>.
                  We'll also send you a reminder 24 hours before our call.
                </p>
                <div className="p-4 bg-blue-50 rounded-lg text-left mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">What to expect:</h4>
                  <p className="text-blue-700 mb-2">
                    This will be a 30-minute video call where we'll:
                  </p>
                  <ul className="list-disc pl-5 text-blue-700 space-y-1">
                    <li>Understand your specific Workers Compensation workflows</li>
                    <li>Demonstrate the AI Assistant capabilities relevant to your needs</li>
                    <li>Answer your questions about implementation and pricing</li>
                  </ul>
                </div>
                <button
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
                  onClick={() => window.location.href = '/'}
                >
                  Return to Homepage
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;