import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { AudioService } from '../audio/audio.service';
import { AiBuilderService } from './ai-builder.service';
import { AIConversationBuilderDto } from './dto/ai-builder.dto';

import { AuthRequest } from '../auth/interface/auth-request.interface';
import { OnboardProcessService } from '../onboard/onboard-process/onboard-process.service';
import { UserService } from '../user/user/user.service';
import {
  AIDto,
  DetectMispronunciationDto,
  GenerateSayHelloSentenceDto,
  GenerateSentencesFromIdeaDto,
  RefineUserSentenceDto,
} from './dto/ai.dto';
import { TranscriptDto } from './dto/transcript.dto';
import { generateSpeechFromTextEL } from './elevenlab-utils';
@Injectable()
export class AIService {
  constructor(
    private readonly audioService: AudioService,
    private readonly aiBuilderService: AiBuilderService,
    private readonly userService: UserService,
    private readonly onboardProcessService: OnboardProcessService,
  ) {}

  async generateSpeech(AIDto: AIDto) {
    try {
      const data = await generateSpeechFromTextEL(AIDto.text);

      // save the audio file to a specific location
      const audioUrl = await this.audioService.createFile(data, AIDto.text);

      // upload convex
      // const storageId = await this.convexService.handleUploadFile(data);

      return {
        ...audioUrl,
        convexUrl: '',
        // `${process.env.CONVEX_HTTP_ACTION_URL}/getFile?storageId=${storageId}`,
      };
    } catch (error) {
      console.error('GenerateSpeechFromText error:', error);

      throw new InternalServerErrorException('Error in generateSpeechFromText');
    }
  }

  async detectMispronunciation(
    detectMispronunciationDto: DetectMispronunciationDto,
  ) {
    try {
      const data = await this.aiBuilderService.aiBuilder({
        role: 'detect mispronunciation assistant',
        taskOverview: 'Detect mispronunciation',
        taskDetail: `
          Detect mispronunciations and missing/mispronounced commas by comparing the user’s spoken sentence with the expected sentence.

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
        `,
        input: `
          - User sentence: ${detectMispronunciationDto.userSentence}  
          - Expected sentence: ${detectMispronunciationDto.expectedSentence}  
        `,
        outputFormat: `
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
        `,
      });

      return data;
    } catch (error) {
      console.error('Detect mispronunciation error:', error);

      throw new InternalServerErrorException(
        'Failed to detect mispronunciation',
      );
    }
  }

  async transcript(input: TranscriptDto) {
    try {
      const response = await axios.get(input.audioUrl, {
        responseType: 'arraybuffer',
      });

      const buffer = Buffer.from(response.data);

      const data = await this.aiBuilderService.aiAudioBuilder({
        buffer,
        prompt: input.prompt,
        language: 'English',
      });

      return {
        ...input,
        ...data,
      };
    } catch (error: any) {
      console.error('Transcription error:', error);

      throw new InternalServerErrorException('Transcription failed');
    }
  }

  async refine(refineUserSentenceDto: RefineUserSentenceDto) {
    try {
      const response = await this.aiBuilderService.aiBuilder({
        role: 'English conversation improvement assistant',
        taskOverview:
          'Refine the user’s spoken sentence to make it clear, concise, and grammatically correct.',
        taskDetail: `
            Given the user's sentence and conversation context, rewrite the sentence to improve clarity, grammar, and naturalness, while preserving the original meaning.
            Instructions:
            - Remove thinking sounds and filler phrases (e.g., "uh", "um", "like", "you know", "so", "yeah", "kind of", etc.)
            - Keep the sentence concise and easy to understand
            - Maintain the original meaning and intent of the sentence
            - Use proper grammar and fluent English structure
            - Write as a natural English speaker would in the same context
            # Example
              "originalSentence": "Well, learning English is, um, quite beneficial, you know. Like, it helps you talk to foreigners, and when you travel, you can kind of understand the local culture better. Also, you can, um, learn more stuff to grow in your career, read books, watch movies, and, yeah, communicate with colleagues, especially when discussing work or something like that. So, yeah, it’s pretty useful, I guess.",
              "refinedSentence": "Learning English brings many benefits. It allows me to communicate with foreigners, understand local culture when traveling, and access more knowledge to support my career development. It also helps me enjoy books, movies, and music in English, and makes it easier to work and exchange ideas with colleagues, especially in international environments."
          `,
        input: `
          ### Context of conversation:
          - **Topic**: ${refineUserSentenceDto.topic || ''}
          - **System Role**: ${refineUserSentenceDto.systemRole || ''}
          - **User Role**: ${refineUserSentenceDto.userRole || ''}

          ### Chat history:
          ${refineUserSentenceDto.chatHistory || 'No previous chat history.'}

          ### User's sentence to improve:
          "${refineUserSentenceDto.userSentence}"
        `,
        outputFormat: `
          {
              "originalSentence": "Original user sentence here.",
              "refinedSentence": "Refined and improved sentence here."
          }
          `,
      });

      return response;
    } catch (error: any) {
      console.error('Chat refine generation error:', error);

      throw new InternalServerErrorException(
        'Failed to generate refine chat response',
      );
    }
  }

  async getContext(input: GenerateSayHelloSentenceDto) {
    try {
      const conversationBuilderInput: AIConversationBuilderDto = {
        quantity: input.quantity,
        roleBased: input.roleBased,
        context: {
          topic: input.topic,
          systemRole: input.systemRole,
          userRole: input.userRole,
        },
        chatHistory: input.chatHistory,
      };
      const response = input.roleBased
        ? await this.aiBuilderService.aiConversationBuilder(
            conversationBuilderInput,
          )
        : await this.aiBuilderService.aiTalkNowConversationBuilder(
            conversationBuilderInput,
          );

      return response;
    } catch (error: any) {
      console.error('Chat say hello generation error:', error);

      throw new InternalServerErrorException(
        'Failed to generate say hello chat response',
      );
    }
  }

  async translate({ text }: { text: string }) {
    try {
      const response = await this.aiBuilderService.aiBuilder({
        role: 'Translator',
        taskOverview: 'Translate the text from English to the Vietnamese',
        taskDetail:
          ' Translate the provided English text into Vietnamese naturally and accurately',
        input: text,
        outputFormat: `{
              "originalText": "Original English sentence here.",
              "translatedText": "Vietnamese translation here."
            }`,
        outputStrict:
          'The output must be a valid JSON object with the following structure: { "translatedText": "string" }',
        language: 'Vietnamese',
      });

      return response;
    } catch (error: any) {
      console.error('Translate generation error:', error);

      throw new InternalServerErrorException(
        'Failed to generate translate chat response',
      );
    }
  }

  async generateSentencesFromIdea(
    generateSentencesFromIdeaDto: GenerateSentencesFromIdeaDto,
  ) {
    try {
      const response = await this.aiBuilderService.aiBuilder({
        role: 'Creative writing assistant',
        taskOverview: 'Generate a short English conversation',
        taskDetail: ` Based on the user's idea, you will generate a list of meaningful and coherent English sentences that reflect the idea. Each sentence should be grammatically correct and natural in tone. 
        
        Based on the idea provided (can be in any language), generate ${generateSentencesFromIdeaDto.count} different English sentences that express or are inspired by this idea.
        `,
        input: `
          - Idea: ${generateSentencesFromIdeaDto.text}
        `,
        outputFormat: `
          {
            "idea": "Original input idea here.",
            "generatedSentences": [
              "First English sentence.",
              "Second English sentence.",
              ...
            ]
          }
        `,
      });

      return response;
    } catch (error: any) {
      console.error('Generation ideas error:', error);

      throw new InternalServerErrorException('Failed to generate ideas');
    }
  }

  async generateConversation(
    topic: string,
    userRole: string,
    systemRole: string,
  ) {
    try {
      const response = await this.aiBuilderService.aiBuilder({
        role: 'English conversation builder assistant',
        taskOverview: 'Generate a short English conversation',
        taskDetail: `  Generate a short English conversation with **up to 10 sentences** between two intermediate english level participants:  `,
        input: `
          - Topic: ${topic}
          - User Role: ${userRole}
          - System Role: ${systemRole}
        `,
        outputFormat: `
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
        `,
      });

      return response;
    } catch (error: any) {
      console.error('Generate conversation error:', error);

      throw new InternalServerErrorException('Failed to generate conversation');
    }
  }

  async generateLetsTalkGeneralTopic(
    req: AuthRequest,
    topicCount: number = 10,
  ) {
    try {
      const { languageLevel, learningPurpose }: any =
        await this.onboardProcessService.getUserOnboardInfo(req.user.userId);

      const response = await this.aiBuilderService.aiBuilder({
        role: 'AI English Learning Scenario Generator',
        taskOverview: 'Generate  English conversation topic',
        taskDetail: `Based on the user's English level, professional background, and learning purpose, generate a list of ${topicCount} engaging and relevant conversation scenarios that encourage the user to start speaking English with an AI assistant.
        Each scenario must be designed to:
        - Match the user's English speaking ability
        - Reflect the user's domain knowledge or work experience
        - Align with the user's motivation for learning English (e.g., travel, study abroad, career advancement, personal growth)
        - Be realistic, helpful, and action-inspiring (encourage the user to click and start practicing)
        - Optionally include **references to objects, situations, or cultural aspects from Vietnam** to make the scenario feel more familiar and relatable to Vietnamese users
        Each item in the list must include:
        {
          "scenario": (a brief and clear description of the conversation topic),
          "userRole": (the role the user plays in the scenario),
          "systemRole": (the role the AI will play),
          "name": (a short, appealing title for the conversation)
        }
        `,
        input: `
          - User's English level: ${languageLevel}
          - User's purpose for learning English: ${learningPurpose} (a list of 1 or more motivations)

        `,
        outputFormat: `
          {
            "userLevel": "user level of the conversation",
            "target": "target of the conversation",
            "count": "count of the conversation topic",
            "topics": [
              {
                "scenario": "scenario detail of the conversation from 10 to 15 words",
                "userRole": "user role of the conversation",
                "systemRole": "system role of the conversation",
                "name": "name of the conversation between 4 and 6 words"
              },
                ...
              ]
            }
        `,
      });

      return response;
    } catch (error: any) {
      console.error('Generate conversation error:', error);

      throw new InternalServerErrorException('Failed to generate conversation');
    }
  }
}
