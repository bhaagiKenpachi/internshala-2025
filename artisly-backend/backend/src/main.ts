import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { getRepository } from 'typeorm';
// import { User } from './user/user.entity';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
