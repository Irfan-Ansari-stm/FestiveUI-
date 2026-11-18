import { Module } from '@nestjs/common';
import { ControlCenterController } from './control-center.controller';
import { ControlCenterService } from './control-center.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ControlCenterController],
  providers: [ControlCenterService],
  exports: [ControlCenterService]
})
export class ControlCenterModule {}
