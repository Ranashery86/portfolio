export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: 'What does "Custom CRM + Full Automation" mean?',
    answer:
      "It means you get a CRM built around the way your business actually works, not a generic tool you have to adapt to. I connect that CRM to the rest of your process with n8n automation, so leads, follow-ups, invoices, reminders and support requests move between your tools without manual copy-paste.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on scope, the number of integrations, and how much of your process needs to be rebuilt. After the free consultation I will suggest a plan and give you an estimated timeline based on what we agree to build. Smaller automations can move quickly, while a full custom CRM takes longer.",
  },
  {
    question: "Which tools do you work with?",
    answer:
      "The main tools are n8n, custom frontends, webhooks, and APIs, plus common CRMs and apps your team already uses. If a tool has an API or webhook support, it can usually be connected. During the call we will review your current stack and confirm what is realistic.",
  },
  {
    question: "Do I need technical knowledge to use what you build?",
    answer:
      "No. The goal is to give you a simple interface and automations that run in the background. I will explain how the workflow works in plain English, and I can include basic handover notes so your team knows what to do when something needs attention.",
  },
  {
    question: "Can you automate a process that is unique to my business?",
    answer:
      "Usually, yes. A discovery call is the best way to understand the steps, exceptions, and tools involved. Some processes need a custom CRM or a small internal app rather than a simple automation, and I will tell you honestly if that is the case.",
  },
  {
    question: "How does the free consultation call work?",
    answer:
      "The call is a short conversation about your current process, where time is being lost, and what you would like to improve. You do not need to prepare a technical brief. I will ask questions, suggest a practical direction, and explain what a sensible next step looks like. There is no obligation to book a project.",
  },
];
