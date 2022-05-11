
type ItemWidth = 1 | 2 | 3 | 4 | 5 | 6;

export type DashboardItem = {
    id: number;
    type: string;
    width: ItemWidth;
    iface?: string;
} & ({
    type: 'gauge';
} | {
    type: 'chart';
});
