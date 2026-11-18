import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FestivalsModule } from './festivals/festivals.module';
import { AnimationsModule } from './animations/animations.module';
import { ProjectsModule } from './projects/projects.module';
import { EditorModule } from './editor/editor.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';
import { ControlCenterModule } from './control-center/control-center.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    FestivalsModule,
    AnimationsModule,
    ProjectsModule,
    EditorModule,
    PaymentsModule,
    SubscriptionsModule,
    AdminModule,
    ControlCenterModule
  ]
})
export class AppModule {}
