export type CaseStudyVisual = {
  key: "dashboard" | "chat" | "workflow";
  placement: "afterSolution" | "afterHowItWorks";
  alt: string;
  caption?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  metric: string;
  metricLabel: string;
  headline: string;
  headlineLabel: string;
  shortDescription: string;
  problem: string;
  solution: string;
  result: string;
  loomUrl: string;
  screenshot: string;
  subtitle?: string;
  cardTitle?: string;
  problemLead?: string;
  problemParagraphs?: string[];
  problemBullets?: string[];
  problemClosingParagraphs?: string[];
  problemChallenge?: { label: string; text: string };
  solutionLead?: string;
  solutionParagraphs?: string[];
  solutionPipeline?: string[];
  solutionAfterPipelineParagraphs?: string[];
  solutionPlainBullets?: string[];
  solutionAfterBulletsParagraphs?: string[];
  solutionBullets?: { title: string; text: string }[];
  solutionClosingParagraphs?: string[];
  solutionSubsections?: { title: string; paragraphs: string[] }[];
  resultLead?: string;
  solutionClosing?: { title: string; text: string };
  resultIntro?: string;
  resultStats?: { value: string; label: string; assumption: string }[];
  resultNote?: string;
  resultBenefitsTitle?: string;
  resultBenefits?: { title: string; text: string }[];
  resultOutro?: string;
  howItWorksTitle?: string;
  howItWorks?: { title: string; text: string }[];
  howItWorksOutro?: string;
  builtFor?: { title: string; text: string };
  builtForNote?: string;
  cta?: { heading: string; paragraphs: string[]; buttonLabel: string };
  videoCaption?: string;
  screenshotCaption?: string;
  postUrl?: string;
  postLabel?: string;
  visuals?: CaseStudyVisual[];
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
    headline: "Zero manual onboarding",
    headlineLabel: "From form to welcome email",
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
    screenshotCaption:
      "Behind the scenes: the automated workflow that saves the client record, sends both emails, and notifies the team.",
    visuals: [
      {
        key: "dashboard",
        placement: "afterSolution",
        alt: "Client onboarding dashboard showing new clients, onboarded clients, emails sent and the automation activity log",
        caption: "Example dashboard (illustrative mockup)",
      },
      {
        key: "workflow",
        placement: "afterHowItWorks",
        alt: "Workflow diagram: client form webhook, client record saved to a spreadsheet, welcome email, service roadmap email, client marked onboarded and team notified",
        caption:
          "Behind the scenes: the automated workflow that saves the client record, sends both emails, and notifies the team.",
      },
    ],
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
    slug: "sales-pipeline-crm",
    title: "Never Lose Track of a Sales Lead Again",
    cardTitle: "Custom Sales CRM with Automated Follow-Ups",
    subtitle: "Sales Pipeline CRM Automation",
    industry: "Sales and Lead Management",
    shortDescription:
      "A custom sales CRM that captures enquiries, tracks deals on a visual pipeline, and sends follow-ups automatically.",
    metric: "8-10 hrs/month",
    metricLabel: "estimated time saved",
    headline: "No lead left behind",
    headlineLabel: "Pipeline and follow-ups in one place",
    loomUrl: "",
    screenshot: "",
    postUrl: "",
    postLabel: "",
    problem:
      "Sales enquiries get lost in emails and spreadsheets. Follow-ups are forgotten, and deals become difficult to track.",
    solution:
      "I built a custom sales CRM that captures enquiries, tracks deals on a visual pipeline, and sends follow-ups automatically.",
    result:
      "Less manual tracking, fewer duplicate records, and better visibility into every sales opportunity.",
    problemLead: "A new enquiry is only valuable if someone follows up.",
    problemParagraphs: [
      "Many businesses receive enquiries through their websites but still manage sales manually.",
      "Leads end up scattered across emails and spreadsheets. Some are entered twice. Others are forgotten after the first conversation.",
      "As more enquiries arrive, keeping track becomes difficult.",
      "Business owners often struggle to answer simple questions:",
    ],
    problemBullets: [
      "Which leads need attention today?",
      "Who has already received a follow-up?",
      "Which deals are waiting for a decision?",
      "How much potential business is still in the pipeline?",
    ],
    problemClosingParagraphs: [
      "Without one clear system, sales tracking takes more time than necessary, and opportunities can slip away.",
    ],
    solutionLead:
      "One custom CRM. Every lead tracked. Follow-ups handled automatically.",
    solutionParagraphs: [
      "I built a custom sales CRM that brings enquiries, deal tracking, and follow-ups together in one place.",
      "When someone submits an enquiry through a website form (any website, landing page, or contact form), the system checks the details and prevents duplicate email entries.",
      'The new lead is saved in a database (for example Supabase, Airtable, or any CRM) and marked as "New".',
      "The customer receives a friendly acknowledgement email, while the business owner gets a notification with the enquiry details.",
      "A custom dashboard gives the team a clear visual sales pipeline with five stages:",
    ],
    solutionPipeline: ["New", "Contacted", "Quote Sent", "Won", "Lost"],
    solutionAfterPipelineParagraphs: [
      "Each lead card shows the customer's name, company, deal value, source, and time since the last activity.",
      "The team can drag leads between stages. Every change is recorded in the lead's activity history.",
      "The dashboard also shows important numbers, including total leads, active deals, pipeline value, won deals, follow-ups due, and leads that have gone quiet.",
    ],
    solutionSubsections: [
      {
        title: "Follow-ups happen automatically.",
        paragraphs: [
          "Active leads can receive up to three short, polite follow-up emails around days 1, 3, and 7, each with a different message.",
          "Once a deal is marked Won or Lost, the follow-ups stop.",
          "If a lead has had no activity for more than seven days, it is included in a summary email to the owner.",
        ],
      },
    ],
    solutionClosingParagraphs: [
      "This gives the business a clearer sales process without relying on someone to remember every task.",
    ],
    resultLead: "Less admin work. Better organization. Fewer missed follow-ups.",
    resultIntro:
      "This case study shows how a business could benefit from managing its sales process in one connected system.",
    resultStats: [
      {
        value: "8-10 hours per month",
        label: "Estimated time saved",
        assumption:
          "Assumption: 50 new enquiries per month, with 10-12 minutes of manual tracking and follow-up work per lead.",
      },
      {
        value: "$80-$100 per month",
        label: "Estimated admin cost savings",
        assumption:
          "Assumption: 8-10 hours saved monthly at an assumed administrative labor cost of $10 per hour.",
      },
    ],
    resultNote:
      "These are illustrative estimates, not measured results from a real client. Actual savings depend on enquiry volume and the business's existing process.",
    resultBenefitsTitle: "Other practical benefits include:",
    resultBenefits: [
      {
        title: "Fewer mistakes",
        text: "Duplicate email entries are prevented automatically.",
      },
      {
        title: "More consistent follow-ups",
        text: "Active leads receive scheduled messages without manual reminders.",
      },
      {
        title: "Clearer sales visibility",
        text: "The owner can see active deals and pipeline value in one dashboard.",
      },
      {
        title: "Better team coordination",
        text: "Every lead has an activity history showing what happened and when.",
      },
      {
        title: "Less manual checking",
        text: "Quiet leads are brought to the owner's attention.",
      },
    ],
    resultOutro:
      "The goal is simple: spend less time managing sales records and more time speaking with potential customers.",
    howItWorksTitle: "How It Works",
    howItWorks: [
      {
        title: "Step 1: Capture Every Enquiry",
        text: 'A customer submits an enquiry on the business website.\n\nThe system checks for duplicate email entries, saves the lead, sends the customer an acknowledgement email, and alerts the owner.\n\nThe lead appears in the CRM under "New".',
      },
      {
        title: "Step 2: Track Every Deal",
        text: "The team sees all leads on a visual pipeline board.\n\nAs conversations progress, leads move through Contacted, Quote Sent, Won, or Lost.\n\nThe dashboard updates, and each lead's activity history records the changes.",
      },
      {
        title: "Step 3: Follow Up Without Forgetting",
        text: "Active leads receive scheduled follow-up emails around days 1, 3, and 7.\n\nFollow-ups stop when a deal is marked Won or Lost.\n\nThe owner also receives a summary of leads with no activity for more than seven days, helping the team identify opportunities that need attention.",
      },
    ],
    builtFor: {
      title: "Works for Any Business",
      text: "This CRM can be adapted to businesses that manage customer enquiries, sales conversations, and deals (for example, a web design agency, solar installer, accounting firm, or equipment supplier). Sales stages, follow-up messages, and dashboard details can be adjusted to match each business's process.",
    },
    builtForNote:
      "Possible extension: When a deal is won, the CRM can also be connected to a client onboarding system to welcome the new customer automatically.",
    videoCaption:
      "See how the custom CRM captures enquiries, tracks deals through the sales pipeline, and handles follow-ups automatically.",
    screenshotCaption:
      "Behind the scenes: the automated process that manages new enquiries, prevents duplicates, sends follow-ups, and keeps lead records updated.",
    visuals: [
      {
        key: "dashboard",
        placement: "afterSolution",
        alt: "Sales pipeline CRM dashboard with the stages New, Contacted, Quote Sent, Won and Lost",
        caption: "Example dashboard (illustrative mockup)",
      },
      {
        key: "workflow",
        placement: "afterHowItWorks",
        alt: "Workflow diagram for capturing enquiries, preventing duplicates, sending follow-ups and updating lead records",
        caption:
          "Behind the scenes: the automated process that manages new enquiries, prevents duplicates, sends follow-ups, and keeps lead records updated.",
      },
    ],
    cta: {
      heading:
        "Your sales process should help you win customers, not create more admin work.",
      paragraphs: [
        "I build custom CRMs with complete automation, tailored to how your business operates.",
        "Let's discuss how we can simplify your sales process, reduce manual work, and keep your leads organized.",
      ],
      buttonLabel: "Book a Free Discovery Call",
    },
  },
  {
    slug: "email-order-tracking",
    title:
      "Stop Copying Order Details by Hand. Keep Every Order Updated Automatically.",
    cardTitle: "Email-to-Order Tracking Automation",
    subtitle: "Email and Document Order Tracking Automation",
    industry: "Operations and Logistics",
    shortDescription:
      "A system that reads incoming emails and PDFs, extracts key details, and updates the correct order records automatically.",
    metric: "3 hrs/week",
    metricLabel: "estimated time saved",
    headline: "No more copy-paste",
    headlineLabel: "Emails and PDFs into order records",
    loomUrl: "",
    screenshot: "",
    postUrl: "",
    postLabel: "",
    problem:
      "Important order details get buried in emails and PDF attachments. Staff spend hours copying information by hand.",
    solution:
      "I built a system that reads incoming emails and documents, extracts key details, and updates the correct order records automatically.",
    result:
      "Less manual work, fewer typing mistakes, and a custom dashboard that keeps order information in one place.",
    problemLead:
      "Too many emails. Too much copying. Too many chances for mistakes.",
    problemParagraphs: [
      "Many businesses receive important order information through emails and attached documents.",
      "Every new invoice, purchase order, shipping document, or payment update needs someone to open it, find the right reference numbers and dates, and copy them into an order record.",
      "This creates several problems:",
    ],
    problemBullets: [
      "Staff waste valuable time reading emails and copying details.",
      "Typing mistakes can lead to incorrect order information.",
      "Important updates get buried in a busy inbox.",
      "Order records fall behind when staff are busy.",
      "Finding the latest information means searching through old emails and PDFs.",
    ],
    problemClosingParagraphs: [
      "The more orders a business handles, the harder it becomes to keep everything updated manually.",
    ],
    solutionLead:
      "A system that reads order emails and updates records automatically.",
    solutionParagraphs: [
      "I built an email and document tracking system that handles the repetitive work of reading incoming emails, finding important details, and updating order records.",
      "The system checks the business inbox for new emails within minutes.",
      "It reads email messages and attached PDFs, including scanned documents using text recognition (OCR).",
      "It identifies important information such as:",
    ],
    solutionPlainBullets: [
      "Order, invoice, shipment, and payment reference numbers.",
      "Important dates, including departure and arrival dates.",
      "Short status updates from email messages.",
    ],
    solutionAfterBulletsParagraphs: [
      "The system uses simple rules first to find the information. AI only helps when those rules cannot find enough details. It never guesses missing information.",
      "Unrelated emails are ignored.",
      "Once the information is found, the system matches it to the correct order in a database (for example Supabase, Airtable, or any CRM), updates the record, and logs what changed and which email provided the information.",
      "I also built a custom web dashboard where the team can see all orders and their latest recorded details in one place.",
    ],
    solutionClosingParagraphs: [
      "**The goal is simple:** Stop wasting time copying information that can be handled automatically.",
    ],
    resultLead: "Less manual work. More reliable order tracking.",
    resultIntro:
      "With this system, a business can reduce the time spent opening documents and copying order information.",
    resultStats: [
      {
        value: "Up to 3 hours per week",
        label: "Estimated time savings",
        assumption:
          "Assumption: 40 relevant order emails per week, with 5 minutes of manual copying per email. Actual savings depend on email volume and document quality.",
      },
    ],
    resultBenefitsTitle: "The main benefits include:",
    resultBenefits: [
      {
        title: "Time saved",
        text: "Staff spend less time copying reference numbers and dates.",
      },
      {
        title: "Lower admin costs",
        text: "Less repetitive data entry means more staff time available for other work.",
      },
      {
        title: "Fewer mistakes",
        text: "Automatic extraction reduces the risk of manual typing errors.",
      },
      {
        title: "Fewer missed updates",
        text: "Relevant emails are checked and processed within minutes.",
      },
      {
        title: "Better visibility",
        text: "Teams can see the latest recorded order details on one dashboard.",
      },
      {
        title: "Clearer records",
        text: "Each automatic update is logged with its source email.",
      },
    ],
    resultOutro:
      "These are expected benefits of the system, not measured results from a real client.",
    howItWorksTitle: "How It Works",
    howItWorks: [
      {
        title: "Step 1: New emails are checked automatically",
        text: "The system monitors the business inbox (for example Gmail or any email service) for incoming messages. It ignores unrelated emails and reads relevant messages and PDF attachments. Scanned PDFs are read using text recognition (OCR).",
      },
      {
        title: "Step 2: Important details are collected",
        text: "The system identifies order numbers, invoice references, shipping details, important dates, and status notes. It uses simple rules first. AI helps only when information is missing from the rule-based results, without guessing anything that is not clearly written.",
      },
      {
        title: "Step 3: Order records are updated",
        text: "The extracted details are matched to the correct order. The database is updated, and every change is logged with its source email. The custom dashboard shows all orders and their latest recorded information in one place.",
      },
    ],
    builtFor: {
      title: "Works for Any Business",
      text: "This system can be adapted to different industries, document types, and order-tracking processes (import and export companies, freight forwarders, wholesale suppliers, and accounts payable teams). Whether your business handles invoices, shipping paperwork, purchase orders, or payment references, the same approach can reduce manual entry and keep records organized.",
    },
    videoCaption:
      "See how the system reads incoming emails and PDFs, extracts important order details, updates records automatically, and displays the latest information on a custom dashboard.",
    screenshotCaption:
      "A look at the automated process that turns incoming emails and business documents into updated order records.",
    visuals: [
      {
        key: "dashboard",
        placement: "afterSolution",
        alt: "Order tracking dashboard listing orders with their latest recorded details",
        caption: "Example dashboard (illustrative mockup)",
      },
      {
        key: "workflow",
        placement: "afterHowItWorks",
        alt: "Workflow diagram that reads emails and PDFs, extracts order details and updates order records",
        caption:
          "A look at the automated process that turns incoming emails and business documents into updated order records.",
      },
    ],
    cta: {
      heading: "Want to Stop Copying Order Details by Hand?",
      paragraphs: [
        "Still spending hours copying order details from emails and documents? Let's discuss how a custom tracking system could simplify your business operations.",
      ],
      buttonLabel: "Book a Free Discovery Call",
    },
  },
  {
    slug: "appointment-booking-chatbot",
    title: "Let Customers Book Appointments 24/7 Without the Back-and-Forth",
    cardTitle: "AI Appointment Booking Chatbot",
    subtitle: "AI Appointment Booking Chatbot",
    industry: "Appointment Businesses",
    shortDescription:
      "An AI chatbot that answers service questions, checks real availability, and handles bookings, rescheduling, and cancellations.",
    problem:
      "Answering booking questions, checking availability, and managing schedule changes takes valuable staff time.",
    solution:
      "I built an AI chatbot that answers service questions, checks real availability, and handles bookings, rescheduling, and cancellations.",
    result:
      "Less manual work, fewer scheduling mistakes, and a smoother booking experience for customers.",
    metric: "2 hrs/week",
    metricLabel: "estimated time saved",
    headline: "Bookings, 24/7",
    headlineLabel: "Answers, scheduling and confirmations",
    loomUrl: "",
    screenshot: "",
    postUrl: "",
    postLabel: "",
    problemParagraphs: [
      "Managing appointments can take more time than business owners realize.",
      'Customers regularly ask questions like "Are you free tomorrow?", "How much does this service cost?", or "Can I change my appointment?"',
      "Every request needs attention. Someone has to check the calendar, reply with available times, collect customer details, and update booking records.",
      "When several customers contact the business at once, replies can be delayed. Appointments may overlap, customers may lose interest, and staff spend valuable time managing the same routine tasks.",
      "Rescheduling and cancellations add even more work.",
    ],
    problemChallenge: {
      label: "The challenge",
      text: "Make appointment booking easier for customers without creating more administrative work for the business.",
    },
    solutionParagraphs: [
      "I built an **AI Appointment Booking Chatbot** that works like a friendly receptionist directly on a business website.",
      "Customers can ask questions and manage appointments through a simple conversation, without filling out long forms or waiting for someone to reply.",
      "The chatbot can:",
    ],
    solutionBullets: [
      {
        title: "Answer service questions",
        text: "Explain available services, prices, and durations using the business's actual service list, without making up information.",
      },
      {
        title: "Check real availability",
        text: "Look at the business calendar and offer times that are genuinely available.",
      },
      {
        title: "Book appointments",
        text: "Collect the necessary details, confirm the customer's choice, and create the appointment.",
      },
      {
        title: "Prevent booking conflicts",
        text: "Check for full or partial overlaps and check availability again before creating the booking.",
      },
      {
        title: "Follow business hours",
        text: "Accept only future appointments within the business's working hours.",
      },
      {
        title: "Reschedule appointments",
        text: "Find a new available time and update the existing booking.",
      },
      {
        title: "Cancel appointments",
        text: "Remove cancelled appointments from the calendar and update the booking record.",
      },
      {
        title: "Keep records organized",
        text: "Save bookings with unique Booking IDs in the business's records.",
      },
      {
        title: "Send confirmation emails",
        text: "Automatically email customers when their appointments are booked, changed, or cancelled.",
      },
      {
        title: "Remember the conversation",
        text: "Keep track of details already shared so customers don't need to repeat themselves.",
      },
    ],
    solutionClosingParagraphs: [
      "The chatbot uses the business's existing service information, calendar, and booking records.",
      "Customers get a straightforward booking experience, while the business spends less time handling routine appointment messages.",
    ],
    resultIntro:
      "This case study shows how an appointment-based business can reduce manual scheduling work while giving customers a faster way to book.",
    resultStats: [
      {
        value: "2 hours per week",
        label: "Estimated time savings",
        assumption:
          "Less time spent answering routine booking messages.",
      },
      {
        value: "$30 per week",
        label: "Estimated staff cost savings",
        assumption: "Based on an example staff cost of $15 per hour.",
      },
    ],
    resultNote:
      "Estimate assumptions: 40 booking messages per week, 5 minutes of manual work per message, and 60% of that work automated. These are illustrative estimates, not measured client results. Actual savings depend on booking volume and business operations.",
    resultBenefits: [
      {
        title: "Less time spent on routine messages",
        text: "Customers can check services, prices, and available times without requiring staff to answer every question.",
      },
      {
        title: "Lower administrative costs",
        text: "Automating repetitive booking tasks can reduce the staff time needed to manage appointments.",
      },
      {
        title: "Fewer scheduling mistakes",
        text: "Availability checks help prevent overlapping appointments, while automatic record updates reduce the chance of outdated booking information.",
      },
      {
        title: "A better customer experience",
        text: "Customers can book, reschedule, or cancel through a simple conversation, at any time.",
      },
    ],
    howItWorksTitle: "How It Works",
    howItWorks: [
      {
        title: "Step 1: Customer Starts a Conversation",
        text: "A customer opens the website chatbot and asks about services, prices, or available appointments.\n\nThe chatbot answers using the business's service information and collects booking details one question at a time.",
      },
      {
        title: "Step 2: Availability Is Checked and Booking Is Confirmed",
        text: "The chatbot checks the calendar, working hours, and appointment duration.\n\nIf the requested time is unavailable, it suggests alternative times.\n\nBefore booking, it repeats the details and asks the customer to confirm. Once confirmed, it checks availability again and creates the appointment.",
      },
      {
        title: "Step 3: Records and Appointments Stay Updated",
        text: "The confirmed appointment is saved in the business calendar and booking records with a unique Booking ID. The customer receives a confirmation email.\n\nIf the customer returns to reschedule or cancel using their Booking ID, the chatbot handles the request and automatically updates the calendar, records, and email confirmation.",
      },
    ],
    builtFor: {
      title: "Works for Any Appointment-Based Business",
      text: "This chatbot can be adapted to almost any business that accepts appointments (for example, a dental clinic, hair salon, consulting firm, or car repair shop). Services, prices, working hours, and booking rules can be customized to fit the business, without changing how customers interact with the chatbot.",
    },
    videoCaption:
      "Watch the appointment booking chatbot in action, from answering service questions to booking and managing appointments.",
    screenshotCaption:
      "A behind-the-scenes look at how appointment requests, availability checks, booking records, and confirmations are handled automatically.",
    visuals: [
      {
        key: "chat",
        placement: "afterSolution",
        alt: "Appointment booking chatbot conversation checking availability and confirming a booking",
        caption: "Example conversation (illustrative)",
      },
      {
        key: "workflow",
        placement: "afterHowItWorks",
        alt: "Workflow diagram for the appointment booking chatbot: availability check, booking, calendar update and confirmation email",
        caption:
          "A behind-the-scenes look at how appointment requests, availability checks, booking records, and confirmations are handled automatically.",
      },
    ],
    cta: {
      heading: "Want a Booking Assistant Like This for Your Business?",
      paragraphs: [
        "Still spending hours answering booking messages and managing appointments? I can build a similar system around your business, including a custom CRM and full automation in one package.",
      ],
      buttonLabel: "Book a Free Discovery Call",
    },
  },
  {
    slug: "ai-ecommerce-support-chatbot",
    title:
      "AI Customer Chatbot That Saves Support Time and Helps Shoppers Find Products",
    cardTitle: "AI Customer Chatbot for Online Stores",
    subtitle:
      "AI E-commerce Customer Chatbot: Order Tracking, Support Tickets & Product Recommendations",
    industry: "E-commerce",
    shortDescription:
      "An AI chatbot that tracks orders, handles support tickets, and recommends products directly on a store's website.",
    problem:
      "Repeated order questions, slow support replies, and missed product recommendations take up valuable time.",
    solution:
      "I built an AI chatbot that tracks orders, handles support tickets, and recommends products directly on a store's website.",
    result:
      "Customers get faster answers, support requests stay organized, and store owners spend less time on repetitive questions.",
    metric: "5 hrs/week",
    metricLabel: "estimated time saved",
    headline: "Instant answers, fewer tickets",
    headlineLabel: "Orders, support and recommendations",
    loomUrl: "",
    screenshot: "",
    postUrl: "",
    postLabel: "",
    problemParagraphs: [
      "Running an online store means answering customer questions every day.",
      'Customers ask, "Where is my order?" or "When will it arrive?" Others need help with damaged products, missing items, or delivery problems.',
      "Answering these questions manually takes time. Support messages can get lost, replies can be delayed, and customers may need to explain the same problem more than once.",
      "At the same time, shoppers looking for products may leave without buying simply because they cannot find what they need.",
      "For a busy store owner, this creates four problems:",
    ],
    problemBullets: [
      "Too much time spent answering repeated questions.",
      "Slow replies that frustrate customers.",
      "Support issues that are difficult to track.",
      "Missed opportunities to recommend relevant products.",
    ],
    solutionParagraphs: [
      "I built an AI customer chatbot that works directly on a store's website (for example Shopify, WooCommerce, or a custom website).",
      "Customers can ask questions in everyday language, and the chatbot understands what they need.",
      "It handles three main tasks automatically.",
    ],
    solutionSubsections: [
      {
        title: "1. Order Tracking",
        paragraphs: [
          "When a customer asks about an order, the chatbot requests the order ID if needed.",
          "It checks the order details in the store's database (for example Supabase, Google Sheets, Airtable, or any store database).",
          "It then provides the current order status and expected delivery information, when available.",
          "Customers get answers without waiting for someone to check the order manually.",
        ],
      },
      {
        title: "2. Customer Support",
        paragraphs: [
          "When a customer reports a problem, the chatbot collects their email address, product information, and issue details.",
          "It creates a support ticket with a unique ticket number and shares that number with the customer.",
          "The support team receives an automatic email alert (for example through Gmail or any email service).",
          "Customers can also check their ticket's progress later using the ticket number.",
          "This helps keep support requests organized and reduces the risk of missed messages.",
        ],
      },
      {
        title: "3. Product Recommendations",
        paragraphs: [
          "When a customer asks for product suggestions, the chatbot searches the store's product list.",
          "It recommends suitable products based on what the customer is looking for.",
          "For example, a customer can ask for a similar product or options within a particular category.",
          "This makes product discovery easier and creates more opportunities for customers to explore the store.",
        ],
      },
    ],
    solutionClosing: {
      title: "A More Natural Customer Experience",
      text: 'The chatbot also remembers the conversation. Customers do not have to repeat information they already shared. And when someone simply says "thanks," the chatbot responds politely and offers further help.',
    },
    resultIntro:
      "This case study shows how a store can handle common customer questions without requiring staff to respond to every message manually.",
    resultStats: [
      {
        value: "5 hrs/week",
        label: "Estimated time saved",
        assumption: "Less time spent on routine customer questions.",
      },
      {
        value: "20 hrs",
        label: "Estimated monthly time saved",
        assumption: "More time available for running the business.",
      },
    ],
    resultNote:
      "Estimated, not measured results. Assumes 200 customer messages per week, 3 minutes of manual work per message, and 50% handled automatically. Monthly estimate uses four weeks.",
    resultBenefitsTitle: "Other practical benefits:",
    resultBenefits: [
      {
        title: "Faster answers",
        text: "Customers can check order details without waiting for a manual reply.",
      },
      {
        title: "Better support tracking",
        text: "Every reported issue gets a ticket number and a record.",
      },
      {
        title: "Fewer missed requests",
        text: "The support team receives automatic alerts when customers report problems.",
      },
      {
        title: "Easier product discovery",
        text: "Customers receive relevant suggestions from the available product list.",
      },
      {
        title: "Lower routine support workload",
        text: "Staff can focus on problems that need personal attention.",
      },
    ],
    resultOutro:
      "These are expected benefits of the system, not results measured from a live client store.",
    howItWorks: [
      {
        title: "Customer sends a message",
        text: "A shopper opens the chat window on the website and asks about an order, reports a problem, or requests product suggestions.",
      },
      {
        title: "The chatbot finds the right information",
        text: "It understands the request, checks the relevant store records, or collects the details needed to create a support ticket.",
      },
      {
        title: "The customer gets a helpful response",
        text: "The chatbot shares order updates, provides a support ticket number, or recommends suitable products. If a support ticket is created, the team also receives an email alert.",
      },
    ],
    builtFor: {
      title: "Works for Any Business",
      text: "This chatbot is not limited to one type of store. It can be adapted to different businesses that sell products and handle customer questions (for example an online clothing store, electronics shop, grocery delivery business, or wholesale supplier). The product list, order records, support process, and responses can all be adjusted to fit the business.",
    },
    videoCaption:
      "Watch this walkthrough to see how the AI chatbot tracks orders, creates support tickets, and recommends products through a simple customer conversation.",
    screenshotCaption:
      "Behind the scenes: the automated process that connects customer messages with order information, support tickets, product recommendations, and team notifications.",
    visuals: [
      {
        key: "chat",
        placement: "afterSolution",
        alt: "E-commerce support chatbot conversation with order tracking, a support ticket and product recommendations",
        caption: "Example conversation (illustrative)",
      },
      {
        key: "workflow",
        placement: "afterHowItWorks",
        alt: "Workflow diagram for the e-commerce chatbot: order lookup, support ticket creation and product recommendations",
        caption:
          "Behind the scenes: the automated process that connects customer messages with order information, support tickets, product recommendations, and team notifications.",
      },
    ],
    cta: {
      heading: "Want a Chatbot Like This for Your Store?",
      paragraphs: [
        "Tell me which questions take most of your support time: order tracking, damaged or missing items, or product recommendations.",
        "On a free discovery call, we will map out a chatbot built around your store, your order data, and your support process, and I will tell you what it would take to build it.",
      ],
      buttonLabel: "Book a Free Discovery Call",
    },
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
