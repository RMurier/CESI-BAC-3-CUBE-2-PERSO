import { Feather } from '@expo/vector-icons';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

export interface Emotion {
    id: number;
    nom: string;
    description: string;
    icon: FeatherIconName;
  };
  