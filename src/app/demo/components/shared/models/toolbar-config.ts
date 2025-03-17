export interface ToolbarButtonConfig {
    label: string;
    icon?: string;
    position: 'left' | 'right';
    severity: string;
    visible: boolean;
    action?: () => void;
    type: 'fileUpload' | 'button'; // Button type
}

export interface ToolbarConfig {
    buttons: ToolbarButtonConfig[];
}
