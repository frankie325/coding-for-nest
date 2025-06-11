import * as Spec from 'pactum/src/models/Spec';

describe('Auth登录认证 e2e测试', () => {
  let spec: Spec;
  // 每个it都会调用钩子函数
  beforeEach(() => {
    spec = global.spec as Spec;
  });
  // 注册用户
  it('注册用户', () => {
    spec
      .post('/auth/signup')
      .withBody({
        username: 'tom',
        password: '123456',
      })
      .expectStatus(201);
  });

  // 重复注册该用户
  it('重复注册该用户', async () => {
    const user = {
      username: 'tom',
      password: '123456',
    };

    await global.pactum.spec().post('/auth/signup').withBody(user);

    return spec
      .post('/auth/signup')
      .withBody(user)
      .expectStatus(403)
      .expectBodyContains('用户名已存在，请更换用户名');
  });

  // 注册用户传参异常 username password -> 长度，类型，空
  it('注册用户传参异常 username', () => {
    const user = {
      username: 't1',
      password: '123456',
    };
    return spec
      .post('/auth/signup')
      .withBody(user)
      .expectStatus(400)
      .expectBodyContains('"用户名长度必须在3到20之间');
  });

  // 登录用户
  it('登录用户', async () => {
    const user = {
      username: 'admin',
      password: '123456',
    };

    await global.pactum.spec().post('/auth/signup').withBody(user);

    return spec
      .post('/auth/signin')
      .withBody(user)
      .expectStatus(201)
      .expectBodyContains('access_token');
  });

  // 登录用户传参异常 username password -> 长度，类型，空
  it('登录用户传参异常 username', async () => {
    const user = {
      username: 't1',
      password: '123456',
    };

    await global.pactum.spec().post('/auth/signup').withBody(user);

    return spec
      .post('/auth/signin')
      .withBody(user)
      .expectStatus(400)
      .expectBodyContains('"用户名长度必须在3到20之间');
  });

  // 登录用户不存在
  it('登录用户不存在', async () => {
    const user = {
      username: 'null',
      password: '123456',
    };

    return spec
      .post('/auth/signin')
      .withBody(user)
      .expectStatus(403)
      .expectBodyContains('用户不存在，请注册');
  });

  // 登录用户密码错误
  it('登录用户密码错误', async () => {
    const user = {
      username: 'admin',
      password: '123456',
    };

    await global.pactum.spec().post('/auth/signup').withBody(user);

    return spec
      .post('/auth/signin')
      .withBody({ ...user, password: '1234567' })
      .expectStatus(403)
      .expectBodyContains('用户名或密码错误');
  });

  // 补充说明的：
  // user模块 -> headers -> token信息 -> beforeEach -> 获取token
});
