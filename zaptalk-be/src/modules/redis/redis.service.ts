import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      username: this.configService.get<string>('REDIS_USERNAME'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      retryStrategy: (times) => Math.min(times * 200, 2000),
    });

    this.redis.on('connect', () => {
      console.log('Redis connected');
    });
    this.redis.on('error', (err) => {
      console.error('Redis connected error', err);
    });
  }

  onModuleDestroy() {
    this.redis.quit();
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) return this.redis.set(key, value, 'EX', ttlSeconds);
    return this.redis.set(key, value);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}
