import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthService } from './user/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h', 
      }
    })
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class AppModule {}
