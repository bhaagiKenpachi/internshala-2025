"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
// import { getRepository } from 'typeorm';
// import { User } from './user/user.entity';
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors(); // 
    await app.listen(3001);
    // Seed users on server start
    //  const userRepo = getRepository(User);
    //  const existingFan = await userRepo.findOne({ where: { email: 'fan' } });
    //  if (!existingFan) {
    //    await userRepo.save([
    //      { email: 'fan', password: '1234', role: 'fan' },
    //      { email: 'celebrity', password: '1234', role: 'celebrity' },
    //    ]);
    //    console.log('✅ Default users seeded');
    //  }
}
bootstrap();
//# sourceMappingURL=main.js.map