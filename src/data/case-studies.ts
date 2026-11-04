export type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  metric: string;
  metricLabel: string;
  shortDescription: string;
  problem: string;
  solution: string;
  result: string;
  loomUrl: string;
  screenshot: string;
  subtitle?: string;
  problemParagraphs?: string[];
  solutionParagraphs?: string[];
  resultIntro?: string;
  resultStats?: { value: string; label: string; assumption: string }[];
  resultNote?: string;
  resultBenefitsTitle?: string;
  resultBenefits?: { title: string; text: string }[];
  resultOutro?: string;
  howItWorks?: { title: string; text: string }[];
  howItWorksOutro?: string;
  builtFor?: { title: string; text: string };
  cta?: { heading: string; paragraphs: string[]; buttonLabel: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "client-onboarding-autopilot",
    title: "Client Onboarding on Autopilot",
    subtitle: "Save Time, Reduce Manual Work, and Never Miss a Step",
    industry: "All Industries",
    shortDescription:
      "A client onboarding system that saves each new client's details, sends a welcome email and a service roadmap, and notifies your team automatically.",
    problem:
      "Every new client needs attention, and handling those steps manually makes onboarding slow, easy to miss, and harder to manage as the business grows.",
    solution:
      "A client onboarding system that saves each new client's details, sends a welcome email and a service roadmap, and notifies the team automatically from the first form submission.",
    result:
      "Onboarding is designed to be faster, more consistent, and easier to manage, with an estimated 10 hours per month saved.",
    metric: "10 hrs/month",
    metricLabel: "estimated time saved",
    loomUrl: "",
    screenshot: "",
    problemParagraphs: [
      "Every new client needs attention. Their details must be saved, welcome emails sent, next steps explained, and the right team members informed.",
      "When all this happens manually, even a simple onboarding process can become time-consuming.",
      "Emails may get delayed. Client information can be missed. Team members may not know when someone new signs up.",
      "As the business grows, these small tasks add up. More time goes into managing the process instead of serving clients.",
    ],
    solutionParagraphs: [
      "I built a client onboarding system that handles the entire process automatically, from the first form submission to the final team notification.",
      "When a new client submits their details through a website form (any website or store), the system checks the information and saves the client record in a database (for example Google Sheets, Airtable, or any CRM).",
      "The client then receives two personalized emails automatically (for example through Gmail or any email service).",
      "The first is a warm welcome message.",
      "The second is a clear service roadmap explaining what the client can expect, who will handle their service, how long it should take, and what happens next.",
      "Once the emails are sent, the system updates the client record to show that onboarding is complete.",
      "The internal team also receives a notification with the new client's details.",
      "No need to manually copy information, write the same emails, or remind the team about every new signup.",
    ],
    resultIntro:
      "The system is designed to make onboarding faster, more consistent, and easier to manage.",
    resultStats: [
      {
        value: "Up to 10 hours per month",
        label: "Estimated time saved",
        assumption:
          "Assumption: 20 new clients per month, with 30 minutes of manual onboarding work per client.",
      },
      {
        value: "Up to $100 per month",
        label: "Estimated labor cost savings",
        assumption:
          "Assumption: 10 hours of manual work avoided at an assumed labor cost of $10 per hour.",
      },
    ],
    resultNote:
      "These are illustrative estimates, not results measured from a real client.",
    resultBenefitsTitle:
      "Beyond the estimated savings, the system is designed to provide three practical benefits:",
    resultBenefits: [
      {
        title: "Fewer missed steps",
        text: "Client records, emails, and team notifications follow a consistent process.",
      },
      {
        title: "A better first impression",
        text: "Every new client receives a personal welcome and clear next steps.",
      },
      {
        title: "Better team visibility",
        text: "Client information and onboarding status stay organized in one place.",
      },
    ],
    resultOutro:
      "The business spends less time managing repetitive tasks and can focus more on delivering its services.",
    howItWorks: [
      {
        title: "Step 1: A New Client Signs Up",
        text: "A client fills out a form on your website. Their information is checked and saved automatically in your client database.",
      },
      {
        title: "Step 2: The Client Gets a Personal Welcome",
        text: "The system sends two personalized emails: a welcome message and a service roadmap explaining who will handle the service, the expected timeline, and the next steps.",
      },
      {
        title: "Step 3: Your Team Stays Updated",
        text: "The client record is marked as onboarded, and your team receives a notification with the new client's details.",
      },
    ],
    howItWorksOutro:
      "The process is handled automatically, without repeating the same manual work for every new signup.",
    builtFor: {
      title: "Built for Different Businesses",
      text: "The same onboarding system can be adapted to almost any business that welcomes new clients or customers (e-commerce store, marketing agency, consultant, clinic). The forms, emails, client records, and service details can be customized to match how your business works.",
    },
    cta: {
      heading: "Want to Automate Your Client Onboarding?",
      paragraphs: [
        "Every business has a different way of welcoming new clients. Your onboarding system should fit your process, not force you to change it.",
        "I build Custom CRM + Full Automation, in one package, so your client information, follow-ups, and internal updates work together.",
        "Book a call with me, and let's discuss how your business can save time, reduce manual work, and make client onboarding easier.",
      ],
      buttonLabel: "Book a Free Call",
    },
  },
  {
    slug: "dental-clinic-no-shows",
    title: "Dental Clinic: 40% Fewer No-Shows",
    industry: "Healthcare",
    metric: "40%",
    metricLabel: "fewer no-shows",
    shortDescription:
      "Case study showing automated appointment reminders for a dental clinic.",
    problem:
      "A dental clinic relies on manual reminder calls and a paper appointment book. Last-minute cancellations leave gaps in the schedule, and the front desk spends hours chasing confirmations each week.",
    solution:
      "A reminder workflow sends SMS and email confirmations at set intervals before each appointment. Patients can reschedule with one link, and the clinic calendar and CRM update automatically when they respond.",
    result:
      "No-shows fall by 40% and reception spends less time on admin. Any remaining gaps can be offered to a waitlist automatically.",
    loomUrl: "",
    screenshot: "",
  },
  {
    slug: "agency-crm",
    title: "Agency CRM: 15 Hours/Week Saved",
    industry: "Marketing Agency",
    metric: "15 hrs/week",
    metricLabel: "saved per week",
    shortDescription:
      "Case study showing a custom CRM that removes repetitive agency admin.",
    problem:
      "A marketing agency tracks clients across spreadsheets, inboxes, and separate project tools. Account managers copy the same updates into several places, which creates delays and makes reporting inconsistent.",
    solution:
      "A custom CRM centralises client intake, project status, and approvals. n8n automations keep the CRM, project board, and reporting dashboard in sync without manual copy-paste.",
    result:
      "The account team saves 15 hours per week. Fewer status meetings are needed because client updates are generated and shared automatically.",
    loomUrl: "",
    screenshot: "",
  },
  {
    slug: "ecommerce-invoices",
    title: "E-commerce: Invoices and Reminders 100% Automatic",
    industry: "E-commerce",
    metric: "100%",
    metricLabel: "automatic invoicing",
    shortDescription:
      "Case study showing fully automated invoicing and payment reminders.",
    problem:
      "An online store creates invoices manually after each order and sends payment reminders by hand. During busy periods, invoices are delayed and reminders are easy to miss.",
    solution:
      "An automation triggers invoice creation from each order event, sends the invoice to the customer, and schedules reminders until payment is received. Failed or overdue payments are flagged in a simple dashboard.",
    result:
      "100% of invoices and reminders are sent without manual work. Fewer payments arrive late because every order follows the same automated follow-up sequence.",
    loomUrl: "",
    screenshot: "",
  },
  {
    slug: "support-bot",
    title: "Support Bot: 70% of Queries Solved Without a Human",
    industry: "Customer Support",
    metric: "70%",
    metricLabel: "queries solved by the bot",
    shortDescription:
      "Case study showing a support bot that resolves common questions instantly.",
    problem:
      "A support team answers the same setup and billing questions every day. Repetitive tickets slow down complex cases and make response times hard to predict.",
    solution:
      "A retrieval-based support bot answers common questions using an approved knowledge base. When a query falls outside its scope, it collects context and hands the ticket to a human with the conversation attached.",
    result:
      "70% of queries are resolved without a human. The remaining tickets reach the team with more context, which reduces handling time.",
    loomUrl: "",
    screenshot: "",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
