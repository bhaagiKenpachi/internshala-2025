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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CelebrityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const celebrity_entity_1 = require("./entities/celebrity.entity");
let CelebrityService = class CelebrityService {
    constructor(celebRepo) {
        this.celebRepo = celebRepo;
    }
    async create(dto) {
        const celeb = this.celebRepo.create(dto);
        return this.celebRepo.save(celeb);
    }
    async findOne(id) {
        const celeb = await this.celebRepo.findOneBy({ id });
        if (!celeb)
            throw new common_1.NotFoundException('Celebrity not found');
        return Object.assign(Object.assign({}, celeb), { profileViews: Math.floor(Math.random() * 20000), highlights: [
                '🎤 Live at Global Awards 2025',
                '📀 New album hit 1M streams',
                '🎬 Featured in Netflix documentary',
            ], engagements: {
                likes: Math.floor(Math.random() * 5000),
                comments: Math.floor(Math.random() * 1000),
                shares: Math.floor(Math.random() * 2000),
            } });
    }
    findAll() {
        return this.celebRepo.find();
    }
};
exports.CelebrityService = CelebrityService;
exports.CelebrityService = CelebrityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(celebrity_entity_1.Celebrity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CelebrityService);
// import { Injectable } from '@nestjs/common';
// @Injectable()
// export class CelebService {
//   findAll() {
//     return [
//       {
//         name: 'Coldplay',
//         category: 'Band',
//         country: 'UK',
//         instagramUrl: 'https://instagram.com/coldplay',
//         fanbaseCount: 20000000,
//       },
//       {
//         name: 'Shakira',
//         category: 'Solo',
//         country: 'Colombia',
//         instagramUrl: 'https://instagram.com/shakira',
//         fanbaseCount: 18000000,
//       },
//     ];
//   }
// }
//# sourceMappingURL=celeb.service.js.map