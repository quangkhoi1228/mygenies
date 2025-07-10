export interface SectionBlock {
  type: 'section';
  text?: {
    type: 'mrkdwn' | 'plain_text';
    text: string;
    emoji?: boolean;
  };
  fields?: {
    type: 'mrkdwn' | 'plain_text';
    text: string;
  }[];
  accessory?: any; // e.g., button or image
}

export interface ImageBlock {
  type: 'image';
  image_url: string;
  alt_text: string;
  title?: {
    type: 'plain_text';
    text: string;
  };
}

export interface DividerBlock {
  type: 'divider';
}

export interface ContextBlock {
  type: 'context';
  elements: (
    | {
        type: 'mrkdwn' | 'plain_text';
        text: string;
      }
    | {
        type: 'image';
        image_url: string;
        alt_text: string;
      }
  )[];
}

export interface ActionsBlock {
  type: 'actions';
  elements: {
    type: 'button';
    text: {
      type: 'plain_text';
      text: string;
    };
    value?: string;
    action_id?: string;
    url?: string;
    style?: 'primary' | 'danger';
  }[];
}

export interface HeaderBlock {
  type: 'header';
  text: {
    type: 'plain_text';
    text: string;
  };
}

export type SlackMessageType = {
  text: string;
  blocks: (
    | SectionBlock
    | ImageBlock
    | DividerBlock
    | ContextBlock
    | ActionsBlock
    | HeaderBlock
  )[];
};
