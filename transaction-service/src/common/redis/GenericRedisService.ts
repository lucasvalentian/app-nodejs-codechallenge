import Redis from 'ioredis';


const redis = new Redis({
  host: 'redis_cache',
  port: 6379,
  password: '',
  db: 0,
});

export class GenericRedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = redis;
  }


  async set(key: string, value: any, ttl: number = 3600) {
    try {
  
      await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }


  async get(key: string) {
    try {
      const value = await this.redisClient.get(key);
      if (value) {
        return { success: true, data: JSON.parse(value) };
      }
      return { success: false, error: 'Key not found' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async del(key: string) {
    try {
      await this.redisClient.del(key);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }


  async exists(key: string) {
    try {
      const exists = await this.redisClient.exists(key);
      return { success: true, data: exists === 1 };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }


  async quit() {
    try {
      await this.redisClient.quit();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
