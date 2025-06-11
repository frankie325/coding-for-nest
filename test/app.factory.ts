import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { setupApp } from '../src/setup';
import { DataSource } from 'typeorm';
import { AppDataSource as datasource } from '../ormconfig';
import { readFileSync } from 'fs';
import { join } from 'path';
// 方法一：const app = new AppFactory().init() init -> return app实例
// 方法二：OOP get instance() -> app ,private app, AppFactory constructor的部分进行初始化
//  const appFactory = AppFactory.init() -> const app = appFactory.instance
export class AppFactory {
  connection: DataSource;
  constructor(private app: INestApplication) {}

  get instance() {
    return this.app;
  }
  // 初始化App实例
  static async init() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    setupApp(app);
    const port = 3000;
    await app.listen(port);
    await app.init();
    return new AppFactory(app);
  }
  // 初始化db数据库
  async initDB() {
    if (!datasource.isInitialized) {
      await datasource.initialize();
    }
    this.connection = datasource;
    // 测试的基础的字典数据写入到数据库中
    // Method1: this.connection.runMigrations()
    // Method2: 写入SQL语句
    const queryRunner = this.connection.createQueryRunner();
    const sql =
      readFileSync(join(__dirname, '../src/migrations/init.sql'))
        .toString()
        .replace(/\r?\n|\r/g, '')
        ?.split(';') || [];

    for (let i = 0; i < sql.length; i++) {
      await queryRunner.query(sql[i]);
    }
  }
  // 清除数据库数据 -> 避免测试数据污染
  async cleanup() {
    const entities = this.connection.entityMetadatas;
    try {
      // 禁用外键检查
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0');

      // 清除所有表数据
      for (const entity of entities) {
        const repository = this.connection.getRepository(entity.name);
        await repository.query(`TRUNCATE TABLE ${entity.tableName}`);
      }
    } finally {
      // 重新启用外键检查
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  }

  // 断开与数据库的连接 -> 避免后序数据库连接过多而无法连接
  async destory() {
    await this.connection?.destroy();
  }
}
