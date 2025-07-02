import { Module } from '@nestjs/common';
import { OnboardPhaseService } from './onboard-phase.service';
import { OnboardPhaseController } from './onboard-phase.controller';
import { OnboardPhase } from './entities/onboard-phase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OnboardPhase])],
  controllers: [OnboardPhaseController],
  providers: [OnboardPhaseService],
  exports: [OnboardPhaseService],
})
export class OnboardPhaseModule {}
