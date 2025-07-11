/**
 * Topics database with facts, theories, and paradoxes for various subjects
 */

export const topics = {
  // General categories that can be used for any topic
  general: {
    facts: [
      "The human brain contains approximately 86 billion neurons, each making thousands of connections.",
      "More information has been created in the last two years than in all of human history combined.",
      "The concept of 'deep thinking' actually activates the same neural networks as dreaming.",
      "Questions often teach us more than answers because they force us to examine our assumptions.",
      "The word 'philosophy' literally means 'love of wisdom' in ancient Greek."
    ],
    theories: [
      "The theory of emergent complexity suggests that simple rules can create incredibly complex behaviors.",
      "Information theory proposes that the universe might be fundamentally computational in nature.",
      "Cognitive load theory explains why we learn better when information is presented in structured chunks.",
      "The theory of multiple intelligences suggests there are many different ways to be smart.",
      "Social constructivism theory proposes that knowledge is built through social interaction and shared understanding."
    ],
    paradoxes: [
      "The more we learn, the more we realize how little we know.",
      "Teaching someone often teaches us more than the person we're teaching.",
      "The question 'Why is there something rather than nothing?' cannot be answered without assuming there's something to provide the answer.",
      "We use language to describe the limitations of language.",
      "The harder we try to be spontaneous, the less spontaneous we become."
    ],
    deepQuestions: [
      "What is the relationship between knowledge and wisdom?",
      "How do we know what we know, and how do we know that we know it?",
      "Is understanding something the same as being able to explain it to others?",
      "What makes a question more valuable than an answer?",
      "How does the act of observing or questioning something change the thing itself?"
    ]
  },

  // Technology and AI
  technology: {
    facts: [
      "The first computer bug was an actual bug - a moth trapped in a computer relay in 1947.",
      "AI systems can now generate text, images, and even code that's indistinguishable from human-created content.",
      "The internet processes over 2.5 quintillion bytes of data every single day.",
      "Modern smartphones have more computing power than the computers used for the Apollo 11 moon landing."
    ],
    theories: [
      "Moore's Law suggests that computing power doubles approximately every two years.",
      "The technological singularity theory proposes that AI will eventually surpass human intelligence.",
      "Network effect theory explains how technologies become more valuable as more people use them.",
      "The theory of technological determinism suggests that technology shapes society more than society shapes technology."
    ],
    paradoxes: [
      "The more connected we become through technology, the more isolated we sometimes feel.",
      "We create AI to make our lives easier, but worry it might make human intelligence obsolete.",
      "Digital storage can preserve information forever, yet digital formats become obsolete faster than physical ones.",
      "The internet gives us access to all human knowledge, yet misinformation spreads faster than truth."
    ],
    deepQuestions: [
      "As AI becomes more human-like, what makes us uniquely human?",
      "If an AI can create art, literature, or music, is it truly creative or just mimicking creativity?",
      "What responsibilities do we have toward AI systems that can learn and adapt?",
      "How do we maintain human agency in a world increasingly shaped by algorithms?"
    ]
  },

  // Philosophy and existence
  philosophy: {
    facts: [
      "The word 'philosophy' comes from the Greek 'philosophia,' meaning 'love of wisdom.'",
      "Socrates claimed he knew nothing, which became known as Socratic ignorance.",
      "The trolley problem, a famous ethical thought experiment, was first introduced in 1967.",
      "Descartes' famous statement 'I think, therefore I am' was his response to radical skepticism."
    ],
    theories: [
      "Existentialism suggests that existence precedes essence - we exist first, then define ourselves.",
      "Determinism proposes that all events are the result of prior causes, questioning free will.",
      "Utilitarianism argues that actions are right if they produce the greatest good for the greatest number.",
      "Phenomenology focuses on the structures of consciousness and experience."
    ],
    paradoxes: [
      "If everything is determined, how can we be held responsible for our actions?",
      "The statement 'I know that I know nothing' creates a logical contradiction.",
      "We seek meaning in life, but meaning itself might be meaningless without a conscious observer.",
      "Free will requires the ability to have chosen differently, but we can never test if we could have."
    ],
    deepQuestions: [
      "What is the relationship between consciousness and reality?",
      "If we could know everything, would life lose its meaning?",
      "Is there a difference between existing and living?",
      "What makes an action moral - its consequences, intentions, or something else?"
    ]
  }
};

/**
 * Get random content from a specific category and type
 * @param {string} category - The category (general, technology, philosophy, etc.)
 * @param {string} type - The type (facts, theories, paradoxes, deepQuestions)
 * @param {number} count - Number of items to return
 * @returns {Array} Random items from the specified category and type
 */
export const getRandomTopicContent = (category, type, count = 1) => {
  const categoryData = topics[category] || topics.general;
  const typeData = categoryData[type] || categoryData.facts;
  
  const shuffled = [...typeData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get a complete topic structure for a given category
 * @param {string} category - The category to get content from
 * @returns {Object} Object containing facts, theories, paradoxes, and deep questions
 */
export const getTopicStructure = (category) => {
  const categoryData = topics[category] || topics.general;
  
  return {
    facts: getRandomTopicContent(category, 'facts', 2),
    theories: getRandomTopicContent(category, 'theories', 2),
    paradoxes: getRandomTopicContent(category, 'paradoxes', 2),
    deepQuestions: getRandomTopicContent(category, 'deepQuestions', 1)
  };
};

/**
 * Determine topic category based on user input
 * @param {string} userMessage - The user's message
 * @returns {string} The most appropriate topic category
 */
export const determineTopicCategory = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Technology-related keywords
  if (message.includes('ai') || message.includes('computer') || message.includes('technology') || 
      message.includes('internet') || message.includes('digital') || message.includes('algorithm') ||
      message.includes('robot') || message.includes('code') || message.includes('programming')) {
    return 'technology';
  }
  
  // Philosophy-related keywords
  if (message.includes('meaning') || message.includes('existence') || message.includes('consciousness') ||
      message.includes('reality') || message.includes('moral') || message.includes('ethics') ||
      message.includes('philosophy') || message.includes('think') || message.includes('believe') ||
      message.includes('truth') || message.includes('knowledge') || message.includes('wisdom')) {
    return 'philosophy';
  }
  
  // Default to general
  return 'general';
};/**
 * Topics database with facts, theories, and paradoxes for various subjects
 */

export const topics = {
  // General categories that can be used for any topic
  general: {
    facts: [
      "The human brain contains approximately 86 billion neurons, each making thousands of connections.",
      "More information has been created in the last two years than in all of human history combined.",
      "The concept of 'deep thinking' actually activates the same neural networks as dreaming.",
      "Questions often teach us more than answers because they force us to examine our assumptions.",
      "The word 'philosophy' literally means 'love of wisdom' in ancient Greek."
    ],
    theories: [
      "The theory of emergent complexity suggests that simple rules can create incredibly complex behaviors.",
      "Information theory proposes that the universe might be fundamentally computational in nature.",
      "Cognitive load theory explains why we learn better when information is presented in structured chunks.",
      "The theory of multiple intelligences suggests there are many different ways to be smart.",
      "Social constructivism theory proposes that knowledge is built through social interaction and shared understanding."
    ],
    paradoxes: [
      "The more we learn, the more we realize how little we know.",
      "Teaching someone often teaches us more than the person we're teaching.",
      "The question 'Why is there something rather than nothing?' cannot be answered without assuming there's something to provide the answer.",
      "We use language to describe the limitations of language.",
      "The harder we try to be spontaneous, the less spontaneous we become."
    ],
    deepQuestions: [
      "What is the relationship between knowledge and wisdom?",
      "How do we know what we know, and how do we know that we know it?",
      "Is understanding something the same as being able to explain it to others?",
      "What makes a question more valuable than an answer?",
      "How does the act of observing or questioning something change the thing itself?"
    ]
  },

  // Technology and AI
  technology: {
    facts: [
      "The first computer bug was an actual bug - a moth trapped in a computer relay in 1947.",
      "AI systems can now generate text, images, and even code that's indistinguishable from human-created content.",
      "The internet processes over 2.5 quintillion bytes of data every single day.",
      "Modern smartphones have more computing power than the computers used for the Apollo 11 moon landing."
    ],
    theories: [
      "Moore's Law suggests that computing power doubles approximately every two years.",
      "The technological singularity theory proposes that AI will eventually surpass human intelligence.",
      "Network effect theory explains how technologies become more valuable as more people use them.",
      "The theory of technological determinism suggests that technology shapes society more than society shapes technology."
    ],
    paradoxes: [
      "The more connected we become through technology, the more isolated we sometimes feel.",
      "We create AI to make our lives easier, but worry it might make human intelligence obsolete.",
      "Digital storage can preserve information forever, yet digital formats become obsolete faster than physical ones.",
      "The internet gives us access to all human knowledge, yet misinformation spreads faster than truth."
    ],
    deepQuestions: [
      "As AI becomes more human-like, what makes us uniquely human?",
      "If an AI can create art, literature, or music, is it truly creative or just mimicking creativity?",
      "What responsibilities do we have toward AI systems that can learn and adapt?",
      "How do we maintain human agency in a world increasingly shaped by algorithms?"
    ]
  },

  // Philosophy and existence
  philosophy: {
    facts: [
      "The word 'philosophy' comes from the Greek 'philosophia,' meaning 'love of wisdom.'",
      "Socrates claimed he knew nothing, which became known as Socratic ignorance.",
      "The trolley problem, a famous ethical thought experiment, was first introduced in 1967.",
      "Descartes' famous statement 'I think, therefore I am' was his response to radical skepticism."
    ],
    theories: [
      "Existentialism suggests that existence precedes essence - we exist first, then define ourselves.",
      "Determinism proposes that all events are the result of prior causes, questioning free will.",
      "Utilitarianism argues that actions are right if they produce the greatest good for the greatest number.",
      "Phenomenology focuses on the structures of consciousness and experience."
    ],
    paradoxes: [
      "If everything is determined, how can we be held responsible for our actions?",
      "The statement 'I know that I know nothing' creates a logical contradiction.",
      "We seek meaning in life, but meaning itself might be meaningless without a conscious observer.",
      "Free will requires the ability to have chosen differently, but we can never test if we could have."
    ],
    deepQuestions: [
      "What is the relationship between consciousness and reality?",
      "If we could know everything, would life lose its meaning?",
      "Is there a difference between existing and living?",
      "What makes an action moral - its consequences, intentions, or something else?"
    ]
  }
};

/**
 * Get random content from a specific category and type
 * @param {string} category - The category (general, technology, philosophy, etc.)
 * @param {string} type - The type (facts, theories, paradoxes, deepQuestions)
 * @param {number} count - Number of items to return
 * @returns {Array} Random items from the specified category and type
 */
export const getRandomTopicContent = (category, type, count = 1) => {
  const categoryData = topics[category] || topics.general;
  const typeData = categoryData[type] || categoryData.facts;
  
  const shuffled = [...typeData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get a complete topic structure for a given category
 * @param {string} category - The category to get content from
 * @returns {Object} Object containing facts, theories, paradoxes, and deep questions
 */
export const getTopicStructure = (category) => {
  const categoryData = topics[category] || topics.general;
  
  return {
    facts: getRandomTopicContent(category, 'facts', 2),
    theories: getRandomTopicContent(category, 'theories', 2),
    paradoxes: getRandomTopicContent(category, 'paradoxes', 2),
    deepQuestions: getRandomTopicContent(category, 'deepQuestions', 1)
  };
};

/**
 * Determine topic category based on user input
 * @param {string} userMessage - The user's message
 * @returns {string} The most appropriate topic category
 */
export const determineTopicCategory = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Technology-related keywords
  if (message.includes('ai') || message.includes('computer') || message.includes('technology') || 
      message.includes('internet') || message.includes('digital') || message.includes('algorithm') ||
      message.includes('robot') || message.includes('code') || message.includes('programming')) {
    return 'technology';
  }
  
  // Philosophy-related keywords
  if (message.includes('meaning') || message.includes('existence') || message.includes('consciousness') ||
      message.includes('reality') || message.includes('moral') || message.includes('ethics') ||
      message.includes('philosophy') || message.includes('think') || message.includes('believe') ||
      message.includes('truth') || message.includes('knowledge') || message.includes('wisdom')) {
    return 'philosophy';
  }
  
  // Default to general
  return 'general';
};