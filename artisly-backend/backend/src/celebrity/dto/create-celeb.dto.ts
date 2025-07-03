import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsInt,
  Min,
  IsOptional,
} from "class-validator";

export class CreateCelebrityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsUrl()
  instagramUrl: string;

  @IsInt()
  @Min(1000)
  fanbaseCount: number;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;
}

// import { Injectable } from '@nestjs/common';
// import OpenAI from 'openai';

// @Injectable()
// export class CelebService {
//   private ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//   async aiSearch(prompt: string) {
//     // Improved: handle OpenAI API errors and malformed JSON gracefully
//     try {
//       const resp = await this.ai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'user',
//             content: `List 5 celebs matching: "${prompt}" as JSON array of {"name": "...", "image": "..."}`,
//           },
//         ],
//         max_tokens: 200,
//       });

//       const text = resp.choices?.[0]?.message?.content?.trim();
//       if (!text) throw new Error('No response from AI');

//       try {
//         return JSON.parse(text);
//       } catch (e) {
//         // Try to extract JSON from text if AI wrapped it in code block
//         const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
//         if (match) {
//           return JSON.parse(match[1]);
//         }
//         throw new Error('Malformed JSON from AI');
//       }
//     } catch (err) {
//       // Log error and return empty array as fallback
//       console.error('AI search error:', err);
//       return [];
//     }
//   }

//   async aiAutofill(name: string) {
//     try {
//       const resp = await this.ai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'user',
//             content: `Provide details (genre, country, social handles, fanbase) for: "${name}" in JSON.`,
//           },
//         ],
//         max_tokens: 200,
//       });

//       const text = resp.choices?.[0]?.message?.content?.trim();
//       if (!text) throw new Error('No response from AI');

//       try {
//         return JSON.parse(text);
//       } catch (e) {
//         // Try to extract JSON from text if AI wrapped it in code block
//         const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
//         if (match) {
//           return JSON.parse(match[1]);
//         }
//         throw new Error('Malformed JSON from AI');
//       }
//     } catch (err) {
//       console.error('AI autofill error:', err);
//       return null;
//     }
//   }

//   async create(dto) { /* Prisma write */ }
//   async findOne(id: string) { /* Prisma read */ }
// }
