import { Criterion, ResponseWithResponseCriterion, Task } from '../QuestionPageTypes';

export interface AuthContextType {
  isAuthenticated: boolean;
  workerLogin: (loginPayload: any) => Promise<void>; // Adjust the type of `loginPayload` as needed
  workerLogout: () => void;
  loading: boolean;
  error: string | null;
}

export enum MODAL {
  connect,
  wallet,
  informational,
}

export type ModalContextValue = {
  openModal: (modal: MODAL, modalOptions?: any) => void;
  closeModal: () => void;
};

export interface SubmitContextType {
  handleSubmit: (preCallback?: (flag: boolean) => void, postCallback?: (flag: boolean) => void) => void;
  handleSubmitNew: (preCallback?: (flag: boolean) => void, postCallback?: (flag: boolean) => void) => void;
  triggerTaskPageReload: boolean;
  setTriggerTaskPageReload: React.Dispatch<React.SetStateAction<boolean>>;
  submissionErr: string | null;
  resetSubmissionError: () => void;
  isSubscriptionModalLoading: boolean;
  setIsSubscriptionModalLoading: Function;
  partnerCount: number;
  setPartnerCount: React.Dispatch<React.SetStateAction<number>>;
  addCriterionForResponse: (modelId: string, criteria: Criterion, value: any) => void;
  getCriterionForResponse: () => ResponseWithResponseCriterion[];
  resetCriterionForResponse: (task: Task) => void;
}

export type RankOrder = { [key: string]: string };
