import { CriterionWithResponses, Task } from '../QuestionPageTypes';

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
}

export type ModalContextValue = {
  openModal: (modal: MODAL) => void;
  closeModal: () => void;
};

export interface SubmitContextType {
  multiSelectData: string[];
  rankingData: any;
  scoreData: number;
  multiScore: { [key: string]: number };
  updateMultiSelect: (data: string[]) => void;
  updateRanking: (data: string[]) => void;
  updateScore: (score: number) => void;
  updateMultiScore: (data: { [key: string]: number }) => void;
  handleSubmit: Function;
  handleSubmitNew: () => void;
  triggerTaskPageReload: boolean;
  setTriggerTaskPageReload: React.Dispatch<React.SetStateAction<boolean>>;
  submissionErr: string | null;
  resetSubmissionError: () => void;
  isSubscriptionModalLoading: boolean;
  setIsSubscriptionModalLoading: Function;
  partnerCount: number;
  setPartnerCount: React.Dispatch<React.SetStateAction<number>>;
  isMultiSelectQuestion: boolean;
  isRankQuestion: boolean;
  isMultiScore: boolean;
  isSlider: boolean;
  handleSetIsMultiSelectQuestion: (value: boolean) => void;
  handleSetIsRankQuestion: (value: boolean) => void;
  handleSetIsMultiScore: (value: boolean) => void;
  handleSetIsSlider: (value: boolean) => void;
  maxMultiScore: number;
  minMultiScore: number;
  handleMaxMultiScore: (value: number) => void;
  handleMinMultiScore: (value: number) => void;
  addCriterionForResponse: (index: string, value: string) => void;
  getCriterionForResponse: () => CriterionWithResponses[];
  resetCriterionForResponse: (task: Task) => void;
}

export type RankOrder = { [key: string]: string };
