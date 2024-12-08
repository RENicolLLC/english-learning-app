// Medical and Healthcare Scenarios
export const medicalScenarios = {
  basic: {
    id: "pharmacy-visit-01",
    metadata: {
      title: "Visiting a Pharmacy",
      category: "HEALTH",
      level: 3,
      difficulty: "easy",
      tags: ["pharmacy", "medicine", "health", "basic-needs"],
      estimatedTime: 15,
      prerequisites: ["basic-greetings", "numbers-01"]
    },
    content: {
      setup: {
        context: "You need to buy medicine for a headache at a local pharmacy.",
        location: "Local pharmacy",
        participants: ["Customer (you)", "Pharmacist"],
        objectives: [
          "Learn basic health vocabulary",
          "Practice describing symptoms",
          "Understand medicine instructions",
          "Ask about dosage"
        ]
      },
      dialogue: [
        {
          speaker: "You",
          text: "Excuse me, I have a headache. Do you have any medicine for it?",
          translations: {
            th: "ขอโทษครับ/ค่ะ ผม/ดิฉันปวดหัว มียาแก้ปวดไหมครับ/คะ?",
            vi: "Xin lỗi, tôi bị đau đầu. Bạn có thuốc cho nó không?",
            zh: "对不起，我头疼。您有治疗头痛的药吗？",
            ja: "すみません、頭痛がするのですが、薬はありますか？"
          },
          audioUrl: "/audio/medical/pharmacy-01-request.mp3",
          notes: "Speak clearly and point to your head if needed."
        },
        {
          speaker: "Pharmacist",
          text: "Yes, we have several options. How long have you had the headache?",
          translations: {
            th: "มีหลายแบบค่ะ/ครับ คุณปวดหัวมานานแค่ไหนแล้วคะ/ครับ?",
            vi: "Vâng, chúng tôi có nhiều loại. Bạn bị đau đầu bao lâu rồi?",
            zh: "是的，我们有几种选择。你头疼多久了？",
            ja: "はい、いくつか種類がございます。頭痛はどのくらい続いていますか？"
          },
          audioUrl: "/audio/medical/pharmacy-01-inquiry.mp3",
          notes: "Common follow-up question to determine appropriate medicine."
        }
      ],
      culturalNotes: {
        relevance: "Pharmacies in different countries may have different protocols for dispensing medicine",
        tips: [
          "Be prepared to describe symptoms clearly",
          "Always mention any allergies",
          "Keep receipts for insurance",
          "Ask about side effects"
        ],
        commonMistakes: [
          "Not mentioning existing medical conditions",
          "Forgetting to ask about dosage",
          "Not clarifying usage instructions",
          "Assuming all medicine is over-the-counter"
        ]
      },
      exercises: {
        vocabulary: [
          {
            term: "headache",
            definition: "Pain in the head",
            usage: "I have a bad headache.",
            translations: {
              th: "ปวดหัว",
              vi: "đau đầu",
              zh: "头疼",
              ja: "頭痛"
            }
          },
          {
            term: "medicine",
            definition: "Substance used to treat illness",
            usage: "This medicine will help with the pain.",
            translations: {
              th: "ยา",
              vi: "thuốc",
              zh: "药",
              ja: "薬"
            }
          }
        ],
        comprehension: [
          {
            question: "What should you tell the pharmacist?",
            options: [
              "Only that you want medicine",
              "Your symptoms and how long you've had them",
              "Just point to your head",
              "Ask for the cheapest medicine"
            ],
            correctAnswer: "Your symptoms and how long you've had them",
            explanation: "It's important to describe your symptoms and their duration to get appropriate medicine."
          }
        ]
      }
    }
  },

  intermediate: {
    id: "doctor-appointment-01",
    metadata: {
      title: "Making a Doctor's Appointment",
      category: "HEALTH",
      level: 6,
      difficulty: "normal",
      tags: ["doctor", "appointment", "clinic", "medical"],
      estimatedTime: 20,
      prerequisites: ["basic-health-vocab", "phone-calls-01"]
    },
    content: {
      setup: {
        context: "You need to schedule a doctor's appointment for a persistent cough.",
        location: "Phone call to medical clinic",
        participants: ["Patient (you)", "Receptionist"],
        objectives: [
          "Schedule medical appointments",
          "Describe symptoms in detail",
          "Provide medical history",
          "Handle insurance information"
        ]
      },
      dialogue: [
        {
          speaker: "Receptionist",
          text: "Good morning, City Medical Center. How can I help you today?",
          translations: {
            th: "สวัสดีค่ะ/ครับ ศูนย์การแพทย์ซิตี้ มีอะไรให้ช่วยไหมคะ/ครับ?",
            vi: "Xin chào, Trung tâm Y tế Thành phố. Tôi có thể giúp gì cho bạn?",
            zh: "早上好，城市医疗中心。我能帮您什么？",
            ja: "おはようございます。シティメディカルセンターです。ご用件をお伺いできますか？"
          }
        }
      ],
      culturalNotes: {
        relevance: "Medical appointment systems vary by country and culture",
        tips: [
          "Prepare insurance information beforehand",
          "Be ready to describe symptoms clearly",
          "Ask about required documentation",
          "Confirm appointment details"
        ]
      }
    }
  },

  advanced: {
    id: "emergency-room-01",
    metadata: {
      title: "Emergency Room Visit",
      category: "HEALTH",
      level: 9,
      difficulty: "hard",
      tags: ["emergency", "hospital", "urgent-care", "medical"],
      estimatedTime: 30,
      prerequisites: ["medical-vocab-advanced", "emergency-basics"]
    },
    content: {
      setup: {
        context: "You're in the emergency room with severe abdominal pain and need to communicate with medical staff.",
        location: "Hospital emergency room",
        participants: ["Patient (you)", "Nurse", "Doctor", "Registration Staff"],
        objectives: [
          "Describe emergency symptoms",
          "Understand medical procedures",
          "Provide medical history",
          "Handle urgent situations"
        ]
      },
      dialogue: [
        {
          speaker: "Nurse",
          text: "Can you describe the pain and when it started? Have you had any similar symptoms before?",
          translations: {
            th: "คุณช่วยอธิบายอาการเจ็บและเริ่มมีอาการเมื่อไหร่? เคยมีอาการแบบนี้มาก่อนไหม?",
            vi: "Bạn có thể mô tả cơn đau và khi nào nó bắt đầu không? Bạn đã từng có các triệu chứng tương tự trước đây chưa?",
            zh: "您能描述一下疼痛感和开始时间吗？之前有过类似的症状吗？",
            ja: "痛みの状態といつから始まったか説明できますか？以前に同じような症状がありましたか？"
          }
        }
      ],
      culturalNotes: {
        relevance: "Emergency medical procedures can vary by country",
        tips: [
          "Keep important medical documents accessible",
          "Learn key emergency phrases",
          "Know your rights as a patient",
          "Understand triage procedures"
        ]
      }
    }
  },

  professional: {
    id: "medical-consultation-01",
    metadata: {
      title: "Specialist Medical Consultation",
      category: "HEALTH",
      level: 12,
      difficulty: "expert",
      tags: ["specialist", "consultation", "medical-terms", "professional"],
      estimatedTime: 40,
      prerequisites: ["medical-terminology", "formal-consultation"]
    },
    content: {
      setup: {
        context: "You're discussing treatment options with a specialist for a chronic condition.",
        location: "Specialist's office",
        participants: ["Patient (you)", "Medical Specialist", "Nurse Practitioner"],
        objectives: [
          "Understand complex medical terminology",
          "Discuss treatment options",
          "Ask detailed medical questions",
          "Make informed decisions"
        ]
      },
      dialogue: [
        {
          speaker: "Specialist",
          text: "Based on your test results, I'd like to discuss several treatment options. Each has its own benefits and potential side effects.",
          translations: {
            th: "จากผลการตรวจของคุณ ผม/ดิฉันอยากจะพูดคุยเกี่ยวกับทางเลือกในการรักษาหลายๆ แบบ แต่ละแบบมีข้อดีและผลข้างเคียงที่อาจเกิดขึ้น",
            vi: "Dựa trên kết quả xét nghiệm của bạn, tôi muốn thảo luận về một số phương pháp điều trị. Mỗi phương pháp đều có lợi ích và tác dụng phụ tiềm ẩn.",
            zh: "根据您的检查结果，我想讨论几种治疗方案。每种方案都有其优点和潜在的副作用。",
            ja: "検査結果に基づいて、いくつかの治療選択肢について話し合いたいと思います。それぞれに利点と潜在的な副作用があります。"
          }
        }
      ],
      culturalNotes: {
        relevance: "Medical consultations can vary significantly across cultures",
        tips: [
          "Research medical terminology beforehand",
          "Prepare questions in advance",
          "Take notes during consultation",
          "Ask for clarification when needed"
        ]
      }
    }
  }
};

// Helper function to get scenarios by level
export const getMedicalScenariosByLevel = (level) => {
  return Object.values(medicalScenarios).filter(
    scenario => scenario.metadata.level === level
  );
};

// Helper function to get scenarios by difficulty
export const getMedicalScenariosByDifficulty = (difficulty) => {
  return Object.values(medicalScenarios).filter(
    scenario => scenario.metadata.difficulty === difficulty
  );
};

// Helper function to get scenarios by tag
export const getMedicalScenariosByTag = (tag) => {
  return Object.values(medicalScenarios).filter(
    scenario => scenario.metadata.tags.includes(tag)
  );
};

export default medicalScenarios; 