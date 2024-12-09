// Main categories for 5000 daily life scenarios
export const scenarioCategories = {
  shopping: {
    retail: {
      clothing: ['Department Store', 'Boutique', 'Shoe Store', 'Sports Shop', 'Accessories Store'],
      electronics: ['Phone Store', 'Computer Shop', 'Home Electronics', 'Camera Store'],
      groceries: ['Supermarket', 'Local Market', 'Convenience Store', 'Organic Shop'],
      specialty: ['Bookstore', 'Gift Shop', 'Toy Store', 'Home Goods']
    },
    services: {
      financial: ['Bank', 'ATM', 'Currency Exchange', 'Insurance Office'],
      personal: ['Hair Salon', 'Spa', 'Dry Cleaner', 'Tailor'],
      professional: ['Print Shop', 'Phone Repair', 'Computer Service', 'Photo Studio']
    }
  },
  dining: {
    restaurants: {
      casual: ['Café', 'Diner', 'Fast Food', 'Food Court'],
      formal: ['Fine Dining', 'Business Lunch', 'Special Occasion', 'Reservation'],
      specialty: ['Vegetarian', 'International Cuisine', 'Buffet', 'Food Truck']
    },
    ordering: {
      inPerson: ['Counter Service', 'Table Service', 'Self-Service', 'Takeout'],
      delivery: ['Phone Order', 'Online Order', 'Food App', 'Catering']
    }
  },
  transportation: {
    public: {
      bus: ['Bus Stop', 'Bus Station', 'Express Bus', 'Night Bus'],
      train: ['Train Station', 'Subway', 'Light Rail', 'Platform'],
      taxi: ['Taxi Stand', 'Ride Share', 'Airport Taxi', 'Hotel Taxi']
    },
    private: {
      car: ['Car Rental', 'Parking', 'Gas Station', 'Car Wash'],
      bicycle: ['Bike Rental', 'Bike Shop', 'Bike Repair', 'Bike Share']
    }
  },
  accommodation: {
    hotels: {
      checkin: ['Reservation', 'Front Desk', 'Room Service', 'Concierge'],
      facilities: ['Gym', 'Pool', 'Restaurant', 'Business Center'],
      services: ['Housekeeping', 'Laundry', 'Wake-up Call', 'Maintenance']
    },
    rental: {
      apartment: ['Viewing', 'Lease Signing', 'Maintenance Request', 'Moving'],
      shortTerm: ['Vacation Rental', 'Shared Space', 'Extended Stay', 'Sublet']
    }
  },
  work: {
    office: {
      meetings: ['Team Meeting', 'Client Meeting', 'Presentation', 'Conference Call'],
      interactions: ['Colleague Chat', 'Boss Discussion', 'Team Collaboration', 'New Employee'],
      tasks: ['Project Discussion', 'Deadline Talk', 'Problem Solving', 'Planning']
    },
    jobSearch: {
      interview: ['Phone Interview', 'In-Person Interview', 'Follow-up', 'Negotiation'],
      application: ['Job Application', 'Resume Review', 'Cover Letter', 'References']
    }
  },
  social: {
    casual: {
      friends: ['Coffee Meet', 'Dinner Party', 'Movie Night', 'Game Night'],
      activities: ['Park Visit', 'Shopping Trip', 'Sports Event', 'Concert']
    },
    formal: {
      events: ['Wedding', 'Birthday Party', 'Graduation', 'Anniversary'],
      networking: ['Business Event', 'Conference', 'Workshop', 'Seminar']
    }
  },
  health: {
    medical: {
      routine: ['Doctor Visit', 'Dental Appointment', 'Eye Exam', 'Check-up'],
      emergency: ['Hospital Visit', 'Urgent Care', 'Pharmacy', 'First Aid']
    },
    wellness: {
      fitness: ['Gym', 'Yoga Class', 'Personal Training', 'Sports Club'],
      consultation: ['Nutritionist', 'Physical Therapy', 'Mental Health', 'Alternative Medicine']
    }
  },
  education: {
    academic: {
      classroom: ['Class Discussion', 'Group Project', 'Presentation', 'Exam'],
      administrative: ['Registration', 'Counseling', 'Financial Aid', 'Library']
    },
    training: {
      professional: ['Workshop', 'Certification', 'Skills Training', 'Conference'],
      personal: ['Language Class', 'Art Class', 'Music Lesson', 'Cooking Class']
    }
  },
  services: {
    government: {
      documents: ['Passport', 'License', 'Permit', 'Registration'],
      services: ['Post Office', 'Tax Office', 'Social Services', 'City Hall']
    },
    utilities: {
      setup: ['Internet Service', 'Phone Plan', 'Electricity Setup', 'Water Service'],
      support: ['Customer Service', 'Technical Support', 'Billing Question', 'Service Request']
    }
  },
  entertainment: {
    venues: {
      cultural: ['Museum', 'Theater', 'Art Gallery', 'Concert Hall'],
      recreational: ['Movie Theater', 'Sports Arena', 'Amusement Park', 'Zoo']
    },
    activities: {
      outdoor: ['Park', 'Beach', 'Hiking', 'Picnic'],
      indoor: ['Gaming Center', 'Bowling Alley', 'Indoor Sports', 'Arcade']
    }
  }
};

// Calculate total possible scenarios
export const calculateTotalScenarios = () => {
  let total = 0;
  const countScenarios = (obj) => {
    if (Array.isArray(obj)) {
      return obj.length;
    }
    if (typeof obj === 'object') {
      return Object.values(obj).reduce((sum, value) => {
        return sum + countScenarios(value);
      }, 0);
    }
    return 1;
  };
  total = countScenarios(scenarioCategories);
  return total;
};

// Get all possible combinations for a category
export const getCategoryCombinations = (category) => {
  const combinations = [];
  const traverse = (obj, path = []) => {
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        combinations.push([...path, item]);
      });
    } else if (typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        traverse(value, [...path, key]);
      });
    }
  };
  traverse(scenarioCategories[category]);
  return combinations;
};

// Generate difficulty levels based on scenario complexity
export const getDifficultyLevel = (scenario) => {
  const difficultyFactors = {
    vocabulary: 1,
    grammar: 1,
    cultural: 1,
    interaction: 1
  };

  // Calculate based on scenario attributes
  let totalDifficulty = 0;
  // Add implementation for difficulty calculation

  return totalDifficulty <= 2 ? 'beginner' :
         totalDifficulty <= 4 ? 'intermediate' : 'advanced';
};

// Helper function to get random scenario from category
export const getRandomScenarioFromCategory = (category, subCategory = null) => {
  const categoryData = subCategory ? 
    scenarioCategories[category][subCategory] :
    scenarioCategories[category];

  const combinations = getCategoryCombinations(category);
  const randomIndex = Math.floor(Math.random() * combinations.length);
  return combinations[randomIndex];
};

// Export category names for easy access
export const mainCategories = Object.keys(scenarioCategories);
export const getSubCategories = (category) => Object.keys(scenarioCategories[category]); 