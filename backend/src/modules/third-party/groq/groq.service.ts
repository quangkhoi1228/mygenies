import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { computeSHA256Hash } from '../../../utils/encode.utils';
import { ConvexService } from '../convex/convex.service';

export const generateUniqueId = (text: string) => computeSHA256Hash(text);

@Injectable()
export class GroqService {
  constructor(private readonly convexService: ConvexService) {}

  getGroqClient() {
    return new Groq({
      apiKey: process.env.NEST_PUBLIC_GROQ_API_KEY,
    });
  }

  // parseJsonLLMRes(res: string): { [key: string]: any } {
  //   console.log(res);
  //   const keywords = ['```json', '```'];

  //   try {
  //     const jsonResult: { [key: string]: any } = JSON.parse(res);
  //     return jsonResult;
  //   } catch (e) {
  //     keywords.forEach((keyword) => {
  //       res = res.replaceAll(keyword, '');
  //     });
  //     return JSON.parse(res);
  //   }
  // }

  // --------------------------------------------
  // async generateConversation(
  //   topic: string,
  //   userRole: string,
  //   systemRole: string,
  // ) {
  //   const groq = this.getGroqClient();
  //   const chatCompletion = await groq.chat.completions.create({
  //     messages: [
  //       {
  //         role: 'user',
  //         content: `
  //           [meta: output_format=json]

  //           You are an English conversation builder assistant.

  //           ### Task:
  //           Generate a short English conversation with **up to 10 sentences** between two intermediate english level participants:
  //           - **System** ${systemRole}
  //           - **User** ${userRole}

  //           ### Topic:
  //           ${topic}

  //           ### Output Format:
  //           The output must be a **valid JSON object** with the following structure:

  //           {
  //           "context": {
  //             "topic": topic,
  //               "userRole": userRole,
  //               "systemRole": systemRole,
  //             },
  //             "title": "short title of the conversation with length min 4 words and  max 6 words",
  //             "conversation": [
  //               {"role": "system", "sentence": "...", "order": 0},
  //               {"role": "user", "sentence": "...", "order": 1},
  //               {"role": "system", "sentence": "...", "order": 2},
  //               {"role": "user", "sentence": "...", "order": 3},
  //               ...
  //             ]
  //           }

  //           # Output the JSON response as plain text, without wrapping it in triple backticks.
  //           # The conversation between the user and the system must alternate between them.
  //           # Conversation must be in English.

  //         `,
  //       },
  //     ],
  //     model: TEXT_MODEL,
  //     temperature: 1,
  //     max_completion_tokens: 1024,
  //     top_p: 1,
  //     stream: true,
  //     stop: null,
  //   });

  //   let fullResponse = '';
  //   // eslint-disable-next-line no-restricted-syntax
  //   for await (const chunk of chatCompletion) {
  //     fullResponse += chunk.choices[0]?.delta?.content || '';
  //   }

  //   try {
  //     return this.parseJsonLLMRes(fullResponse);
  //   } catch (error) {
  //     console.error('Error parsing JSON response:', error);
  //     console.error('Full response:', fullResponse);
  //     throw new Error('Failed to parse Groq conversation response');
  //   }
  // }

  // async detectMispronunciation(userSentence: string, expectedSentence: string) {
  //   const groq = this.getGroqClient();
  //   const chatCompletion = await groq.chat.completions.create({
  //     messages: [
  //       {
  //         role: 'user',
  //         content: `
  //           [meta: output_format=json]

  //           Detect mispronunciations and missing/mispronounced commas by comparing the user’s spoken sentence with the expected sentence.

  //           ### Input:
  //           - User sentence: ${userSentence}
  //           - Expected sentence: ${expectedSentence}

  //           ### Output Format (JSON):
  //           - "expect": The expected correct sentence, including commas.
  //           - "userInput": The sentence spoken by the user.
  //           - "resultExpect": An array where each word or punctuation mark from the expected sentence is analyzed.
  //             - Each word and comma is mapped to its pronunciation analysis at the character level.
  //             - **Scoring system:**
  //               - 1: Correct pronunciation
  //               - 0.5: Nearly correct pronunciation
  //               - 0: Incorrect pronunciation
  //               - **For commas**:
  //                 - 1: Present in user input
  //                 - 0: Missing in user input

  //           ### Example Output:
  //           {{
  //             "expect": "this is my joke, really.",
  //             "userInput": "this is my job really.",
  //             "resultExpect": [
  //               {{
  //                 "word": "this",
  //                 "analysis": {{"t": 1, "h": 1, "i": 1, "s": 1}}
  //               }},
  //               {{
  //                 "word": "is",
  //                 "analysis": {{"i": 1, "s": 1}}
  //               }},
  //               {{
  //                 "word": "my",
  //                 "analysis": {{"m": 1, "y": 1}}
  //               }},
  //               {{
  //                 "word": "joke",
  //                 "analysis": {{"j": 0, "o": 1, "k": 0, "e": 0}}
  //               }},
  //               {{
  //                 "word": ",",
  //                 "analysis": {",": 0}
  //               }},
  //               {{
  //                 "word": "really.",
  //                 "analysis": {{"r": 1, "e": 1, "a": 1, "l": 1, "l": 1, "y": 1, ".": 1}}
  //               }}
  //             ]
  //           }}

  //           Output the JSON response as plain text, without wrapping it in triple backticks.
  //         `,
  //       },
  //     ],
  //     model: TEXT_MODEL,
  //     temperature: 1,
  //     max_completion_tokens: 2048,
  //     top_p: 1,
  //     stream: true,
  //     stop: null,
  //   });

  //   let fullResponse = '';
  //   // eslint-disable-next-line no-restricted-syntax
  //   for await (const chunk of chatCompletion) {
  //     fullResponse += chunk.choices[0]?.delta?.content || '';
  //   }
  //   try {
  //     return this.parseJsonLLMRes(fullResponse);
  //   } catch (error) {
  //     console.error('Error parsing JSON response:', error);
  //     console.error('Full response:', fullResponse);
  //     throw new Error('Failed to parse Groq detect misunderstand response');
  //   }
  // }

  // // Generate speech from text and save to file
  // async generateSpeechFromText(text: string, voice = 'Arista-PlayAI') {
  //   try {
  //     const groq = this.getGroqClient();

  //     // 1. Generate audio from text
  //     const speechResponse = await groq.audio.speech.create({
  //       model: SPEECH_MODEL, // hoặc SPEECH_MODEL nếu bạn có biến đó
  //       voice,
  //       response_format: 'wav',
  //       input: text,
  //     });

  //     const arrayBuffer = await speechResponse.arrayBuffer();
  //     // const uint8Array = new Uint8Array(arrayBuffer);

  //     // const filename: string = `${generateUniqueId(text)}.wav`;

  //     // // 2. Get Convex upload URL
  //     // const postUrl = await this.convexService.getConvexClient().mutation(
  //     //   api.chatMessages.generateUploadUrl,
  //     //   {},
  //     // );

  //     // // 3. Upload audio to Convex
  //     // const response = await fetch(postUrl, {
  //     //   method: 'POST',
  //     //   headers: { 'Content-Type': 'audio/wav' },
  //     //   body: uint8Array,
  //     // });

  //     // if (!response.ok) {
  //     //   throw new Error('Upload failed');
  //     // }

  //     // const { storageId } = await response.json();

  //     // // 4. Save media info to Convex database
  //     // const sendMediaResult = await this.convexService.getConvexClient().mutation(
  //     //   api.chatMessages.sendMedia,
  //     //   {
  //     //     storageId,
  //     //     name: filename,
  //     //     format: 'audio',
  //     //   },
  //     // );

  //     // const result = { ...sendMediaResult, filename: sendMediaResult.url };
  //     // console.log(result);
  //     return Buffer.from(arrayBuffer);
  //   } catch (error) {
  //     console.error('Error in generateSpeechFromText:', error);
  //     throw error;
  //   }
  // }

  // // Generate speech from text and save to file
  // async generateTextFromSpeech(buffer: Buffer, prompt: string = '') {
  //   try {
  //     const groq = this.getGroqClient();

  //     const transcription = await groq.audio.transcriptions.create({
  //       file: new File([buffer], 'audio.m4a', { type: 'audio/m4a' }), // Adjust MIME type as needed
  //       model: AUDIO_MODEL,
  //       response_format: 'verbose_json',
  //       prompt,
  //     });

  //     return { transcription: transcription.text };
  //   } catch (error) {
  //     console.error('Error in generateTextFromSpeech:', error);
  //     throw error;
  //   }
  // }

  // async generateSayHelloSentence(input: GenerateSayHelloSentenceDto) {
  //   try {
  //     const {
  //       quantity = 10,
  //       hintQuantity = 3,
  //       topic,
  //       systemRole,
  //       userRole,
  //       chatHistory,
  //     } = input;
  //     const groq = this.getGroqClient();
  //     const chatHistoryPrompt = chatHistory.length
  //       ? chatHistory.map((msg) => `${msg.role}: ${msg.sentence}`).join('\n')
  //       : 'No prior conversation.';

  //     const prompt = `
  //       You are an English conversation training assistant.

  //       Your task is to analyze the conversation context and chat history, and return a valid JSON response.

  //       # Instructions:
  //       - Do not include any text outside of the JSON response.
  //       - Do not explain the JSON.
  //       - Output a single, parsable JSON object only.
  //       - If you are unsure, leave the field as an empty string or empty array.
  //       - Always close all brackets and quotation marks properly.

  //       # Logic:
  //       1. Extract the topic, user role, and system role from context and chat history.
  //       2. Check if the user says goodbye or ends the conversation:
  //          - If yes:
  //            - Set "status": "end"
  //            - In "sentence", write a polite farewell.
  //            - Leave "sayHelloSentences", "hintSentences", and "sampleSentences" as empty arrays.
  //       3. If the conversation is ongoing ("status": "chatting"):
  //          - If any context is missing:
  //            - Generate ${quantity} sentences in "sayHelloSentences" to ask **only** about the missing information.
  //            - Generate ${hintQuantity} sentences in "hintSentences", each giving a full example answer with topic, user role, and system role.
  //            - Do not start or include "if you are" or "also" in any hint sentence.
  //            - Leave "sentence" and "sampleSentences" empty.
  //          - If all context is provided:
  //            - Leave "sayHelloSentences" and "hintSentences" empty.
  //            - Generate 1 natural conversation continuation in "sentence".
  //            - Generate ${hintQuantity} sample follow-up responses in "sampleSentences".

  //       # Context:
  //       - Topic: ${topic || '(not provided)'}
  //       - System Role: ${systemRole || '(not provided)'}
  //       - User Role: ${userRole || '(not provided)'}
  //       - Chat History:
  //       ${chatHistoryPrompt}

  //       # Output format:
  //       {
  //         "context": {
  //           "topic": "string",
  //           "userRole": "string",
  //           "systemRole": "string"
  //         },
  //         "title": "string",
  //         "sayHelloSentences": ["string", "..."],
  //         "hintSentences": ["string", "..."],
  //         "sentence": "string",
  //         "sampleSentences": ["string", "..."],
  //         "status": "chatting" | "end"
  //       }
  //       `;

  //     console.log(prompt);
  //     try {
  //       const chatCompletion = await groq.chat.completions.create({
  //         messages: [
  //           {
  //             role: 'system',
  //             content: prompt,
  //           },
  //         ],
  //         model: TEXT_MODEL,
  //         temperature: 1,
  //         max_completion_tokens: 2048,
  //         top_p: 1,
  //         stream: true,
  //         stop: null,
  //       });

  //       let fullResponse = '';
  //       for await (const chunk of chatCompletion) {
  //         fullResponse += chunk.choices[0]?.delta?.content || '';
  //       }

  //       console.error('Full response:', fullResponse);

  //       return this.parseJsonLLMRes(fullResponse);
  //     } catch (error) {
  //       console.error('Error parsing JSON response:', error);

  //       throw new Error('Failed to parse Groq say hello sentences response');
  //     }
  //   } catch (e) {
  //     console.log('e');
  //     throw new Error(e);
  //   }
  // }

  // async generateFreeTalkSentence(input: GenerateSayHelloSentenceDto) {
  //   const groq = this.getGroqClient();

  //   const {
  //     quantity = 20,
  //     topic,
  //     systemRole,
  //     userRole,
  //     chatHistory = [],
  //   } = input;

  //   const chatHistoryPrompt = chatHistory
  //     .map((chatMessage) => `${chatMessage.role}: ${chatMessage.sentence}`)
  //     .join('\n');
  //   const chatCompletion = await groq.chat.completions.create({
  //     messages: [
  //       {
  //         role: 'system',
  //         content: `
  //           [meta: output_format=json]

  //           You are an English conversation training assistant.

  //           ### Task:
  //           Generate ${quantity} sentences to say hello and ask the topic and user role, system role role if context do not have data:

  //           ### Context of conversation:
  //           - **Topic** ${topic}
  //           - **System** ${systemRole}
  //           - **User** ${userRole}

  //           ### Chat history
  //           ${chatHistoryPrompt}

  //           ### Output Format:
  //           The output must be a **valid JSON object** with the following structure:

  //           {
  //           "context": {
  //             "topic": topic,
  //               "userRole": userRole,
  //               "systemRole": systemRole,
  //             },
  //             "title": "short title of the conversation with length min 4 words and  max 6 words",
  //             "sayHelloSentences": [
  //               "Hi, What do you would like to talk about today?",
  //               "Hello, We will talk about Topic, can you provide role of us",
  //               ...
  //             ]
  //           }

  //           # If the context data not enough the sentences should ask the missing context data.
  //           # The missing context data will be return "" (blank string)
  //           # Conversation must be in English.
  //           # Output the JSON response as plain text, without wrapping it in triple backticks.

  //         `,
  //       },
  //     ],
  //     model: TEXT_MODEL,
  //     temperature: 1,
  //     max_completion_tokens: 2048,
  //     top_p: 1,
  //     stream: true,
  //     stop: null,
  //   });

  //   let fullResponse = '';
  //   for await (const chunk of chatCompletion) {
  //     fullResponse += chunk.choices[0]?.delta?.content || '';
  //   }

  //   try {
  //     return this.parseJsonLLMRes(fullResponse);
  //   } catch (error) {
  //     console.error('Error parsing JSON response:', error);
  //     console.error('Full response:', fullResponse);
  //     throw new Error('Failed to parse Groq say hello sentences response');
  //   }
  // }

  // async refineUserSentence(input: RefineUserSentenceDto) {
  //   const {
  //     userSentence,
  //     topic,
  //     systemRole,
  //     userRole,
  //     chatHistory = [],
  //   } = input;

  //   const groq = this.getGroqClient();

  //   const chatHistoryPrompt = chatHistory
  //     .map((chatMessage) => `${chatMessage.role}: ${chatMessage.sentence}`)
  //     .join('\n');

  //   const chatCompletion = await groq.chat.completions.create({
  //     messages: [
  //       {
  //         role: 'system',
  //         content: `
  //           [meta: output_format=json]

  //           You are an English conversation improvement assistant.

  //           ### Task:
  //           Given the user's sentence and context, rephrase the sentence into a more natural, clear, and grammatically correct English sentence.
  //           - Remove filler words like "uh", "um", "you know", "like", etc.
  //           - Keep the original meaning of the sentence.
  //           - Make it sound natural and appropriate based on the conversation context.

  //           ### Context of conversation:
  //           - **Topic**: ${topic || ''}
  //           - **System Role**: ${systemRole || ''}
  //           - **User Role**: ${userRole || ''}

  //           ### Chat history:
  //           ${chatHistoryPrompt || 'No previous chat history.'}

  //           ### User's sentence to improve:
  //           "${userSentence}"

  //           ### Output Format:
  //           The output must be a **valid JSON object** in the following format:

  //           {
  //             "originalSentence": "Original user sentence here.",
  //             "refinedSentence": "Refined and improved sentence here."
  //           }

  //           # Output only the JSON response as plain text, without wrapping it in triple backticks.
  //           # The conversation must be in English.
  //         `,
  //       },
  //     ],
  //     model: TEXT_MODEL,
  //     temperature: 0.7,
  //     max_completion_tokens: 512,
  //     top_p: 1,
  //     stream: true,
  //     stop: null,
  //   });

  //   let fullResponse = '';
  //   for await (const chunk of chatCompletion) {
  //     fullResponse += chunk.choices[0]?.delta?.content || '';
  //   }

  //   try {
  //     return this.parseJsonLLMRes(fullResponse);
  //   } catch (error) {
  //     console.error('Error parsing JSON response:', error);
  //     console.error('Full response:', fullResponse);
  //     throw new Error('Failed to parse Groq refined sentence response');
  //   }
  // }

  // async translateSentence(text: string) {
  //   const groq = this.getGroqClient();

  //   const chatCompletion = await groq.chat.completions.create({
  //     messages: [
  //       {
  //         role: 'system',
  //         content: `
  //           [meta: output_format=json]

  //           You are a translation assistant that translates English into Vietnamese.

  //           ### Task:
  //           Translate the provided English text into Vietnamese naturally and accurately.

  //           ### Input:
  //           "${text}"

  //           ### Output Format:
  //           The output must be a **valid JSON object** in the following format:

  //           {
  //             "originalText": "Original English sentence here.",
  //             "translatedText": "Vietnamese translation here."
  //           }

  //           # Output only the JSON response as plain text, no triple backticks.
  //         `,
  //       },
  //     ],
  //     model: TEXT_MODEL,
  //     temperature: 0.7,
  //     max_completion_tokens: 512,
  //     top_p: 1,
  //     stream: true,
  //     stop: null,
  //   });

  //   let fullResponse = '';
  //   for await (const chunk of chatCompletion) {
  //     fullResponse += chunk.choices[0]?.delta?.content || '';
  //   }

  //   try {
  //     return this.parseJsonLLMRes(fullResponse);
  //   } catch (error) {
  //     console.error('Error parsing JSON response:', error);
  //     console.error('Full response:', fullResponse);
  //     throw new Error('Failed to parse Groq translated response');
  //   }
  // }

  // generateSentencesFromIdea = async (input: {
  //   text: string;
  //   count?: number;
  // }) => {
  //   const { text, count = 3 } = input;
  //   const groq = this.getGroqClient();

  //   const chatCompletion = await groq.chat.completions.create({
  //     messages: [
  //       {
  //         role: 'system',
  //         content: `
  //         [meta: output_format=json]

  //         You are a creative writing assistant. Based on the user's idea, you will generate a list of meaningful and coherent English sentences that reflect the idea. Each sentence should be grammatically correct and natural in tone.

  //         ### Task:
  //         Based on the idea provided (can be in any language), generate ${count} different English sentences that express or are inspired by this idea.

  //         ### Input:
  //         "${text}"

  //         ### Output Format:
  //         Return a valid JSON object like this:

  //         {
  //           "idea": "Original input idea here.",
  //           "generatedSentences": [
  //             "First English sentence.",
  //             "Second English sentence.",
  //             ...
  //           ]
  //         }

  //         # Output only the JSON response as plain text, no triple backticks.
  //       `,
  //       },
  //     ],
  //     model: TEXT_MODEL,
  //     temperature: 0.85,
  //     max_completion_tokens: 512,
  //     top_p: 1,
  //     stream: true,
  //     stop: null,
  //   });

  //   let fullResponse = '';
  //   for await (const chunk of chatCompletion) {
  //     fullResponse += chunk.choices[0]?.delta?.content || '';
  //   }

  //   try {
  //     return this.parseJsonLLMRes(fullResponse);
  //   } catch (error) {
  //     console.error('Error parsing JSON response:', error);
  //     console.error('Full response:', fullResponse);
  //     throw new Error('Failed to parse Groq generated response');
  //   }
  // };
}
