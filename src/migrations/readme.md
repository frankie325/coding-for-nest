## 生成迁移文件

当你更改数据库架构时，TypeORM 能够自动生成架构更改的迁移文件。

生成迁移文件到src/migrations文件中，并以`时间戳-migration`的形式命名

```bash
npm run typeorm -- -d ./ormconfig.ts migration:generate src/migrations/migration
```

- 创建迁移目录也就是`src/migrations`

```bash
npm run typeorm migration:create src/migrations/migration
```

- 执行迁移文件

```bash
npm run typeorm -- -d ./ormconfig.ts migration:run
```

- 回滚执行的迁移文件

```bash
npm run typeorm -- -d ./ormconfig.ts migration:revert
```
