import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ZodValidationPipe } from 'src/pipe/zodValidationPipe';
import { addReactionSchema } from './schema/add-reaction.schema';
import { AddReactionDto } from './dto/add-reaction.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { users } from '@prisma/client';
import { SUCCESS_MESSAGES } from 'src/constants/messages';

@UseGuards(AccessTokenGuard)
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  async addReaction(
    @Body(new ZodValidationPipe(addReactionSchema)) body: AddReactionDto,
    @GetCurrentUser() user: users,
  ) {
    const data = await this.reactionService.addReaction(body, user);
    return {
      data,
      message: SUCCESS_MESSAGES.REACTION_ADDED,
    };
  }
}
