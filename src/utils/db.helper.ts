import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export const conditionUtils = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
) => {
  Object.keys(obj).forEach((key) => {
    // 当参数存在时才添加条件
    if (obj[key]) {
      const paramKey = key.replace('.', '_');
      queryBuilder.andWhere(`${key} = :${paramKey}`, {
        [paramKey]: obj[key],
      });
    }
  });
  return queryBuilder;
};
