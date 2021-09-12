
export interface IOTDevice {

    id: string;
    ipAddress?: string;
    uptimeSeconds?: number;
    interfaces?: IOTInterface[]
}

export type IOTInterface = { id: string; type: string } & (
    IOTValueProbe | IOTSwitch
);

export interface IOTValueProbe  {
    type: 'probe';
    value?: number;
}

export interface IOTSwitch {
    type: 'switch'
    state?: boolean;
}

export type IOTInterfaceType = 'probe' | 'switch';

