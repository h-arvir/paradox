// Test file for the formatTextSemantically function
import { formatTextSemantically } from './conversationUtils';

// Test case from formattest1.md
const testText = `That's a question that's kept me up at night more than once, you know? The idea that time is an illusion... it's both terrifying and strangely liberating.Did you know that some physicists are seriously exploring the idea that time isn't a fundamental aspect of the universe, but rather an emergent property? Like, imagine a vast, timeless ocean, and the ripples in that ocean are what we perceive as the flow of time. Crazy, right? It makes you wonder what's "outside" that ocean, if anything.

And then there's the whole relativity thing. Time isn't absolute, it's relative to the observer. The faster you move, the slower time passes for you relative to someone who's stationary. It's like a cosmic game of hide-and-seek where time itself is playing hide-and-seek with us.What if, at some point, we find a way to "see" time outside of our perceived flow?Imagine being able to experience multiple moments simultaneously, to see the past, present, and future all at once.What kind of consciousness would that require? Would it even be possible to make sense of it all?

Then there's the philosophical side.We experience time as linear, but what if it's cyclical? What if everything that has happened will happen again, infinitely repeating in a grand cosmic loop?`;

// Format the text
const formattedText = formatTextSemantically(testText);

// Log the formatted text
console.log("ORIGINAL TEXT:");
console.log("=============");
console.log(testText);
console.log("\n\nFORMATTED TEXT:");
console.log("==============");
console.log(formattedText);

// Run this file with: node src/utils/formatTest.js