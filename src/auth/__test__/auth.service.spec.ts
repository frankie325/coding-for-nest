import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';

describe('AuthService（登陆认证模块-服务）', () => {
  let authService: AuthService;
  let userService: Partial<UserService>;
  let jwt: Partial<JwtService>;
  let userArr: User[] = []; //模拟数据库，单元测试并不是真的链接到数据库，存储用户信息缓存，判断用户是否注册过

  const mockUser = {
    username: 'test',
    password: '123456',
  };

  beforeEach(async () => {
    userService = {
      find: (username: string) => {
        const user = userArr.find((user) => user.username === username);
        return Promise.resolve(user || null);
      },
      create: async (user: User) => {
        const tempUser = new User();
        tempUser.id = Math.floor(Math.random() * 1000);
        tempUser.username = user.username;
        tempUser.password = user.password;
        userArr.push(tempUser);
        return Promise.resolve(tempUser);
      },
    };
    jwt = {
      signAsync(payload: string | Buffer | object, options?: JwtSignOptions) {
        return Promise.resolve('token');
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      // 提供AuthService中相关的依赖
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwt,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  //   测试完之后，清空缓存
  afterEach(() => {
    userArr = [];
  });

  it('鉴权-初始化-实例化', () => {
    // 断言authService已经定义
    expect(authService).toBeDefined();
  });

  it('用户初次注册', async () => {
    const user = await authService.signup(mockUser.username, mockUser.password);
    expect(user).toBeDefined();
    expect(user.username).toBe(mockUser.username);
  });

  it('用户使用相同的用户名注册', async () => {
    await authService.signup(mockUser.username, mockUser.password);
    await expect(
      authService.signup(mockUser.username, mockUser.password),
    ).rejects.toThrowErrorMatchingSnapshot(); //生成一个快照测试

    // 如果测试抛出的错误与真实的代码抛出的错误不一致，则报错。说明真实的代码写错了
    // await expect(
    //   authService.signup(mockUser.username, mockUser.password),
    // ).rejects.toThrow(new ForbiddenException('用户名已存在，请更换用户名1'));
    await expect(
      authService.signup(mockUser.username, mockUser.password),
    ).rejects.toThrow(new ForbiddenException('用户名已存在，请更换用户名'));
    /*
    快照测试：
        第一次运行测试时，Jest 会捕获错误信息并创建快照文件
        后续运行时，将新的错误信息与存储的快照进行比较
        快照文件通常保存在 __snapshots__ 目录下
    */
  });

  it('用户登录', async () => {
    // 注册新用户
    await authService.signup(mockUser.username, mockUser.password);
    // 登陆
    const res = await authService.signin(mockUser.username, mockUser.password);
    expect(res.access_token).toBe('token');
  });

  it('用户登录-密码错误', async () => {
    // 注册新用户
    await authService.signup(mockUser.username, mockUser.password);
    // 登陆
    await expect(
      authService.signin(mockUser.username, '111111'),
    ).rejects.toThrow(new ForbiddenException('用户名或密码错误'));
  });

  it('用户登录-用户名不存在', async () => {
    // 注册新用户
    await authService.signup(mockUser.username, mockUser.password);
    // 登陆
    await expect(authService.signin('test222', '111111')).rejects.toThrow(
      new ForbiddenException('用户不存在，请注册'),
    );
  });
});
