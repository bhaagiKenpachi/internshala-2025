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
exports.FanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const celebrity_entity_1 = require("../celebrity/entities/celebrity.entity");
const fan_entity_1 = require("../celebrity/entities/fan.entity");
let FanService = class FanService {
    constructor(fanRepo, celebRepo) {
        this.fanRepo = fanRepo;
        this.celebRepo = celebRepo;
    }
    async followCelebrity(fanId, celebId) {
        const fan = await this.fanRepo.findOne({ where: { id: fanId }, relations: ['followedCelebrities'] });
        const celeb = await this.celebRepo.findOneBy({ id: celebId });
        if (!fan || !celeb)
            throw new common_1.NotFoundException('Fan or Celebrity not found');
        fan.followedCelebrities.push(celeb);
        return this.fanRepo.save(fan);
    }
    async unfollowCelebrity(fanId, celebId) {
        const fan = await this.fanRepo.findOne({ where: { id: fanId }, relations: ['followedCelebrities'] });
        if (!fan)
            throw new common_1.NotFoundException('Fan not found');
        fan.followedCelebrities = fan.followedCelebrities.filter(c => c.id !== celebId);
        return this.fanRepo.save(fan);
    }
    async getFollowedCelebrities(fanId) {
        var _a;
        const fan = await this.fanRepo.findOne({
            where: { id: fanId },
            relations: ['followedCelebrities'],
        });
        return (_a = fan === null || fan === void 0 ? void 0 : fan.followedCelebrities) !== null && _a !== void 0 ? _a : []; // ✅ always return an array
    }
};
exports.FanService = FanService;
exports.FanService = FanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fan_entity_1.Fan)),
    __param(1, (0, typeorm_1.InjectRepository)(celebrity_entity_1.Celebrity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FanService);
//# sourceMappingURL=fan.service.js.map