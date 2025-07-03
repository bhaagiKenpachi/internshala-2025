"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCelebrityDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCelebrityDto {
}
exports.CreateCelebrityDto = CreateCelebrityDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCelebrityDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCelebrityDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCelebrityDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateCelebrityDto.prototype, "instagramUrl", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], CreateCelebrityDto.prototype, "fanbaseCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateCelebrityDto.prototype, "thumbnailUrl", void 0);
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
//# sourceMappingURL=create-celeb.dto.js.map