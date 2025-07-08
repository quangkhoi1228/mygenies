import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middlewares';
import { FileMiddleware } from './middlewares/file.middleware';
import { dataSourceOptions } from 'db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { ConversationProcessModule } from './modules/chat/conversation/conversation-process/conversation-process.module';
import { AIModule } from './modules/ai/ai.module';
import { ChatMessageModule } from './modules/chat/chat-message/chat-message.module';
import { AudioModule } from './modules/audio/audio.module';
import { GroqModule } from './modules/third-party/groq/groq.module';
import { ConvexModule } from './modules/third-party/convex/convex.module';
import { UserModule } from './modules/user/user/user.module';
import { UserInfoModule } from './modules/user/user-info/user-info.module';
import { ClerkModule } from './modules/third-party/clerk/clerk.module';
import { AuthModule } from './modules/auth/auth.module';
import { DefaultSentenceModule } from './modules/chat/default-sentence/default-sentence.module';
import { UserConversationTopicModule } from './modules/chat/conversation/user-conversation/topic/user-conversation-topic/user-conversation-topic.module';
import { OnboardPhaseModule } from './modules/onboard/onboard-phase/onboard-phase.module';
import { OnboardProcessModule } from './modules/onboard/onboard-process/onboard-process.module';
import { ResourceBundleModule } from './modules/resource-bundle/resource-bundle/resource-bundle.module';
import { ResourceBundleKeyModule } from './modules/resource-bundle/resource-bundle-key/resource-bundle-key.module';
import { ResourceBundleMetaModule } from './modules/resource-bundle/resource-bundle-meta/resource-bundle-meta.module';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { UserConversationTopicHistoryModule } from './modules/chat/conversation/user-conversation/history/user-conversation-topic-history/user-conversation-topic-history.module';
import { UserConversationTopicHistoryLogModule } from './modules/chat/conversation/user-conversation/history/user-conversation-topic-history-log/user-conversation-topic-history-log.module';
import { UserConversationTopicLogModule } from './modules/chat/conversation/user-conversation/topic/user-conversation-topic-log/user-conversation-topic-log.module';
import { UserAiInfoModule } from './modules/user-ai/user-ai-info/user-ai-info.module';
import { UserAiConfigModule } from './modules/user-ai/user-ai-config/user-ai-config.module';
import { UserAiConfigOptionModule } from './modules/user-ai/user-ai-config-option/user-ai-config-option.module';
import { UserAiModule } from './modules/user-ai/user-ai/user-ai.module';
import { UserActiveAiModule } from './modules/user-ai/user-active-ai/user-active-ai.module';
import { StockOrderModule } from './modules/stock-order/stock-order.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { SlackModule } from './modules/third-party/slack/slack.module';
import { ScreenshotModule } from './modules/screenshot/screenshot.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    ConversationProcessModule,
    AIModule,
    ChatMessageModule,
    AudioModule,
    GroqModule,
    ConvexModule,
    UserModule,
    UserInfoModule,
    ClerkModule,
    AuthModule,
    DefaultSentenceModule,
    UserConversationTopicModule,
    OnboardPhaseModule,
    OnboardProcessModule,
    ResourceBundleModule,
    ResourceBundleKeyModule,
    ResourceBundleMetaModule,
    AppConfigModule,
    UserConversationTopicHistoryModule,
    UserConversationTopicHistoryLogModule,
    UserConversationTopicLogModule,
    UserAiInfoModule,
    UserAiConfigModule,
    UserAiConfigOptionModule,
    UserAiModule,
    UserActiveAiModule,
    StockOrderModule,
    PortfolioModule,
    SlackModule,
    ScreenshotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(FileMiddleware)
      .forRoutes({ path: '/files/:filename', method: RequestMethod.GET });
  }
}
