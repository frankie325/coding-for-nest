import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';
import { SigninUserDto } from '../dto/signin-user.dto';
import { Request } from 'express';

/*
describe(name, fn) 是一个将多个相关的测试组合在一起的块，使用 describe 包裹相关测试用例更加友好

test是将运行测试的方法
别名：it(name, fn, timeout)

Expect 断言：
判断一个值是否满足条件，你会使用到expect函数
结合匹配器函数来断言某个值，toBeDefined
*/
describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;
  beforeEach(async () => {
    // 模拟AuthService，与后续的依赖项UserService等无关联的依赖关系
    mockAuthService = {
      signin: (username: string, password: string) => {
        return Promise.resolve({
          access_token: 'token',
        });
      },
      signup: (username: string, password: string) => {
        const user = new User();
        user.username = username;
        user.password = password;
        user.roles = [{ id: 1, name: 'admin', users: [], menus: [] }];
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('鉴权-初始化-实例化', () => {
    // 断言controller已经定义
    expect(controller).toBeDefined();
  });

  it('鉴权-控制器-signin注册', async () => {
    const mockRequest = {} as Request; // mock request object
    const res = await controller.signin(
      {
        username: 'test',
        password: '123456',
      } as SigninUserDto,
      mockRequest,
    );

    // 断言res不为空
    expect(res).not.toBeNull();
    // 断言返回的access_token为token
    expect(res.access_token).toBe('token');
    // expect(res.access_token).toBe('token1');
  });

  it('鉴权-控制器-signup', async () => {
    const res = await controller.signup({
      username: 'test',
      password: '123456',
    } as SigninUserDto);
    expect(res).not.toBeNull();
    expect(res.id).not.toBeNull();
    expect(res.username).toBe('test');
    // 断言角色数组大于0
    expect(res.roles.length).toBeGreaterThan(0);
  });
});
