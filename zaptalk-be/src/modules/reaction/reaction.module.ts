import { Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { PrismaModule } from 'src/database/prisma.module';
import { StreamModule } from '../stream/stream.module';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService],
  imports: [PrismaModule, StreamModule],
})
export class ReactionModule {}
