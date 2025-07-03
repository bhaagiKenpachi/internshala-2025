"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CelebModule = void 0;
const common_1 = require("@nestjs/common");
const celeb_controller_1 = require("./celeb.controller");
const celeb_service_1 = require("./celeb.service");
let CelebModule = class CelebModule {
};
exports.CelebModule = CelebModule;
exports.CelebModule = CelebModule = __decorate([
    (0, common_1.Module)({
        controllers: [celeb_controller_1.CelebController],
        providers: [celeb_service_1.CelebService],
    })
], CelebModule);
//# sourceMappingURL=celeb.module.js.map