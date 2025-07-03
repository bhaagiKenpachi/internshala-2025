"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const celeb_controller_1 = require("./celebrity/celeb.controller");
const celeb_service_1 = require("./celebrity/celeb.service");
const fan_entity_1 = require("./celebrity/entities/fan.entity");
const fan_service_1 = require("./fan/fan.service");
const fan_controller_1 = require("./fan/fan.controller");
const auth_module_1 = require("./auth/auth.module");
// import { AiController } from './ai/ai.controller';
const celebrity_entity_1 = require("./celebrity/entities/celebrity.entity");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [celebrity_entity_1.Celebrity],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([celebrity_entity_1.Celebrity]),
        ],
        controllers: [celeb_controller_1.CelebrityController],
        providers: [celeb_service_1.CelebrityService],
    }),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({ /* existing config */ entities: [celebrity_entity_1.Celebrity, fan_entity_1.Fan], /* ... */ }),
            typeorm_1.TypeOrmModule.forFeature([celebrity_entity_1.Celebrity, fan_entity_1.Fan])
        ],
        controllers: [celeb_controller_1.CelebrityController, fan_controller_1.FanController],
        providers: [celeb_service_1.CelebrityService, fan_service_1.FanService],
    }),
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule
        ]
    })
], AppModule);
// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: +process.env.DB_PORT,
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       entities: [Celebrity],
//       synchronize: true,
//     }),
//     CelebModule,
//   ],
//   // controllers: [AiController],
// })
// export class AppModule {}
// import { Module } from '@nestjs/common';
// import { CelebModule } from './celeb/celeb.module';
// @Module({
//   imports: [CelebModule],
// })
// export class AppModule {}
//# sourceMappingURL=app.module.js.map