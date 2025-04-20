import { registerAs } from '@nestjs/config';

// 使用registerAs()函数返回一个“带名称空间”的配置对象
export default registerAs('database', () => ({
  name: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}));
