export interface HistoricalSubnetEmission {
  blockNumber: number;
  blockTime: number;
  totalEmissions: number;
}

export interface HistoricalEmission {
  blockNumber: number;
  blockTime: number;
  emission: number;
}
export interface SubnetData {
  id: number;
  totalEmissions: number;
  minerCount: number;
  maxAllowedKeys: number;
  maxActiveValidators: number;
  maxActiveMiners: number;
  emissionPct: number;
  registerCost: number;
  owner: string;
  historicalSubnetEmissions: HistoricalSubnetEmission[];
  nonRootNeurons: NonRootNeuronObj[];
  subnetValidatorWeightAssignments: {
    weight: number;
    owner: string;
    stakedAmt: number;
    hotkey: string;
  }[];
}

export interface NonRootNeuronObj {
  totalEmission: number;
  position: any;
  uid: number;
  hotkey: string;
  rank: number;
  emission: number;
  stakedAmt: number;
  minerWeight: number;
  performanceData: number[];
  historicalEmissions: HistoricalEmission[];
  coldkey: string;

  netuid: number;
  active: boolean;
  incentive: number;
  consensus: number;
  trust: number;
  validatorTrust: number;
  dividends: number;
  lastUpdate: number;
  validatorPermit: boolean;
  owner: string;
}
