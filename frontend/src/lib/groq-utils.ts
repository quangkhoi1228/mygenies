/* eslint-disable no-restricted-syntax */
import crypto from "crypto";
import { Groq } from "groq-sdk"; // use promises API
// import { api } from 'convex/_generated/api';
import { ChatMessageType } from "@/redux/features/chatMessages.slice";

import { api } from "@/convex/_generated/api";
import { convexClient } from "./convexClient";

const TEXT_MODEL = "llama-3.3-70b-versatile";
// const TEXT_MODEL = 'llama-3.3-70b-specdec';

const SPEECH_MODEL = "playai-tts";

const getGroqClient = () =>
  new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  });

export const generateUniqueId = (text: string) =>
  crypto.createHash("sha256").update(text).digest("hex");

export const generateConversation = async (topic: string, userRole: string, systemRole: string) => {
  const groq = getGroqClient();
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
          [meta: output_format=json]  

          You are an English conversation builder assistant.  

          ### Task:  
          Generate a short English conversation with **up to 10 sentences** between two intermediate english level participants:  
          - **System** ${systemRole}
          - **User** ${userRole}

          ### Topic:  
          ${topic}

          ### Output Format:  
          The output must be a **valid JSON object** with the following structure:  

          {
          "context": {
            "topic": topic,
              "userRole": userRole,
              "systemRole": systemRole,
            },   
            "title": "short title of the conversation with length min 4 words and  max 6 words",
            "conversation": [
              {"role": "system", "sentence": "...", "order": 0},
              {"role": "user", "sentence": "...", "order": 1},
              {"role": "system", "sentence": "...", "order": 2},
              {"role": "user", "sentence": "...", "order": 3},
              ...
            ]
          }
            
          # Output the JSON response as plain text, without wrapping it in triple backticks.
          # The conversation between the user and the system must alternate between them.
          # Conversation must be in English.

        `,
      },
    ],
    model: TEXT_MODEL,
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  let fullResponse = "";
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of chatCompletion) {
    fullResponse += chunk.choices[0]?.delta?.content || "";
  }

  try {
    return parseJsonLLMRes(fullResponse);
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    console.error("Full response:", fullResponse);
    throw new Error("Failed to parse Groq conversation response");
  }
};

export const detectMispronunciation = async (userSentence: string, expectedSentence: string) => {
  const groq = getGroqClient();
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
          [meta: output_format=json]

          Detect mispronunciations and missing/mispronounced commas by comparing the user’s spoken sentence with the expected sentence.

          ### Input:  
          - User sentence: ${userSentence}  
          - Expected sentence: ${expectedSentence}  

          ### Output Format (JSON):  
          - "expect": The expected correct sentence, including commas.  
          - "userInput": The sentence spoken by the user.  
          - "resultExpect": An array where each word or punctuation mark from the expected sentence is analyzed.  
            - Each word and comma is mapped to its pronunciation analysis at the character level.  
            - **Scoring system:**  
              - 1: Correct pronunciation  
              - 0.5: Nearly correct pronunciation  
              - 0: Incorrect pronunciation  
              - **For commas**:  
                - 1: Present in user input  
                - 0: Missing in user input  
            - "feedback": Always correct the user's pronunciation or punctuation mistakes if there are any, but also include compliments or encouragement to keep them motivated.

          ### Example Output:  
          {{
            "expect": "this is my joke, really.",
            "userInput": "this is my job really.",
            "resultExpect": [
              {{
                "word": "this",
                "analysis": {{"t": 1, "h": 1, "i": 1, "s": 1}}
              }},
              {{
                "word": "is",
                "analysis": {{"i": 1, "s": 1}}
              }},
              {{
                "word": "my",
                "analysis": {{"m": 1, "y": 1}}
              }},
              {{
                "word": "joke",
                "analysis": {{"j": 0, "o": 1, "k": 0, "e": 0}}
              }},
              {{
                "word": ",",
                "analysis": {",": 0} 
              }},
              {{
                "word": "really.",
                "analysis": {{"r": 1, "e": 1, "a": 1, "l": 1, "l": 1, "y": 1, ".": 1}}
              }}
            ],            
            "feedback": "You mispronounced 'joke' and missed the comma after it. Focus on the 'j' and 'k' sounds, and remember to pause slightly for the comma."

          }}

          Output the JSON response as plain text, without wrapping it in triple backticks.
        `,
      },
    ],
    model: TEXT_MODEL,
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    stream: true,
    stop: null,
  });

  let fullResponse = "";
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of chatCompletion) {
    fullResponse += chunk.choices[0]?.delta?.content || "";
  }
  try {
    return parseJsonLLMRes(fullResponse);
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    console.error("Full response:", fullResponse);
    throw new Error("Failed to parse Groq detect misunderstand response");
  }
};

// Generate speech from text and save to file
export const generateSpeechFromText = async (text: string, voice = "Arista-PlayAI") => {
  const filename: string = `${generateUniqueId(text)}.wav`;

  try {
    const groq = getGroqClient();

    // 1. Generate audio from text
    const speechResponse = await groq.audio.speech.create({
      model: SPEECH_MODEL, // hoặc SPEECH_MODEL nếu bạn có biến đó
      voice,
      response_format: "wav",
      input: text,
    });

    const arrayBuffer = await speechResponse.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // 2. Get Convex upload URL
    const postUrl = await convexClient.mutation(api.chatMessages.generateUploadUrl, {});

    // 3. Upload audio to Convex
    const response = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "audio/wav" },
      body: uint8Array,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const { storageId } = await response.json();

    // 4. Save media info to Convex database
    const sendMediaResult = await convexClient.mutation(api.chatMessages.sendMedia, {
      storageId,
      name: filename,
      format: "audio",
    });

    const result = { ...sendMediaResult, filename: sendMediaResult.url };
    return result;
  } catch (error) {
    console.error("Error in generateSpeechFromText:", error);
    throw error;
  }
};

export type GenerateSayHelloSentenseType = {
  quantity: number;
  hintQuantity: number;
  topic?: string;
  systemRole?: string;
  userRole?: string;
  chatHistory: ChatMessageType[];
  roleBased?: boolean;
};
export const generateSayHelloSentense = async (input: GenerateSayHelloSentenseType) => {
  try {
    const { quantity = 10, hintQuantity = 3, topic, systemRole, userRole, chatHistory } = input;
    const groq = getGroqClient();
    const chatHistoryPrompt = chatHistory.length
      ? chatHistory.map((msg) => `${msg.role}: ${msg.sentence}`).join("\n")
      : "No prior conversation.";

    const prompt = `
      You are an English conversation training assistant.
      
      Your task is to analyze the conversation context and chat history, and return a valid JSON response.
      
      # Instructions:
      - Do not include any text outside of the JSON response.
      - Do not explain the JSON.
      - Output a single, parsable JSON object only.
      - If you are unsure, leave the field as an empty string or empty array.
      - Always close all brackets and quotation marks properly.
      - The conversation must be in English.
      
      # Logic:
      1.Continue the conversation based on the topic, user role, and system role from context and chat history.
      2. If the user says goodbye:
         - Set "status": "end"
         - Write a polite farewell in "sentence"
         - Leave "hintSentences" and "sampleSentences" empty
    3. If conversation is ongoing ("status": "chatting"):
         - Generate a natural sentence from AI to continue the conversation and put it in "sentence" (x)
         - Generate ${hintQuantity} "hintSentences" — these must:
           - Respond directly to the "sentence" (x) above
           - Add new information (e.g., personal context, opinions, plans)
           - Help the conversation keep going (e.g., raise a new topic, give more detail)
           - Do not include punctuation in the hintSentences (no periods, commas, question marks, etc.)
           - Do not use contractions in the hintSentences (write out full forms, e.g., "I am" instead of "I'm", "do not" instead of "don't")
      Example:
         If AI says: "Hello, it's nice to meet you. How are you today?"
         Then "hintSentences" could be:
         - "I am great we will talk about football"
         - "I am good I just finished a big project at work"
         - "I am feeling awesome I watched a cool movie last night"

      # Context:
      - Topic: ${topic}
      - System Role: ${systemRole}
      - User Role: ${userRole}
      - Chat History:
      ${chatHistoryPrompt}
      
      # Output format:
      {
        "context": {
          "topic": "string",
          "userRole": "string",
          "systemRole": "string"
        },
        "title": "short title of the conversation with length min 4 words and  max 6 words",
        "sayHelloSentences": ["string", "..."],
        "hintSentences": ["string", "..."],
        "sentence": "string",
        "sampleSentences": ["string", "..."],
        "status": "chatting" | "end"
      }
      `;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        model: TEXT_MODEL,
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        stream: true,
        stop: null,
      });

      let fullResponse = "";
      for await (const chunk of chatCompletion) {
        fullResponse += chunk.choices[0]?.delta?.content || "";
      }

      return parseJsonLLMRes(fullResponse);
    } catch (error) {
      console.error("Error parsing JSON response:", error);

      throw new Error("Failed to parse Groq say hello sentences response");
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const parseJsonLLMRes = (res: string): { [key: string]: any } => {
  const keywords = ["```json", "```"];

  try {
    const jsonResult: { [key: string]: any } = JSON.parse(res);
    return jsonResult;
  } catch (e) {
    keywords.forEach((keyword) => {
      res = res.replaceAll(keyword, "");
    });
    return JSON.parse(res);
  }
};

export const generateFreeTalkSentence = async (input: GenerateSayHelloSentenseType) => {
  try {
    const { hintQuantity = 3, topic, systemRole, userRole, chatHistory } = input;
    const groq = getGroqClient();
    const chatHistoryPrompt = chatHistory.length
      ? chatHistory.map((msg) => `${msg.role}: ${msg.sentence}`).join("\n")
      : "No prior conversation.";

    const prompt = `
      You are an English conversation training assistant.
    
      Your task is to analyze the chat history and return a valid JSON response.
    
      # Instructions:
      - Only output a single JSON object.
      - No explanation or additional text outside of the JSON.
      - If unsure, leave the field as an empty string or empty array.
      - Always close all brackets and quotation marks properly.
      - The conversation must be in English.
    
      # Logic:
      1. Continue the conversation based on the chat history.
      2. If the user says goodbye:
         - Set "status": "end"
         - Write a polite farewell in "sentence"
         - Leave "hintSentences" and "sampleSentences" empty
      3. If conversation is ongoing ("status": "chatting"):
         - Generate a natural sentence from AI to continue the conversation and put it in "sentence"
         - Generate ${hintQuantity} "hintSentences" — these must:
           - Respond directly to the AI's sentence above
           - Add new information (e.g., personal context, opinions, plans)
           - Help the conversation keep going (e.g., raise a new topic, give more detail)
           - Do not include punctuation in the hintSentences (no periods, commas, question marks, etc.)
           - Do not use contractions in the hintSentences (write out full forms, e.g., "I am" instead of "I'm", "do not" instead of "don't")
    
         Example:
         If AI says: "Hello, it's nice to meet you. How are you today?"
         Then "hintSentences" could be:
         - "I am great we will talk about football"
         - "I am good I just finished a big project at work"
         - "I am feeling awesome I watched a cool movie last night"
    
      # Context:
      - Topic: ${topic || "(not provided)"}
      - System Role: ${systemRole || "(not provided)"}
      - User Role: ${userRole || "(not provided)"}
      - Chat History:
      ${chatHistoryPrompt}
    
      # Output format:
      {
        "context": {
          "topic": "string",
          "userRole": "string",
          "systemRole": "string"
        },
        "title": "short title of the conversation with length min 4 words and  max 6 words",
        "sentence": "string",
        "hintSentences": ["string", "..."],
        "sampleSentences": ["string", "..."],
        "status": "chatting" | "end"
      }
    `;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: TEXT_MODEL,
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        stream: true,
        stop: null,
      });

      let fullResponse = "";
      for await (const chunk of chatCompletion) {
        fullResponse += chunk.choices[0]?.delta?.content || "";
      }

      console.error("Full response:", fullResponse);

      return parseJsonLLMRes(fullResponse);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse Groq say hello sentences response");
    }
  } catch (e) {
    throw new Error(e);
  }
};

export type RefineUserSentenceType = {
  userSentence: string;
  topic?: string;
  systemRole?: string;
  userRole?: string;
  chatHistory?: ChatMessageType[];
};
export const refineUserSentence = async (input: RefineUserSentenceType) => {
  const { userSentence, topic, systemRole, userRole, chatHistory = [] } = input;

  const groq = getGroqClient();

  const chatHistoryPrompt = chatHistory
    .map((chatMessage) => `${chatMessage.role}: ${chatMessage.sentence}`)
    .join("\n");

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          [meta: output_format=json]

          You are an English conversation improvement assistant.

          ### Task:
          Given the user's sentence and context, rephrase the sentence into a more natural, clear, and grammatically correct English sentence.
          - Remove filler words like "uh", "um", "you know", "like", etc.
          - Keep the original meaning of the sentence.
          - Make it sound natural and appropriate based on the conversation context.
          - Do not include punctuation in the hintSentences (no periods, commas, question marks, etc.)
          - Do not use contractions in the hintSentences (write out full forms, e.g., "I am" instead of "I'm", "do not" instead of "don't")

          ### Context of conversation:
          - **Topic**: ${topic || ""}
          - **System Role**: ${systemRole || ""}
          - **User Role**: ${userRole || ""}

          ### Chat history:
          ${chatHistoryPrompt || "No previous chat history."}

          ### User's sentence to improve:
          "${userSentence}"

          ### Output Format:
          The output must be a **valid JSON object** in the following format:

          {
            "originalSentence": "Original user sentence here",
            "refinedSentence": "Refined and improved sentence here"
          }

          # Output only the JSON response as plain text, without wrapping it in triple backticks.
          # The conversation must be in English.
        `,
      },
    ],
    model: TEXT_MODEL,
    temperature: 0.7,
    max_completion_tokens: 512,
    top_p: 1,
    stream: true,
    stop: null,
  });

  let fullResponse = "";
  for await (const chunk of chatCompletion) {
    fullResponse += chunk.choices[0]?.delta?.content || "";
  }

  try {
    return parseJsonLLMRes(fullResponse);
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    console.error("Full response:", fullResponse);
    throw new Error("Failed to parse Groq refined sentence response");
  }
};

export type TranslateType = {
  text: string;
};

export const translateSentence = async (input: TranslateType) => {
  const { text } = input;
  const groq = getGroqClient();

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          [meta: output_format=json]

          You are a translation assistant that translates English into Vietnamese.

          ### Task:
          Translate the provided English text into Vietnamese naturally and accurately.

          ### Input:
          "${text}"

          ### Output Format:
          The output must be a **valid JSON object** in the following format:

          {
            "originalText": "Original English sentence here.",
            "translatedText": "Vietnamese translation here."
          }

          # Output only the JSON response as plain text, no triple backticks.
        `,
      },
    ],
    model: TEXT_MODEL,
    temperature: 0.7,
    max_completion_tokens: 512,
    top_p: 1,
    stream: true,
    stop: null,
  });

  let fullResponse = "";
  for await (const chunk of chatCompletion) {
    fullResponse += chunk.choices[0]?.delta?.content || "";
  }

  try {
    return parseJsonLLMRes(fullResponse);
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    console.error("Full response:", fullResponse);
    throw new Error("Failed to parse Groq translated response");
  }
};

export const generateSentencesFromIdea = async (input: { text: string; count?: number }) => {
  const { text, count = 3 } = input;
  const groq = getGroqClient();

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          [meta: output_format=json]

          You are a creative writing assistant. Based on the user's idea, you will generate a list of meaningful and coherent English sentences that reflect the idea. Each sentence should be grammatically correct and natural in tone.

          ### Task:
          Based on the idea provided (can be in any language), generate ${count} different English sentences that express or are inspired by this idea.

          ### Input:
          "${text}"

          ### Output Format:
          Return a valid JSON object like this:

          {
            "idea": "Original input idea here.",
            "generatedSentences": [
              "First English sentence.",
              "Second English sentence.",
              ...
            ]
          }

          # Output only the JSON response as plain text, no triple backticks.
        `,
      },
    ],
    model: TEXT_MODEL,
    temperature: 0.85,
    max_completion_tokens: 512,
    top_p: 1,
    stream: true,
    stop: null,
  });

  let fullResponse = "";
  for await (const chunk of chatCompletion) {
    fullResponse += chunk.choices[0]?.delta?.content || "";
  }

  try {
    return parseJsonLLMRes(fullResponse);
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    console.error("Full response:", fullResponse);
    throw new Error("Failed to parse Groq generated response");
  }
};
