import { ExternalPathString } from "expo-router";
import { Voice } from "expo-speech";

export const appName = "FreeAAC"
export const appDescription = "A free, open-source app for people who use Augmentative and Alternative Communication"

export interface BoardTemplate {
  name: string;
  author: string;
  license: string;
  description: string;
  url: string;
  imageUrl: string;
  size: number;
}

export const templates: BoardTemplate[] = [
  {
    name: 'CommuniKate 20',
    author: 'Kate McCallum',
    license: 'CC-BY-NC-SA',
    description: 'CommuniKate 20 is a functional communication board with 20 buttons per board created by Kate McCallum for the adult population of communicators that she serves.',
    url: 'https://data.free-aac.org/communikate-20.obz',
    imageUrl: 'https://data.free-aac.org/communikate-20.png',
    size: 13473789
  },
  {
    name: 'CommuniKate 12',
    author: 'Kate McCallum',
    license: 'CC-BY-NC-SA',
    description: 'CommuniKate 12 is a smaller version of CommuniKate 20, it has only 12 buttons per board but offers the same style of layout and functional style of communication.',
    url: 'https://data.free-aac.org/communikate-12.obz',
    imageUrl: 'https://data.free-aac.org/communikate-12.png',
    size: 13034790
  },
  {
    name: 'Project Core',
    author: 'UNC Chapel Hill',
    license: 'CC-BY',
    description: 'Project core is a research-based initiative to ensure all communicators have at least one option for beginning core-base communication.',
    url: 'https://data.free-aac.org/project-core.obf',
    imageUrl: 'https://data.free-aac.org/project-core.png',
    size: 740720
  },
  {
    name: 'Quick Core 24',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Quick Core 24 is a core, motor-planning based vocabulary set with up to 24 buttons per board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/quick-core-24.obz',
    imageUrl: 'https://data.free-aac.org/quick-core-24.png',
    size: 9459924
  },
  {
    name: 'Quick Core 40',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Quick Core 40 is a core, motor-planning based vocabulary set with up to 40 buttons per board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/quick-core-40.obz',
    imageUrl: 'https://data.free-aac.org/quick-core-40.png',
    size: 35437986
  },
  {
    name: 'Quick Core 60',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Quick Core 60 is a core, motor-planning based vocabulary set with up to 60 buttons per board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/quick-core-60.obz',
    imageUrl: 'https://data.free-aac.org/quick-core-60.png',
    size: 34898633
  },
  {
    name: 'Quick Core 84',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Quick Core 84 is a core, motor-planning based vocabulary set with up to 84 buttons per board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/quick-core-84.obz',
    imageUrl: 'https://data.free-aac.org/quick-core-84.png',
    size: 70257878
  },
  {
    name: 'Quick Core 112',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Quick Core 112 is a core, motor-planning based vocabulary set with up to 112 buttons per board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/quick-core-112.obz',
    imageUrl: 'https://data.free-aac.org/quick-core-112.png',
    size: 70393954
  },
  {
    name: 'Vocal Flair 24',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Vocal Flair 24 is a core, flat-but-dynamic-styled vocabulary set with up to 24 buttons per board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/vocal-flair-24.obz',
    imageUrl: 'https://data.free-aac.org/vocal-flair-24.png',
    size: 47790492
  },
  {
    name: 'Vocal Flair 40',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Vocal Flair 40 is a core, flat-but-dynamic-styled vocabulary set with up to 40 buttons per board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/vocal-flair-40.obz',
    imageUrl: 'https://data.free-aac.org/vocal-flair-40.png',
    size: 45693565
  },
  {
    name: 'Vocal Flair 60',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Vocal Flair 60 is a core, flat-but-dynamic-styled vocabulary set with up to 60 buttons per board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/vocal-flair-60.obz',
    imageUrl: 'https://data.free-aac.org/vocal-flair-60.png',
    size: 49749643
  },
  {
    name: 'Vocal Flair 84',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Vocal Flair 84 is a core, flat-but-dynamic-styled vocabulary set with up to 84 buttons per board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/vocal-flair-84.obz',
    imageUrl: 'https://data.free-aac.org/vocal-flair-84.png',
    size: 57289383
  },
  {
    name: 'Vocal Flair 84 with Keyboard',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Vocal Flair 84 is a core, flat-but-dynamic-styled vocabulary set with up to 84 buttons per board, including a keyboard on the main board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/vocal-flair-84-with-keyboard.obz',
    imageUrl: 'https://data.free-aac.org/vocal-flair-84-with-keyboard.png',
    size: 56888236
  },
  {
    name: 'Vocal Flair 112',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Vocal Flair 112 is a core, flat-but-dynamic-styled vocabulary set with up to 112 buttons per board, including a keyboard on the main board. It has built-in progression to gradually expand the vocabulary over time.',
    url: 'https://data.free-aac.org/vocal-flair-112.obz',
    imageUrl: 'https://data.free-aac.org/vocal-flair-112.png',
    size: 56793687
  },
  {
    name: 'Sequoia 15',
    author: 'OpenAAC',
    license: 'CC-BY',
    description: 'Sequoia-15 is a branching vocabulary set, built in an effort to support communication organized by pragmatic function but with the goal of encouraging expansion into generalized and core-oriented vocabulary.',
    url: 'https://data.free-aac.org/sequoia-15.obz',
    imageUrl: 'https://data.free-aac.org/sequoia-15.png',
    size: 37270902
  }
]

export const licenseImageMap: {
  light: Record<string, any>,
  dark: Record<string, any>
} = {
  light: {
    'CC-BY': require('../../assets/images/cc/light/by.png'),
    'CC-BY-NC': require('../../assets/images/cc/light/by-nc.png'),
    'CC-BY-NC-SA': require('../../assets/images/cc/light/by-nc-sa.png'),
    'CC-BY-ND': require('../../assets/images/cc/light/by-nd.png'),
    'CC-BY-SA': require('../../assets/images/cc/light/by-sa.png'),
    'CC-BY-NC-ND': require('../../assets/images/cc/light/by-nc-nd.png')
  },
  dark: {
    'CC-BY': require('../../assets/images/cc/dark/by.png'),
    'CC-BY-NC': require('../../assets/images/cc/dark/by-nc.png'),
    'CC-BY-NC-SA': require('../../assets/images/cc/dark/by-nc-sa.png'),
    'CC-BY-ND': require('../../assets/images/cc/dark/by-nd.png'),
    'CC-BY-SA': require('../../assets/images/cc/dark/by-sa.png'),
    'CC-BY-NC-ND': require('../../assets/images/cc/dark/by-nc-nd.png')
  }
}

export const licenseLinkMap: Record<string, ExternalPathString> = {
  'CC-BY': 'https://creativecommons.org/licenses/by/4.0/',
  'CC-BY-NC': 'https://creativecommons.org/licenses/by-nc/4.0/',
  'CC-BY-NC-SA': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  'CC-BY-ND': 'https://creativecommons.org/licenses/by-nd/4.0/',
  'CC-BY-SA': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC-BY-NC-ND': 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
}

export const korokoVoices: Pick<Voice, 'identifier' | 'name' | 'language'>[] = [
  {
    identifier: 'af_heart',
    name: '🇺🇸 Heart',
    language: 'en-US'
  }, {
    identifier: 'af_river',
    name: '🇺🇸 River',
    language: 'en-US'
  }, {
    identifier: 'af_sarah',
    name: '🇺🇸 Sarah',
    language: 'en-US'
  }, {
    identifier: 'am_adam',
    name: '🇺🇸 Adam',
    language: 'en-US'
  }, {
    identifier: 'am_michael',
    name: '🇺🇸 Michael',
    language: 'en-US'
  }, {
    identifier: 'am_santa',
    name: '🇺🇸 Santa',
    language: 'en-US'
  }, {
    identifier: 'bf_emma',
    name: '🇬🇧 Emma',
    language: 'en-GB'
  }, {
    identifier: 'bm_daniel',
    name: '🇬🇧 Daniel',
    language: 'en-GB'
  }
]

export const speechRateValues = [
  { value: '0.5', label: 'Very slow' },
  { value: '0.8', label: 'Slow' },
  { value: '1.0', label: 'Normal' },
  { value: '1.2', label: 'Fast' },
  { value: '1.5', label: 'Very fast' }
]

export const speechPitchValues = [
  { value: '0.5', label: 'Very low' },
  { value: '0.8', label: 'Low' },
  { value: '1.0', label: 'Normal' },
  { value: '1.2', label: 'High' },
  { value: '1.5', label: 'Very high' }
]