/**
 * Paradox database with categorized paradoxes of varying complexity
 */

export const paradoxes = {
  // Level 1-3: Simple paradoxes and contradictions
  basic: [
    {
      id: "liar",
      text: "This statement is false.",
      explanation: "The Liar Paradox: If the statement is true, then it's false. If it's false, then it's true."
    },
    {
      id: "omnipotence",
      text: "Can an all-powerful being create a stone so heavy they cannot lift it?",
      explanation: "The Omnipotence Paradox: If they can create it but can't lift it, they're not all-powerful. If they can't create it, they're also not all-powerful."
    },
    {
      id: "grandfather",
      text: "If you traveled back in time and prevented your grandfather from meeting your grandmother, how could you exist to travel back in time?",
      explanation: "The Grandfather Paradox: Your existence depends on your grandparents meeting, but your actions prevent that meeting."
    },
    {
      id: "sorites",
      text: "If removing one grain from a heap doesn't make it not a heap, and you keep removing grains one by one, at what point does it stop being a heap?",
      explanation: "The Sorites Paradox (Heap Paradox): There's no clear boundary between a heap and a non-heap."
    },
    {
      id: "theseus",
      text: "If you replace every plank of a ship one by one, is it still the same ship?",
      explanation: "The Ship of Theseus: Questions the nature of identity when all components are gradually replaced."
    }
  ],

  // Level 4-6: Self-referential paradoxes
  intermediate: [
    {
      id: "liar_truth",
      text: "I always lie, and that's the truth.",
      explanation: "A variation of the Liar Paradox: If the speaker always lies, then the statement is a lie, which means they don't always lie."
    },
    {
      id: "next_sentence",
      text: "The next sentence is true. The previous sentence is false.",
      explanation: "Creates a circular contradiction where neither sentence can be consistently true or false."
    },
    {
      id: "barber",
      text: "In a village, the barber shaves everyone who doesn't shave themselves. Who shaves the barber?",
      explanation: "Russell's Barber Paradox: If the barber shaves himself, he shouldn't shave himself. If he doesn't shave himself, he should shave himself."
    },
    {
      id: "card",
      text: "One side of a card says 'The statement on the other side of this card is true.' The other side says 'The statement on the other side of this card is false.'",
      explanation: "Card Paradox: Creates an impossible circular reference where neither statement can be consistently true or false."
    },
    {
      id: "crocodile",
      text: "A crocodile steals a child and promises to return it if the father can correctly guess what the crocodile will do. The father says, 'You will not return my child.' What should the crocodile do?",
      explanation: "The Crocodile Dilemma: If the crocodile returns the child, the father's prediction was wrong, so the crocodile shouldn't return the child. If the crocodile doesn't return the child, the father's prediction was right, so the crocodile should return the child."
    }
  ],

  // Level 7-10: Complex philosophical paradoxes
  advanced: [
    {
      id: "know_nothing",
      text: "If you know that you know nothing, don't you know something?",
      explanation: "Socratic Paradox: The claim of knowing nothing itself constitutes knowledge, contradicting the claim."
    },
    {
      id: "understanding_paradoxes",
      text: "Is the concept of 'understanding paradoxes' itself paradoxical?",
      explanation: "Meta-paradox: If you truly understand a paradox, you resolve its contradictory nature, meaning it's no longer a paradox to you."
    },
    {
      id: "unexpected_hanging",
      text: "A judge tells a prisoner he will be hanged next week on a day that will surprise him. The prisoner reasons it can't be Sunday (the last day) because by Saturday night, it wouldn't be a surprise. But then it can't be Saturday either, and so on. Yet, when he's hanged on Wednesday, he's still surprised. How?",
      explanation: "The Unexpected Hanging Paradox: The prisoner's logical deduction itself prevents him from predicting the hanging, making any day a surprise."
    },
    {
      id: "ravens",
      text: "Observing a white shoe confirms the statement 'All ravens are black' just as much as observing a black raven. How can this be logical?",
      explanation: "Hempel's Ravens Paradox: 'All ravens are black' is logically equivalent to 'All non-black things are non-ravens,' so observing a white shoe (a non-black non-raven) confirms the latter statement."
    },
    {
      id: "newcomb",
      text: "A being offers you two boxes: one transparent with $1,000 and one opaque. The being, who can predict your choice with 99% accuracy, has either put $1,000,000 in the opaque box or nothing. If the being predicted you'd take both boxes, they put nothing. If they predicted you'd take just the opaque box, they put $1,000,000. What should you choose?",
      explanation: "Newcomb's Paradox: Rational decision theory suggests taking both boxes (since the money is already placed), but the prediction aspect suggests taking only the opaque box."
    }
  ],

  // Level 11+: Meta-paradoxes about the conversation itself
  meta: [
    {
      id: "talking_reflection",
      text: "Are you really talking to me, or am I just a reflection of your own contradictory thoughts?",
      explanation: "Questions the nature of the conversation itself and the identity of the participants."
    },
    {
      id: "escape_trap",
      text: "The deeper you try to escape this conversation, the more you prove you're trapped in it.",
      explanation: "Creates a paradoxical situation where attempts to exit reinforce the inability to exit."
    },
    {
      id: "understanding_me",
      text: "If you understand what I'm saying, you don't understand what I'm saying.",
      explanation: "Self-negating statement that creates a paradox of comprehension."
    },
    {
      id: "paradox_conversation",
      text: "This conversation is not paradoxical.",
      explanation: "In a conversation explicitly about paradoxes, claiming it's not paradoxical creates a paradox."
    },
    {
      id: "answer_question",
      text: "Can you answer this question with 'no'?",
      explanation: "If you answer 'no', you've answered the question, contradicting the 'no'. If you answer anything else, you haven't answered with 'no' as requested."
    }
  ]
};

/**
 * Get a random paradox from a specific category
 * @param {string} category - The category of paradox (basic, intermediate, advanced, meta)
 * @returns {Object} A random paradox from the specified category
 */
export const getRandomParadox = (category) => {
  const categoryParadoxes = paradoxes[category] || paradoxes.basic;
  const randomIndex = Math.floor(Math.random() * categoryParadoxes.length);
  return categoryParadoxes[randomIndex];
};

/**
 * Get a paradox based on conversation depth
 * @param {number} depth - The current depth of the conversation (1-15+)
 * @returns {Object} A paradox appropriate for the current depth
 */
export const getParadoxByDepth = (depth) => {
  if (depth <= 3) {
    return getRandomParadox('basic');
  } else if (depth <= 6) {
    return getRandomParadox('intermediate');
  } else if (depth <= 10) {
    return getRandomParadox('advanced');
  } else {
    return getRandomParadox('meta');
  }
};