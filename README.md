# English Learning App

A comprehensive language learning platform featuring interactive scenarios, multi-language support, and AI-powered conversations.

## Features

### 🎯 Scenario-Based Learning
- 5,000+ real-world interaction scenarios
- Progressive difficulty levels (1-12)
- Cultural context and notes
- Interactive dialogues with audio
- Multi-language support (English, Thai, Vietnamese, Chinese, Japanese)

### 🎓 Educational Levels
1. **Elementary (Levels 1-4)**
   - Basic daily interactions
   - Simple vocabulary and grammar
   - Family and school scenarios
   - Guided learning path

2. **Middle School (Levels 5-8)**
   - Intermediate communication
   - Complex sentence structures
   - Social and community scenarios
   - Independent practice

3. **High School (Levels 9-12)**
   - Advanced conversations
   - Professional contexts
   - Academic discussions
   - Critical thinking exercises

4. **College/Professional**
   - Business negotiations
   - Technical discussions
   - Industry-specific vocabulary
   - Cultural nuances

### 💎 Membership Tiers

#### 1. Basic ($9.99/month)
- 50 scenarios per month
- 10 AI conversations per day
- 20 pronunciation checks
- Access to levels 1-4
- Basic progress tracking

#### 2. Standard ($19.99/month)
- 200 scenarios per month
- 30 AI conversations per day
- 100 pronunciation checks
- Access to levels 1-8
- Downloadable content
- Cultural insights

#### 3. Premium ($39.99/month)
- 1000 scenarios per month
- 100 AI conversations per day
- 500 pronunciation checks
- Access to levels 1-12
- Personalized feedback
- Full community access

#### 4. Unlimited ($69.99/month)
- Unlimited scenarios
- Unlimited AI conversations
- Unlimited pronunciation checks
- Access to all levels
- Priority support
- Advanced analytics

### 🚀 Key Technologies

- **Frontend**: React, Material-UI
- **Backend**: Firebase, Supabase
- **AI Integration**: OpenAI GPT
- **Speech Recognition**: Web Speech API
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Analytics**: Firebase Analytics
- **Payments**: Stripe

### 🎨 Features

#### Learning Tools
- Interactive scenario player
- Vocabulary flashcards
- Grammar exercises
- Pronunciation practice
- Cultural context lessons

#### AI Features
- Conversational practice
- Pronunciation assessment
- Grammar correction
- Vocabulary suggestions
- Learning path optimization

#### Progress Tracking
- Detailed analytics
- Learning statistics
- Achievement system
- Progress visualization
- Performance insights

## Getting Started

### Prerequisites
```bash
node >= 14.0.0
npm >= 6.14.0
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/english-learning-app.git
cd english-learning-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Add your API keys and configuration
```

4. Start the development server
```bash
npm start
```

### Environment Variables
Create a `.env` file with the following:
```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ScenarioPlayer/   # Scenario interaction
│   ├── BilingualConversation/  # Language practice
│   └── Progress/         # Progress tracking
├── services/           # Backend services
│   ├── ai/              # AI integration
│   ├── auth/            # Authentication
│   ├── database/        # Database operations
│   └── payment/         # Payment processing
├── pages/             # Main application pages
├── utils/             # Utility functions
└── assets/           # Static resources
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT integration
- Firebase for backend services
- Material-UI for components
- React community for resources

## Support

For support, email support@englishlearningapp.com or join our Slack channel.

## Monthly Learning Contest Rules

### Contest Overview
Our monthly learning contest rewards the most dedicated learners across all aspects of language learning, including vocabulary, grammar, reading, writing, listening, speaking, and cultural understanding.

### League Structure
Players compete within their skill level groups:

1. **Beginner League (Levels 1-4)**
   - For new learners and those building fundamental skills
   - Separate leaderboard from higher levels
   - Tailored scoring for basic language concepts

2. **Intermediate League (Levels 5-8)**
   - For learners with established basics
   - Focus on more complex language features
   - Progressive difficulty scaling

3. **Advanced League (Levels 9-12)**
   - For experienced language learners
   - Emphasis on mastery and nuanced understanding
   - Highest difficulty multipliers

### Monthly Prizes
In each league, the top performers will receive subscription rewards:

- 🏆 **1st Place**: One month of unlimited access
- 🥈 **2nd Place**: One week of unlimited access
- 🥉 **3rd Place**: One week of unlimited access
- 🌟 **4th Place**: One week of unlimited access
- ⭐ **5th Place**: One week of unlimited access

**Important Prize Details:**
- All subscription rewards begin with the next billing cycle
- Rewards are automatically applied to winning accounts
- Winners will be notified via email and in-app notifications

### Contest Timeline
- Contest runs monthly
- Ends on the last day of each month at 11:59 PM Pacific Time
- New contest begins immediately after
- Winners announced within 24 hours of contest end

### Scoring System
Points are earned across multiple learning categories:

#### Core Language Skills
- **Vocabulary & Reading**
  - New word mastery: 5 points
  - Long-term retention: 10 points
  - Context usage: 15 points
  - Reading comprehension: 30 points

- **Grammar & Writing**
  - Exercise completion: 10 points
  - Complex structures: 25 points
  - Essay submissions: 30 points

- **Speaking & Listening**
  - Pronunciation accuracy: 5-20 points
  - Listening comprehension: 20 points
  - Conversation practice: 25 points

#### Bonus Points
- **Daily Streaks**
  - 7 days: 1.2x multiplier
  - 30 days: 1.5x multiplier
  - 90 days: 2.0x multiplier

- **Challenges**
  - Daily challenges: 50 points
  - Weekly challenges: 200 points
  - Special events: 300 points

### Fair Play Rules
1. Multiple accounts are not permitted
2. Points must be earned through legitimate learning activities
3. Any form of cheating will result in immediate disqualification
4. Decisions of the moderation team are final

### Progress Tracking
- Real-time leaderboard updates every 5 minutes
- Progress tracked across all learning categories
- Detailed statistics available in user profile
- End-of-month notifications at 24h, 12h, and 1h before contest end

### Additional Notes
- Participants must maintain active accounts
- Contest participation is automatic for all active users
- League placement based on current level at contest start
- Questions or disputes must be raised within 48 hours of contest end

For technical support or contest-related questions, please contact our support team through the app or at support@englishlearningapp.com

## Historical Rankings & Achievements

### Monthly Hall of Fame
- Top 10 performers for each month
- Separate rankings by league (Beginner, Intermediate, Advanced)
- Category leaders in specific skills
- Special recognition for exceptional achievements:
  - 10,000+ points
  - 25+ day streaks
  - 90%+ accuracy

### Yearly Championships
Track your progress and compete for yearly titles:

#### Grand Champion
- Best overall performer for the year
- Exclusive rewards:
  - 👑 Lifetime Achievement Badge
  - Special Profile Frame
  - Premium Lifetime Discount

#### League Champions (Per League)
1. 🏆 Champion
   - Champion Badge
   - Exclusive Avatar
   - 3 Months Premium Access

2. 🥈 Silver
   - Silver Badge
   - 2 Months Premium Access

3. 🥉 Bronze
   - Bronze Badge
   - 1 Month Premium Access

#### Special Achievements
- 🌟 **Perfect Month**: Top 10 ranking in any month
- 🎯 **Season Master**: Top 3 in three consecutive months
- ⭐ **Year-Round Achiever**: Consistent high performance
  - Minimum 5,000 points monthly
  - Active in at least 10 months
- ⚡ **Iron Will**: Active every week of the year
- 🎨 **Renaissance Learner**: Excellence across all categories

### Statistics & Tracking
- Comprehensive yearly statistics
- Visual progress tracking:
  - Monthly progress graphs
  - Skills radar charts
  - Activity heatmaps
  - Ranking trends

### Viewing Historical Data
- Filter by date, league, or category
- Sort by various metrics:
  - Total points
  - Streak length
  - Accuracy
  - Improvement rate
  - Learning time

## SEO Implementation

Our application implements comprehensive SEO strategies to ensure maximum visibility and accessibility:

### Meta Tags and Structure
- Semantic HTML5 structure
- Comprehensive meta tags for better search engine understanding
- Open Graph tags for social media sharing
- Twitter Card support for Twitter sharing
- Schema.org structured data for rich snippets

### Technical SEO
- Optimized sitemap.xml with priority settings
- Configured robots.txt for efficient crawling
- Mobile-responsive design
- Fast loading times through optimized assets
- HTTPS security implementation

### Content SEO
- Keyword-optimized page titles and descriptions
- Semantic URL structure
- Alt text for images
- Structured heading hierarchy (H1-H6)
- Rich, relevant content with natural keyword placement

### Performance Optimization
- Image optimization
- Lazy loading implementation
- Minified CSS/JavaScript
- Browser caching configuration
- Gzip compression

### Monitoring and Analytics
- Google Analytics integration
- Search Console setup
- Performance monitoring
- User behavior tracking
- Conversion tracking

### Local SEO
- Region-specific content
- Multiple language support
- Local business schema markup
- Geographic targeting

### Social Media Integration
- Social media meta tags
- Share buttons implementation
- Social profile linking
- Social media tracking

### Mobile SEO
- Mobile-first design
- Responsive images
- Touch-friendly interface
- Mobile performance optimization

### Content Structure
```
/
├── Home
├── Learning Features
│   ├── Vocabulary
│   ├── Grammar
│   ├── Pronunciation
│   └── Practice Areas
├── Game Features
│   ├── Leaderboard
│   └── Achievements
├── User Features
│   ├── Profile
│   └── Progress
└── Support
    ├── Help
    ├── FAQ
    └── Contact
```

### SEO Checklist
- [x] Implemented meta tags
- [x] Created sitemap.xml
- [x] Configured robots.txt
- [x] Added structured data
- [x] Optimized for mobile
- [x] Implemented SSL
- [x] Set up analytics
- [x] Optimized loading speed
- [x] Added social media tags
- [x] Implemented semantic HTML