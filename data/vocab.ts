export type VocabItem = {
  word: string;
  meaning: string;
  example: string;
};

export const VOCAB_DATA: Record<string, VocabItem[]> = {
  'Basic': [
    { word: 'Provide', meaning: '供給する', example: 'They provided us with food.' },
    { word: 'Individual', meaning: '個々の', example: 'Each individual has rights.' },
    { word: 'Environment', meaning: '環境', example: 'Protect the environment.' },
    { word: 'Potential', meaning: '潜在的な', example: 'He has great potential.' },
    { word: 'Access', meaning: '接近、利用権', example: 'Access to the internet.' },
    { word: 'Efficient', meaning: '効率的な', example: 'This method is efficient.' },
    { word: 'Mental', meaning: '精神の', example: 'Mental health is important.' },
    { word: 'Specific', meaning: '特定の', example: 'Be more specific.' },
    { word: 'Complex', meaning: '複雑な', example: 'A complex problem.' },
    { word: 'Obvious', meaning: '明らかな', example: 'It was obvious that he was lying.' },
  ],
  'Standard': [
    { word: 'Ambiguous', meaning: '曖昧な', example: 'His reply was ambiguous.' },
    { word: 'Inevitable', meaning: '避けられない', example: 'War was inevitable.' },
    { word: 'Simultaneous', meaning: '同時の', example: 'Simultaneous interpretation.' },
    { word: 'Reluctant', meaning: '気が進まない', example: 'He was reluctant to go.' },
    { word: 'Subsequent', meaning: 'その後の', example: 'Subsequent events proved him wrong.' },
    { word: 'Crucial', meaning: '重大な', example: 'A crucial decision.' },
    { word: 'Distinguish', meaning: '区別する', example: 'Distinguish right from wrong.' },
    { word: 'Emphasis', meaning: '強調', example: 'Emphasis on quality.' },
    { word: 'Prohibit', meaning: '禁止する', example: 'Smoking is prohibited.' },
    { word: 'Relieve', meaning: '和らげる', example: 'Relieve pain.' },
  ],
  'Advanced': [
    { word: 'Deteriorate', meaning: '悪化する', example: 'His health deteriorated.' },
    { word: 'Indifferent', meaning: '無関心な', example: 'He was indifferent to politics.' },
    { word: 'Reproach', meaning: '非難する', example: 'Don’t reproach yourself.' },
    { word: 'Versatile', meaning: '多才な', example: 'A versatile actor.' },
    { word: 'Eloquent', meaning: '雄弁な', example: 'An eloquent speech.' },
    { word: 'Superfluous', meaning: '余分な', example: 'Superfluous details.' },
    { word: 'Meticulous', meaning: '綿密な', example: 'He is meticulous about his work.' },
    { word: 'Benevolent', meaning: '慈悲深い', example: 'A benevolent king.' },
    { word: 'Ephemeral', meaning: '儚い', example: 'Ephemeral beauty.' },
    { word: 'Pragmatic', meaning: '実用的な', example: 'A pragmatic approach.' },
  ],
  'Science': [
    { word: 'Hypothesis', meaning: '仮説', example: 'Test the hypothesis.' },
    { word: 'Molecule', meaning: '分子', example: 'Water molecule.' },
    { word: 'Organism', meaning: '有機体/生物', example: 'A living organism.' },
    { word: 'Synthesis', meaning: '合成/統合', example: 'Protein synthesis.' },
    { word: 'Equilibrium', meaning: '均衡/平衡', example: 'Market equilibrium.' },
    { word: 'Chromosome', meaning: '染色体', example: 'Human chromosomes.' },
    { word: 'Velocity', meaning: '速度', example: 'High velocity.' },
    { word: 'Fossil', meaning: '化石', example: 'Dinosaur fossils.' },
    { word: 'Galaxy', meaning: '銀河', example: 'The Milky Way galaxy.' },
    { word: 'Kinetic', meaning: '運動の', example: 'Kinetic energy.' },
  ]
};
