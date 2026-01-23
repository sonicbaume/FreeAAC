export const appName = "FreeAAC"

export interface BoardTemplate {
  name: string;
  author: string;
  license: string;
  description: string;
  url: string;
  size: number;
}

export const templates: BoardTemplate[] = [
  {
    name: 'CommuniKate 20',
    author: 'Kate McCallum',
    license: 'CC-BY-NC-SA',
    description: 'CommuniKate 20 is a functional communication board with 20 buttons per board created by Kate McCallum for the adult population of communicators that she serves.',
    url: 'https://data.free-aac.org/communikate-20.obz',
    size: 13473789
  },
  // {
  //   name: 'CommuniKate 12',
  //   author: 'Kate McCallum',
  //   license: 'CC-BY-NC-SA',
  //   description: 'CommuniKate 12 is a smaller version of CommuniKate 20, it has only 12 buttons per board but offers the same style of layout and functional style of communication.',
  //   url: 'https://data.free-aac.org/communikate-12.obz',
  //   size: 13034790
  // },
  // {
  //   name: 'Project Core',
  //   author: 'UNC Chapel Hill',
  //   license: 'CC-BY',
  //   description: 'Project core is a research-based initiative to ensure all communicators have at least one option for beginning core-base communication.',
  //   url: 'https://data.free-aac.org/project-core.obf',
  //   size: 740720
  // }
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