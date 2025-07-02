// import { ChatMessagesState, GenerateChatConversationResponseType } from './chatMessages.slice';

// export const generateChatConversationResSample: GenerateChatConversationResponseType =
//   {
//     context: {
//       topic: 'React',
//       userRole: 'user',
//       systemRole: 'system',
//     },
//     conversation: [
//       {
//         role: 'system',
//         sentence: 'Hello, can you tell me about your experience with React?',
//         order: 0,
//       },
//       {
//         role: 'user',
//         sentence:
//           'Yes, I have been working with React for about two years now.',
//         order: 1,
//       },
//       {
//         role: 'system',
//         sentence:
//           "That's great, what do you think are the benefits of using React?",
//         order: 2,
//       },
//       {
//         role: 'user',
//         sentence:
//           "I think it's very fast and efficient, and it's easy to learn and use.",
//         order: 3,
//       },
//       {
//         role: 'system',
//         sentence:
//           'Can you explain to me how you would handle state management in a React application?',
//         order: 4,
//       },
//       {
//         role: 'user',
//         sentence:
//           'We can use the useState hook to manage state in functional components.',
//         order: 5,
//       },
//       {
//         role: 'system',
//         sentence:
//           "That's correct, what about context API, have you used it before?",
//         order: 7,
//       },
//       {
//         role: 'user',
//         sentence:
//           'Yes, I have used it to share data between components without passing props down manually.',
//         order: 8,
//       },
//       {
//         role: 'system',
//         sentence:
//           "Okay, last question, can you tell me about a project you worked on that you're particularly proud of?",
//         order: 9,
//       },
//       {
//         role: 'user',
//         sentence:
//           'Yes, I built a web application using React that allowed users to track their daily habits and activities.',
//         order: 10,
//       },
//     ],
//   };

// export const detectPronunciationResSample: ChatMessagesState['chattingConversation'] =
//   [
//     {
//       role: 'system',
//       sentence: 'Hello, can you tell me about your experience with React?',
//       order: 0,
//     },
//     {
//       role: 'user',
//       sentence: 'Yes, I have been working with React for about two years now.',
//       order: 1,
//       detectPronunciation: {
//         expect: 'Yes, I have been working with React for about two years now.',
//         userInput:
//           ' Hello, hello, hello. Yes, I have been working with two years.',
//         resultExpect: [
//           {
//             word: 'Yes',
//             analysis: {
//               Y: 1,
//               e: 1,
//               s: 1
//             }
//           },
//           {
//             word: ',',
//             analysis: {
//               ',': 1
//             }
//           },
//           {
//             word: 'I',
//             analysis: {
//               I: 1
//             }
//           },
//           {
//             word: 'have',
//             analysis: {
//               h: 1,
//               a: 1,
//               v: 1,
//               e: 1
//             }
//           },
//           {
//             word: 'been',
//             analysis: {
//               b: 1,
//               e: 1,
//               n: 1
//             }
//           },
//           {
//             word: 'working',
//             analysis: {
//               w: 1,
//               o: 1,
//               r: 1,
//               k: 1,
//               i: 1,
//               n: 1,
//               g: 1
//             }
//           },
//           {
//             word: 'with',
//             analysis: {
//               w: 1,
//               i: 1,
//               t: 1,
//               h: 1
//             }
//           },
//           {
//             word: 'React',
//             analysis: {
//               R: 0,
//               e: 0,
//               a: 0,
//               c: 0,
//               t: 0
//             }
//           },
//           {
//             word: 'for',
//             analysis: {
//               f: 1,
//               o: 1,
//               r: 1
//             }
//           },
//           {
//             word: 'about',
//             analysis: {
//               a: 0,
//               b: 0,
//               o: 0,
//               u: 0,
//               t: 0
//             }
//           },
//           {
//             word: 'two',
//             analysis: {
//               t: 0,
//               w: 0,
//               o: 0
//             }
//           },
//           {
//             word: 'years',
//             analysis: {
//               y: 1,
//               e: 1,
//               a: 1,
//               r: 1,
//               s: 1
//             }
//           },
//           {
//             word: 'now',
//             analysis: {
//               n: 0,
//               o: 0,
//               w: 0
//             }
//           }
//         ]
//       }
//     }
//   ]
