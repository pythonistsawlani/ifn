// Terms & Conditions configuration
// Verbatim legal text issued by ICFAI Incubator / IIEC for the IEN Platform.
// Increment CURRENT_TERMS_VERSION when any terms clauses change to mandate re-acceptance.
export const CURRENT_TERMS_VERSION = 1

export const TERMS_STEPS = {
  1: {
    title: 'Notice for Collection and Processing of Personal Data',
    subtitle: '(Issued in strict compliance with Section 5 of the Digital Personal Data Protection Act, 2023)',
    category: 'Step 1 of 3: Privacy & Data Protection Notice',
    description: 'Notice regarding the collection, storage, and processing of personal and professional data under the DPDP Act, 2023.',
    checkboxText: 'I am over 18 years of age. I have read the Step 1 Consent Notice and grant express, revocable permission under the DPDP Act, 2023, for the Institution to process my data and enable cross-user profile visibility as stated above.',
    sections: [
      {
        heading: 'Consent Notice',
        content: 'By creating an account on the ICFAI Entrepreneurs Network (IEN) Platform, you hereby grant express, unambiguous, and revocable consent to the Institution to collect, store, and process your personal data. This includes your itemized records: name, contact details, academic/professional history, institutional affiliation and specialized ecosystem data (including business plans, sector specializations, startup investment thresholds, and net-worth declarations for verified external mentors/investors).',
      },
      {
        heading: 'Purpose Limitation',
        content: 'Your data will be processed solely to facilitate networking, mentorship, startup tracking, and investor matching within the official institutional ecosystem.',
      },
      {
        heading: 'Profile Visibility',
        content: 'You grant explicit consent for your professional profile details to be searchable and visible to other verified members of this network. Your direct contact information (email and phone number) remains hidden by default and will only be shared when you explicitly accept a mutual connection request.',
      },
      {
        heading: 'Data Processors',
        content: 'You acknowledge that the Institution utilizes secure, authorized third-party cloud hosting infrastructure and automated communication gateways as data processors to run the system.',
      },
      {
        heading: 'Your Rights',
        content: 'You retain the absolute right to access, correct, or request the erasure of your personal data at any time. For withdrawals of consent or data grievances, please contact our designated Grievance Officer at ia.iiec@ifheindia.org. Access to the platform may be restricted upon withdrawal of necessary processing data.',
      },
    ],
  },

  2: {
    title: 'Terms of Use / Ecosystem Code of Conduct & Intellectual Property Protection/s',
    subtitle: '(Issued in strict compliance with the platform governance rules to safeguard institutional and founder interests)',
    category: 'Step 2 of 3: Platform Governance & IP Protections',
    description: 'Governance policies, community code of conduct, and strict intellectual property safeguards.',
    checkboxText: 'I have read the Step 2 Terms of Use & Ecosystem Code of Conduct. I agree to abide by the non-spamming/non-poaching directives and acknowledge the strict intellectual property protections safeguarding both institutional assets and student founder pitch decks.',
    sections: [
      {
        heading: 'Commercial Use Restrictions',
        content: 'This digital environment is exclusively designated for educational networking, legitimate mentorship, and startup acceleration. You are strictly prohibited from using the internal user directory, direct messaging services, or contact networks to broadcast unsolicited commercial advertisements, marketing pitches, bulk recruitment requests, or job poaching campaigns.',
      },
      {
        heading: 'Enforcement Actions',
        content: 'Any verified report of commercial spamming, unauthorized outreach, data scraping, or poaching will result in immediate, permanent account termination and inclusion on formal institutional block lists.',
      },
      {
        heading: 'Institutional Assets Ownership',
        content: 'All software source code, platform interfaces, database structures, graphic tokens, visual identities, and technical documentation comprise the exclusive proprietary intellectual property of the Institution.',
      },
      {
        heading: 'Founder IP Protections',
        content: 'All proprietary materials, business plans, financial models, and creative pitch decks uploaded by student founders or incubation teams remain the exclusive property of their respective originators.',
      },
      {
        heading: 'Prohibition on Plagiarism',
        content: 'No member, external investor, or alumnus may duplicate, pirate, plagiarize, distribute, or reverse-engineer any student startup project or pitch deck encountered on this platform without formal, written bilateral contracts executed outside this platform.',
      },
    ],
  },

  3: {
    title: 'Institutional Liability Disclaimer and Risk Allocation',
    subtitle: '(Platform intermediary protections and institutional risk allocation)',
    category: 'Step 3 of 3: Legal Disclaimers & Risk Allocation',
    description: 'Intermediary status, investment disclaimers, bilateral contract requirements, and liability allocation.',
    checkboxText: 'I have read the Step 3 Institutional Liability Disclaimer. I accept that the platform functions purely as a networking facilitator, and I hereby waive any right to claim university liability for external investment performance, financial disputes, or offline business engagements.',
    sections: [
      {
        heading: 'No Funding or Performance Guarantee',
        content: 'The Institution provides this digital platform strictly as a collaborative facilitator to connect current students and alumni across ICFAI institutions. The presence of internal alumni mentors or alumni investors does not constitute a financial endorsement, credit guarantee, or official verification of their commercial standing by IIEC, the host university, or the ICFAI ecosystem. IIEC provides no warranty or guarantee that any current student or alumnus project will receive seed funding, financial grants, or investment matches through its utilization. All financial decisions and equity investments are conducted solely at your own commercial and legal risk.',
      },
      {
        heading: 'Absolute Immunity for User-Generated Content & Administrative Rights',
        content: 'IIEC, its management, and the Central Information Technology (CIT) Department teams operate strictly as an intermediary. The owners of the IEN platform shall not be held liable for any offensive, misleading, or fraudulent content or comments posted by users. Platform administrators retain absolute freedom, unilateral discretion, and immediate statutory authority to delete any such non-compliant content and permanently terminate the platform membership and dashboard access of any current student or alumnus who violates these ecosystem standards, without prior notice.',
      },
      {
        heading: 'Waiver of Liability for Offline and Online Arrangements',
        content: 'All financial discussions, equity investments, term sheet negotiations, or partnerships initiated or explored via this network are conducted solely at your own commercial and legal risk. IIEC, its management, directors, and its promoting university ecosystem completely disclaim all legal liability, financial loss, fraud claims, or contract breaches arising out of any independent offline or online interactions, joint ventures, or separate commercial contracts executed between platform users.',
      },
      {
        heading: 'Requirement of Separate MOU or Agreement',
        content: 'If any formal collaboration, project partnership, or resource sharing is pursued by users through this network, such arrangements shall be subject to a separate, legally binding Memorandum of Understanding (MOU) or formal Agreement entered into directly between the participating student and alumnus parties. IIEC shall not automatically be a party to, nor have any liability under, any such independent agreements, unless IIEC explicitly elects to participate as a signing party to support institutional funding, incubation, or intellectual property arrangements.',
      },
      {
        heading: 'Platform "As-Is" Status and Downtime',
        content: 'While the Central IT (CIT) department maintains standard security architectures and conducts regular technical checks, the platform is provided on an "as-is" and "as-available" basis. IIEC disclaims all liability for sudden platform downtimes, transmission errors, data corruption events, or malicious cyber incidents that result in temporary system unavailability.',
      },
    ],
  },
}

// Retained for backwards compatibility if needed
export const AGREEMENT_TEXTS = {
  1: TERMS_STEPS[1].sections.map(s => `**${s.heading}**\n${s.content}`).join('\n\n'),
  2: TERMS_STEPS[2].sections.map(s => `**${s.heading}**\n${s.content}`).join('\n\n'),
  3: TERMS_STEPS[3].sections.map(s => `**${s.heading}**\n${s.content}`).join('\n\n'),
}