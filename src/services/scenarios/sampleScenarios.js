// Sample scenarios for different levels
export const sampleScenarios = {
  elementary: {
    id: "school-introduction-01",
    metadata: {
      title: "First Day at School",
      category: "EDUCATION",
      level: 1,
      difficulty: "easy",
      tags: ["school", "introduction", "greetings", "classroom"],
      estimatedTime: 10,
      prerequisites: []
    },
    content: {
      setup: {
        context: "It's your first day at a new school. You need to introduce yourself to your teacher and classmates.",
        location: "Elementary school classroom",
        participants: ["Student (you)", "Teacher", "Classmates"],
        objectives: [
          "Learn basic self-introduction",
          "Practice classroom greetings",
          "Understand simple instructions",
          "Learn numbers 1-10"
        ]
      },
      dialogue: [
        {
          speaker: "Teacher",
          text: "Good morning, class! We have a new student today. Please introduce yourself.",
          translations: {
            th: "สวัสดีค่ะนักเรียน! วันนี้เรามีนักเรียนใหม่ กรุณาแนะนำตัวค่ะ",
            vi: "Chào các em! Hôm nay chúng ta có học sinh mới. Em hãy tự giới thiệu nhé.",
            zh: "早上好，同学们！今天我们有一位新同学。请自我介绍。",
            ja: "おはようございます、みなさん！今日は新しい生徒さんがいます。自己紹介をお願いします。"
          },
          audioUrl: "/audio/school-01-teacher.mp3",
          notes: "Friendly, encouraging tone. Common classroom greeting.",
          timing: 4
        },
        {
          speaker: "Student",
          text: "Hello! My name is [Name]. I am 7 years old. Nice to meet you!",
          translations: {
            th: "สวัสดีค่ะ/ครับ! ผม/หนูชื่อ [ชื่อ] อายุ 7 ขวบค่ะ/ครับ ยินดีที่ได้รู้จักค่ะ/ครับ",
            vi: "Xin chào! Tên em là [Tên]. Em 7 tuổi. Rất vui được gặp mọi người!",
            zh: "大家好！我叫[名字]。我七岁。很高兴认识大家！",
            ja: "はじめまして！[名前]です。7歳です。よろしくお願いします！"
          },
          audioUrl: "/audio/school-01-student.mp3",
          notes: "Speak clearly and smile. Remember to bow or wave depending on the culture.",
          timing: 3
        }
      ],
      culturalNotes: {
        relevance: "First impressions and proper introductions are important in school settings across cultures",
        tips: [
          "Stand up when speaking to the teacher",
          "Speak clearly and loudly enough",
          "Smile and show enthusiasm",
          "Listen when others speak"
        ],
        commonMistakes: [
          "Speaking too quietly",
          "Forgetting to say 'nice to meet you'",
          "Not making eye contact (in Western cultures)",
          "Incorrect greeting for time of day"
        ]
      },
      exercises: {
        vocabulary: [
          {
            term: "name",
            definition: "What you are called",
            usage: "My name is [Name].",
            translations: {
              th: "ชื่อ",
              vi: "tên",
              zh: "名字",
              ja: "名前"
            }
          },
          {
            term: "years old",
            definition: "Your age",
            usage: "I am seven years old.",
            translations: {
              th: "อายุ ... ปี",
              vi: "... tuổi",
              zh: "...岁",
              ja: "...歳"
            }
          }
        ],
        grammar: [
          {
            pattern: "I am + [age] + years old",
            explanation: "How to tell your age in English",
            examples: [
              "I am six years old.",
              "I am seven years old.",
              "I am eight years old."
            ]
          }
        ],
        pronunciation: [
          {
            word: "hello",
            phonetic: "həˈləʊ",
            audioUrl: "/audio/vocab-hello.mp3",
            tips: "Make sure to stress the second syllable"
          }
        ],
        comprehension: [
          {
            question: "How do you introduce yourself?",
            options: [
              "My name is...",
              "I called...",
              "Name is...",
              "Me..."
            ],
            correctAnswer: "My name is...",
            explanation: "We use 'My name is...' for proper self-introduction."
          }
        ]
      }
    },
    interactions: {
      userChoices: [
        {
          prompt: "The teacher asks where you're from. What do you say?",
          options: [
            "I am from [Country].",
            "I come from [Country].",
            "My country is [Country].",
            "From [Country]."
          ],
          consequences: {
            followUpQuestions: {
              "I am from [Country].": "How long have you lived here?",
              "I come from [Country].": "Do you like it here so far?"
            }
          }
        }
      ]
    }
  },

  intermediate: {
    id: "job-interview-01",
    metadata: {
      title: "Job Interview Preparation",
      category: "WORK",
      level: 8,
      difficulty: "normal",
      tags: ["interview", "career", "professional", "communication"],
      estimatedTime: 25,
      prerequisites: ["basic-interview-01", "professional-email-01"]
    },
    content: {
      setup: {
        context: "You have a job interview for an entry-level position. You need to prepare answers and practice common interview questions.",
        location: "Corporate office",
        participants: ["Candidate (you)", "Interviewer", "Receptionist"],
        objectives: [
          "Learn professional interview responses",
          "Practice formal business language",
          "Handle unexpected questions",
          "Discuss qualifications and experience"
        ]
      },
      dialogue: [
        {
          speaker: "Interviewer",
          text: "Tell me about yourself and why you're interested in this position.",
          translations: {
            th: "กรุณาเล่าเกี่ยวกับตัวคุณและทำไมคุณถึงสนใจตำแหน่งนี้",
            vi: "Hãy cho tôi biết về bản thân và tại sao bạn quan tâm đến vị trí này.",
            zh: "请介绍一下你自己，并说明你为什么对这个职位感兴趣。",
            ja: "自己紹介と、この職位に興味を持った理由を教えてください。"
          },
          audioUrl: "/audio/interview-01-question.mp3",
          notes: "Professional tone, clear articulation, maintain eye contact",
          timing: 5
        }
      ],
      culturalNotes: {
        relevance: "Job interviews follow specific cultural norms and expectations in professional settings",
        tips: [
          "Research the company beforehand",
          "Prepare specific examples of your experience",
          "Dress appropriately for the industry",
          "Follow up with a thank-you email"
        ],
        commonMistakes: [
          "Being too casual",
          "Not providing specific examples",
          "Talking too much about salary",
          "Being unprepared for common questions"
        ]
      }
    }
  },

  advanced: {
    id: "business-negotiation-01",
    metadata: {
      title: "International Business Negotiation",
      category: "WORK",
      level: 11,
      difficulty: "hard",
      tags: ["business", "negotiation", "international", "professional"],
      estimatedTime: 40,
      prerequisites: ["business-etiquette-01", "negotiation-basics-01"]
    },
    content: {
      setup: {
        context: "You're leading a negotiation with international business partners about a potential joint venture.",
        location: "Virtual meeting room",
        participants: ["Business Development Manager (you)", "Foreign Investors", "Legal Team", "Financial Advisors"],
        objectives: [
          "Master advanced business vocabulary",
          "Handle complex negotiations",
          "Navigate cultural differences",
          "Present and defend proposals"
        ]
      },
      dialogue: [
        {
          speaker: "You",
          text: "Based on our market analysis, we project a 15% annual growth rate for the first three years. Let me walk you through the numbers.",
          translations: {
            th: "จากการวิเคราะห์ตลาดของเรา เราคาดการณ์อัตราการเติบโตที่ 15% ต่อปีในช่วงสามปีแรก ผมขอนำเสนอตัวเลขให้ดูครับ",
            vi: "Dựa trên phân tích thị trường của chúng tôi, chúng tôi dự đoán tốc độ tăng trưởng hàng năm là 15% trong ba năm đầu tiên. Để tôi hướng dẫn các bạn qua các con số.",
            zh: "根据我们的市场分析，我们预计前三年的年增长率为15%。让我为您详细说明这些数据。",
            ja: "市場分析に基づき、最初の3年間で年間15%の成長率を予測しています。数字の詳細をご説明させていただきます。"
          },
          audioUrl: "/audio/negotiation-01-proposal.mp3",
          notes: "Confident tone, clear articulation of numbers, professional business language",
          timing: 6
        }
      ],
      culturalNotes: {
        relevance: "International business negotiations require understanding of multiple cultural approaches to business",
        tips: [
          "Research cultural business norms",
          "Be patient with different communication styles",
          "Respect hierarchy and decision-making processes",
          "Pay attention to non-verbal communication"
        ],
        commonMistakes: [
          "Rushing to close the deal",
          "Ignoring cultural protocols",
          "Being too direct in certain cultures",
          "Not allowing time for relationship building"
        ]
      }
    }
  }
};

export default sampleScenarios; 