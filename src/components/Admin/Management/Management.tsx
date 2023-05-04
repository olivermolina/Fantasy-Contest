import React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { ReferralCode, TransactionType, User, UserType } from '@prisma/client';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

export interface ManagementBaseProps {
  /**
   * List of users to be selected
   */
  users: ProfileManagementUser[];
  /**
   * Boolean to show loading state in the select component
   */
  isLoading: boolean;
  /**
   * A React hook for selected userId
   */
}

export const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));
export const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));
export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export type UserManagementBaseInputs = {
  user: User | string;
};

export interface AddRemoveWithdrawableInputs extends UserManagementBaseInputs {
  amount: number;
  transactionType: TransactionType;
}

export interface FreeCreditInputs extends UserManagementBaseInputs {
  creditAmount: number;
}

export type ManagementInputs = AddRemoveWithdrawableInputs & FreeCreditInputs;

export interface ProfileManagementUser {
  id: string;
  email: string;
  username: string | null;
  referral: string | null;
  referralCodes: ReferralCode[];
  type: UserType;
}
