export const PLANS = {
    FREE: {
        name: "Free",
        price: "$0",
        description: "Perfect for trying out QuizMaster.",
        features: [
            "Up to 3 Quizzes",
            "50 Participants per Quiz",
            "Basic Analytics",
            "Community Support",
        ],
        limits: {
            maxQuizzes: 3,
            maxParticipants: 50,
        },
    },
    PRO: {
        name: "Pro",
        price: "$19",
        description: "For professional hosts and educators.",
        features: [
            "Up to 20 Quizzes",
            "500 Participants per Quiz",
            "Advanced Analytics",
            "Priority Email Support",
            "Custom Branding (Basic)",
        ],
        limits: {
            maxQuizzes: 20,
            maxParticipants: 500,
        },
    },
    ENTERPRISE: {
        name: "Enterprise",
        price: "$99",
        description: "For large organizations and events.",
        features: [
            "Unlimited Quizzes",
            "Unlimited Participants",
            "Real-time Data Export",
            "Dedicated Account Manager",
            "Full Custom Branding",
            "SSO Integration",
        ],
        limits: {
            maxQuizzes: 999999,
            maxParticipants: 999999,
        },
    },
} as const;

export type PlanType = keyof typeof PLANS;
