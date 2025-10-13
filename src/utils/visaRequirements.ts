export interface DocumentRequirement {
  id: string;
  label: string;
  description: string;
  required: boolean;
  category: 'identification' | 'immigration' | 'employment' | 'financial' | 'other';
}

export interface VisaRequirements {
  eligibility: 'eligible' | 'eligible_limited' | 'not_eligible';
  requiredDocuments: DocumentRequirement[];
}

export const VISA_REQUIREMENTS: Record<string, VisaRequirements> = {
  'British Citizen': {
    eligibility: 'eligible',
    requiredDocuments: [
      {
        id: 'passport',
        label: 'Passport or National ID',
        description: 'UK passport or national identity card',
        required: true,
        category: 'identification'
      }
    ]
  },
  'EU Settlement Scheme': {
    eligibility: 'eligible',
    requiredDocuments: [
      {
        id: 'passport',
        label: 'Passport',
        description: 'Valid EU passport or national ID',
        required: true,
        category: 'identification'
      },
      {
        id: 'settlement_document',
        label: 'Settlement Document',
        description: 'Settled or pre-settled status document',
        required: true,
        category: 'immigration'
      }
    ]
  },
  'Skilled Worker': {
    eligibility: 'eligible',
    requiredDocuments: [
      {
        id: 'passport',
        label: 'Passport',
        description: 'Valid passport',
        required: true,
        category: 'identification'
      },
      {
        id: 'brp',
        label: 'Biometric Residence Permit (BRP)',
        description: 'Current BRP card',
        required: true,
        category: 'immigration'
      },
      {
        id: 'right_to_rent_code',
        label: 'Right to Rent Share Code',
        description: 'Gov.uk right to rent share code',
        required: true,
        category: 'immigration'
      },
      {
        id: 'payslips',
        label: '3 Recent Payslips or Bank Statements',
        description: '3 consecutive months of payslips or open banking',
        required: true,
        category: 'financial'
      },
      {
        id: 'employer_letter',
        label: 'Employer Letter',
        description: 'Letter from employer confirming employment',
        required: true,
        category: 'employment'
      }
    ]
  },
  'Health and Care Worker': {
    eligibility: 'eligible',
    requiredDocuments: [
      {
        id: 'passport',
        label: 'Passport',
        description: 'Valid passport',
        required: true,
        category: 'identification'
      },
      {
        id: 'brp',
        label: 'Biometric Residence Permit (BRP)',
        description: 'Current BRP card',
        required: true,
        category: 'immigration'
      },
      {
        id: 'right_to_rent_code',
        label: 'Right to Rent Share Code',
        description: 'Gov.uk right to rent share code',
        required: true,
        category: 'immigration'
      },
      {
        id: 'employer_contract',
        label: 'Employment Contract/Letter',
        description: 'NHS or care sector employment contract',
        required: true,
        category: 'employment'
      },
      {
        id: 'payslips',
        label: '3 Recent Payslips or Bank Statements',
        description: '3 consecutive months of payslips or open banking',
        required: true,
        category: 'financial'
      }
    ]
  },
  'Student Visa': {
    eligibility: 'eligible_limited',
    requiredDocuments: [
      {
        id: 'passport',
        label: 'Passport',
        description: 'Valid passport',
        required: true,
        category: 'identification'
      },
      {
        id: 'brp',
        label: 'Biometric Residence Permit (BRP)',
        description: 'Current student BRP card',
        required: true,
        category: 'immigration'
      },
      {
        id: 'right_to_rent_code',
        label: 'Right to Rent Share Code',
        description: 'Gov.uk right to rent share code',
        required: true,
        category: 'immigration'
      },
      {
        id: 'enrollment_letter',
        label: 'University Enrollment Letter',
        description: 'Letter confirming current enrollment',
        required: true,
        category: 'employment'
      },
      {
        id: 'financial_evidence',
        label: 'Financial Evidence',
        description: 'Bank statements or financial sponsorship',
        required: true,
        category: 'financial'
      },
      {
        id: 'guarantor',
        label: 'Guarantor (if required)',
        description: 'UK-based guarantor information',
        required: false,
        category: 'other'
      }
    ]
  },
  'Global Talent': {
    eligibility: 'eligible',
    requiredDocuments: [
      {
        id: 'passport',
        label: 'Passport',
        description: 'Valid passport',
        required: true,
        category: 'identification'
      },
      {
        id: 'brp',
        label: 'Biometric Residence Permit (BRP)',
        description: 'Current BRP card',
        required: true,
        category: 'immigration'
      },
      {
        id: 'right_to_rent_code',
        label: 'Right to Rent Share Code',
        description: 'Gov.uk right to rent share code',
        required: true,
        category: 'immigration'
      },
      {
        id: 'endorsement',
        label: 'Visa Endorsement/Grant',
        description: 'Endorsement letter or visa grant notice',
        required: true,
        category: 'immigration'
      },
      {
        id: 'financial_proof',
        label: 'Proof of Income or Savings',
        description: 'Bank statements or income evidence',
        required: true,
        category: 'financial'
      }
    ]
  }
};

export const getVisaRequirements = (visaType: string | null): VisaRequirements => {
  if (!visaType) {
    return {
      eligibility: 'not_eligible',
      requiredDocuments: []
    };
  }

  return VISA_REQUIREMENTS[visaType] || {
    eligibility: 'not_eligible',
    requiredDocuments: []
  };
};

export const isPassportAlreadyProvided = (hasIdentityVerification: boolean): boolean => {
  // If identity verification is complete, assume passport was used
  return hasIdentityVerification;
};