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
exports.FanController = void 0;
const common_1 = require("@nestjs/common");
const fan_service_1 = require("./fan.service");
let FanController = class FanController {
    constructor(fanService) {
        this.fanService = fanService;
    }
    follow(fanId, celebId) {
        return this.fanService.followCelebrity(fanId, celebId);
    }
    unfollow(fanId, celebId) {
        return this.fanService.unfollowCelebrity(fanId, celebId);
    }
    getFollowing(fanId) {
        return this.fanService.getFollowedCelebrities(fanId); // ✅ should return array
    }
};
exports.FanController = FanController;
__decorate([
    (0, common_1.Post)(":fanId/follow/:celebId"),
    __param(0, (0, common_1.Param)("fanId")),
    __param(1, (0, common_1.Param)("celebId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], FanController.prototype, "follow", null);
__decorate([
    (0, common_1.Delete)(":fanId/unfollow/:celebId"),
    __param(0, (0, common_1.Param)("fanId")),
    __param(1, (0, common_1.Param)("celebId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], FanController.prototype, "unfollow", null);
__decorate([
    (0, common_1.Get)(":fanId/following"),
    __param(0, (0, common_1.Param)("fanId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FanController.prototype, "getFollowing", null);
exports.FanController = FanController = __decorate([
    (0, common_1.Controller)("fan"),
    __metadata("design:paramtypes", [fan_service_1.FanService])
], FanController);
//# sourceMappingURL=fan.controller.js.map