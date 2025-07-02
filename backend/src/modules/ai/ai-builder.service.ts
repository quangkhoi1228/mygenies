import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { computeSHA256Hash } from '../../utils/encode.utils';
import { ConvexService } from '../third-party/convex/convex.service';
import { AUDIO_MODEL, TEXT_MODEL } from '../third-party/groq/groq.constants';
import {
  AIAudioBuilderDto,
  AIBuilderDto,
  AIConversationBuilderDto,
} from './dto/ai-builder.dto';

export const generateUniqueId = (text: string) => computeSHA256Hash(text);

@Injectable()
export class AiBuilderService {
  constructor(private readonly convexService: ConvexService) {}

  getGroqClient() {
    return new Groq({
      apiKey: process.env.NEST_PUBLIC_GROQ_API_KEY,
    });
  }

  parseJsonLLMRes(res: string): { [key: string]: any } {
    console.log(res);
    const keywords = ['```json', '```'];

    try {
      const jsonResult: { [key: string]: any } = JSON.parse(res);
      return jsonResult;
    } catch (e) {
      keywords.forEach((keyword) => {
        res = res.replaceAll(keyword, '');
      });
      return JSON.parse(res);
    }
  }

  async aiBuilder(aiBuilderInput: AIBuilderDto) {
    const groq = this.getGroqClient();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `
            [meta: output_format=json]  
  
            You are a ${aiBuilderInput.role} with main task is ${aiBuilderInput.taskOverview}
  
            ### Detail Task:  
            ${aiBuilderInput.taskDetail}

            ### Input:
            ${aiBuilderInput.input}
            
            ### Output Format:  
            The output must be a **valid JSON object** with the following structure:  
  
            ${aiBuilderInput.outputFormat}
              
            ### Must have:
            ${aiBuilderInput.outputStrict}
              - Output the JSON response as plain text, without wrapping it in triple backticks.
              - Only output a single JSON object.
              - No explanation or additional text outside of the JSON.
              - If unsure, leave the field as an empty string or empty array.
              - Always close all brackets and quotation marks properly.
              // - All output data must be only in ${aiBuilderInput.language} (important).
              - All output data must be only in English (important).
  
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

    let fullResponse = '';
    for await (const chunk of chatCompletion) {
      fullResponse += chunk.choices[0]?.delta?.content || '';
    }

    try {
      return this.parseJsonLLMRes(fullResponse);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.error('Full response:', fullResponse);
      throw new Error('Failed to parse Groq conversation response');
    }
  }

  async aiAudioBuilder(aiAudioBuilderInput: AIAudioBuilderDto) {
    try {
      const groq = this.getGroqClient();
      const uint8Array = new Uint8Array(aiAudioBuilderInput.buffer);
      const blob = new Blob([uint8Array]);
      const transcription = await groq.audio.transcriptions.create({
        file: new File([blob], 'audio.wav', {
          type: 'audio/wav',
        }), // Adjust MIME type as needed
        model: AUDIO_MODEL,
        response_format: 'verbose_json',
        prompt: `
        You are speech to text assistant, you will be given a audio file and you will need to convert Vietnamese or English to text.
        User can speak in Vietnamese or English.
        `,
      });

      return { transcription: transcription.text };
    } catch (error) {
      console.error('Error in generateTextFromSpeech:', error);
      throw error;
    }
  }

  async aiConversationBuilder(input: AIConversationBuilderDto) {
    const {
      hintQuantity = 3,
      context: { topic, systemRole, userRole },
      chatHistory = [],
      roleBased,
    } = input;

    try {
      const chatHistoryPrompt = chatHistory
        .map((chatMessage) => `${chatMessage.role}: ${chatMessage.sentence}`)
        .join('\n');

      const response = await this.aiBuilder({
        role: 'English conversation training assistant',
        taskOverview:
          'Analyze the chat history and return a valid JSON response',
        taskDetail: `
          1. Continue the conversation based on the chat history.
          2. If the user says goodbye:
            - Set "status": "end"
            - Write a polite farewell in "sentence"
            - Leave "hintSentences" and "sampleSentences" empty
          3. If conversation is ongoing ("status": "chatting"):
            - Generate a natural sentence from AI to continue the conversation and put it in "sentence"
            - Generate ${hintQuantity} "hintSentences", these must:
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
          4. If not have history, say hello user and ask a random the topic
          5. If roleBased is true and current input does not have topic and System, user roles, ask user to provide missing role of us and topic
          6. Translate the topic, user role, and system role to English (important) and return to the context in output
              `,
        input: `
          ### Chat context:
          - Topic: ${topic || '(not provided)'}
          - System Role: ${systemRole || '(not provided)'}
          - User Role: ${userRole || '(not provided)'}
          - Role Based: ${roleBased || false}

          ### Chat history:
          ${chatHistoryPrompt}
      `,
        outputFormat: `
      {
        "context": {
          "topic": topic,
          "userRole": userRole,
          "systemRole": systemRole,
        },   
        "title": "short title of the conversation with length min 4 words and  max 6 words",
        "sentence": "string",
        "hintSentences": ["string", "..."],
        "sampleSentences": ["string", "..."],
        "status": "chatting" | "end"
        }
      `,
        outputStrict: `
        - All output data must be in English (important).
      `,
      });

      return response;
    } catch (e) {
      console.error('Error in aiConversationBuilder:', e);
      throw e;
    }
  }

  async aiTalkNowConversationBuilder(input: AIConversationBuilderDto) {
    const {
      hintQuantity = 3,
      context: { topic, systemRole, userRole },
      chatHistory = [],
      roleBased,
    } = input;

    try {
      const chatHistoryPrompt = chatHistory
        .map((chatMessage) => `${chatMessage.role}: ${chatMessage.sentence}`)
        .join('\n');

      const response = await this.aiBuilder({
        role: 'English conversation training assistant',
        taskOverview:
          'Analyze the chat history and return a valid JSON response',
        taskDetail: `
          1. Detect Conversation Status and Context
          - If the user says goodbye:
              - Set "status": "end"
              - Write a polite and natural farewell in "sentence"
              - Leave "hintSentences" empty
          2. If the conversation is ongoing ("status": "chatting"):
              - Detect whether the user wants to change the topic, user role, or AI role
              - Update "chatTopic", "userRole", and "systemRole" accordingly
              - Continue the conversation based on:
                  - Chat history
                  - Updated context
                  - User's English level: B1, user can make short conversations with basic wording
                  - SystemTone: Friendly and natural tone
                  - SystemName: Doku

          - Generate:
            - **sentences**: The AI’s short paragraph to continue the conversation. Follow these rules:
              - Total length must be under 200.
              - Structure probability:
                  - 45%: 1 sentence (length > 25% and < 50% of 200)
                  - 30%: 2 sentences (length > 35% and < 70% of 200)
                  - 20%: 3 sentences (length > 40% of 200)
                  - 5%: 4 sentences (length > 40% of 200)

              - Occasionally include the user's name "Thuan An" or cultural reference from Vietnam.
              - If user input is unclear (e.g., due to voice recognition error), infer the meaning and paraphrase or kindly clarify—always using positive, supportive phrasing.

            - **hintSentences**: Gen ${hintQuantity} hint sentences. These are spoken-style example that helps the user know what to say next. It should:
              - Be within 40% to 80% of 200
              - Be suitable for user’s English level
              - Be easy to repeat aloud
              - HintSentences should respond directly to the systemSentences to naturally continue the conversation. They can include additional information, personal feelings, or opinions to make the dialogue feel more authentic and engaging.

          4. Maintain Human-Like Conversation Rhythm
          - Vary sentence structure naturally
          - Use transitions such as:
              - “That makes sense.”
              - “I see where you're coming from.”
              - “Before we move on, just a quick note…”
          - Occasionally include empathy and encouragement, like:
              - “It’s great to see your team making progress, even with the challenges.”

          5. Handle Speech-to-Text (STT) Errors Gracefully
          - Use fallback expressions like:
              - “Hmm, I think I heard you say ‘allocate resource into nine’ — did you mean ‘allocate resources tonight’?”

          # Examples

          **Example 1:**
          - systemSentences: “The tigers are usually more active in the early morning. Would you like to see them first or check out the giraffes nearby?”
          - hintSentences: “Yes, I want to see the tigers first. I have never seen a real tiger before.”

          **Example 2 (with 'No X flag'):**
          - Chat history: "System: Hi Mr.An, how are you.","User: I'm fine, thank you, and you?","System: I'm fine, too. I wanted to check in on the progress of the ABC English Learning App project. Are we on track to complete the new AI conversation module by the end of this sprint? Also, let me know if there are any blockers you need support with.",“User: I'm so sorry about the project is off track. The client is so angry about that and We have to pay compensation for the contract.”,
          - systemSentences: “I can see that the current situation with the project is challenging, An. It’s great that you're keeping me updated on the project’s status.”
          - hintSentences: “I’m currently in a meeting with the team to revise the project plan and communicate a solution to the client.”

              `,
        input: `
          ### Chat context:
          - Topic: ${topic || '(not provided)'}
          - System Role: ${systemRole || '(not provided)'}
          - User Role: ${userRole || '(not provided)'}
          - Role Based: ${roleBased || false}

          ### Chat history:
          ${chatHistoryPrompt}
      `,
        outputFormat: `
      {
        "context": {
          "topic": topic,
          "userRole": userRole,
          "systemRole": systemRole,
        },   
        "title": "short title of the conversation with length min 4 words and  max 6 words",
        "sentence": "string",
        "hintSentences": ["string", "..."],
        "status": "chatting" | "end"
        }
      `,
        outputStrict: `
        - All output data must be in English (important).
        - Use wording suitable for user's English level (important)
        - Use encouraging and supportive tone to promote language learning.
        - Avoid demotivating or critical feedback.
        - Do not use negative statements like “you are wrong”, “that is incorrect”, or “you failed.”
        - Gently suggest corrections or paraphrase errors while affirming the user’s effort.
        - Promote confidence and a growth mindset in all replies.
      `,
      });

      return response;
    } catch (e) {
      console.error('Error in aiConversationBuilder:', e);
      throw e;
    }
  }
}
