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
  isDemo: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "real-estate-lead-response",
    title: "Real Estate: Lead Response from 2 Hours to 2 Minutes",
    industry: "Real Estate",
    metric: "2 min",
    metricLabel: "lead response time",
    shortDescription:
      "Demo project showing an automated lead response workflow for a real estate team.",
    problem:
      "A demo real estate team receives leads from several portals and ad campaigns. Without a central intake process, new enquiries sit in shared inboxes for up to two hours, so interested buyers often speak to a competing agent first.",
    solution:
      "A demo n8n workflow collects every new lead, enriches the record with basic details, and routes it to the right agent. The lead receives an instant acknowledgement while the CRM creates a follow-up task and notifies the team in real time.",
    result:
      "In the simulated scenario, the first response time drops from roughly two hours to about two minutes. The demo also assumes fewer missed follow-ups because every lead has an owner and a visible next step.",
    loomUrl: "",
    screenshot: "",
    isDemo: true,
  },
  {
    slug: "dental-clinic-no-shows",
    title: "Dental Clinic: 40% Fewer No-Shows",
    industry: "Healthcare",
    metric: "40%",
    metricLabel: "fewer no-shows",
    shortDescription:
      "Demo project showing automated appointment reminders for a dental clinic.",
    problem:
      "A demo dental clinic relies on manual reminder calls and a paper appointment book. Last-minute cancellations leave gaps in the schedule, and the front desk spends hours chasing confirmations each week.",
    solution:
      "A demo reminder workflow sends SMS and email confirmations at set intervals before each appointment. Patients can reschedule with one link, and the clinic calendar and CRM update automatically when they respond.",
    result:
      "The simulated scenario estimates 40% fewer no-shows and a lighter admin load for reception. The demo assumes that any remaining gaps can be offered to a waitlist automatically.",
    loomUrl: "",
    screenshot: "",
    isDemo: true,
  },
  {
    slug: "agency-crm",
    title: "Agency CRM: 15 Hours/Week Saved",
    industry: "Marketing Agency",
    metric: "15 hrs/week",
    metricLabel: "saved per week",
    shortDescription:
      "Demo project showing a custom CRM that removes repetitive agency admin.",
    problem:
      "A demo marketing agency tracks clients across spreadsheets, inboxes, and separate project tools. Account managers copy the same updates into several places, which creates delays and makes reporting inconsistent.",
    solution:
      "A demo custom CRM centralises client intake, project status, and approvals. n8n automations keep the CRM, project board, and reporting dashboard in sync without manual copy-paste.",
    result:
      "The simulated scenario estimates 15 hours per week saved across the account team. The demo assumes fewer status meetings because client updates are generated and shared automatically.",
    loomUrl: "",
    screenshot: "",
    isDemo: true,
  },
  {
    slug: "ecommerce-invoices",
    title: "E-commerce: Invoices and Reminders 100% Automatic",
    industry: "E-commerce",
    metric: "100%",
    metricLabel: "automatic invoicing",
    shortDescription:
      "Demo project showing fully automated invoicing and payment reminders.",
    problem:
      "A demo online store creates invoices manually after each order and sends payment reminders by hand. During busy periods, invoices are delayed and reminders are easy to miss.",
    solution:
      "A demo automation triggers invoice creation from each order event, sends the invoice to the customer, and schedules reminders until payment is received. Failed or overdue payments are flagged in a simple dashboard.",
    result:
      "In the simulated scenario, 100% of demo invoices and reminders are sent without manual work. The estimate assumes fewer late payments because every order follows the same automated follow-up sequence.",
    loomUrl: "",
    screenshot: "",
    isDemo: true,
  },
  {
    slug: "support-bot",
    title: "Support Bot: 70% of Queries Solved Without a Human",
    industry: "Customer Support",
    metric: "70%",
    metricLabel: "queries solved by the bot",
    shortDescription:
      "Demo project showing a support bot that resolves common questions instantly.",
    problem:
      "A demo support team answers the same setup and billing questions every day. Repetitive tickets slow down complex cases and make response times hard to predict.",
    solution:
      "A demo retrieval-based support bot answers common questions using an approved knowledge base. When a query falls outside its scope, it collects context and hands the ticket to a human with the conversation attached.",
    result:
      "The simulated scenario estimates that 70% of demo queries are resolved without a human. The remaining tickets reach the team with more context, which the demo assumes reduces handling time.",
    loomUrl: "",
    screenshot: "",
    isDemo: true,
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
