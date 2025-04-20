// 实现Controller装饰器：类装饰器
function Controller(root: string) {
  return function (target: any) {
    target.prototype.root = root; // 将路由前缀添加到控制器原型上
    // console.log(target.prototype); // MyController {}
  };
}

// 实现Get装饰器：方法装饰器
function Get(route: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // target就是类的原型对象
    console.log(target === MyController.prototype); // true
    console.log(target, propertyKey, descriptor);

    // 初始化handlerGets数组（如果尚未初始化）
    if (!target.handlerGets) target.handlerGets = [];
    // 将路由方法信息添加到控制器原型上
    target.handlerGets.push({
      route: route,
      method: propertyKey,
    });
    // console.log(target); // MyController {}
  };
}
// 定义接口来扩展 MyController
interface ControllerType {
  root?: string;
  handlerGets?: Array<{ route: string; method: string }>;
}

// 通过声明合并来扩展 MyController 类型
@Controller('/')
class MyController implements ControllerType {
  public root: string;
  public handlerGets?: Array<{ route: string; method: string }>;
  constructor(
    root: string = '',
    handlerGets: Array<{ route: string; method: string }> = [],
  ) {
    this.root = root;
    this.handlerGets = handlerGets;
  }
  @Get('api/users')
  getHello(): string {
    return 'Hello World!';
  }
}

class Module {
  public controllers: MyController[] = [];

  constructor(public controllersList: { new (): MyController }[]) {
    controllersList.forEach((controller) => {
      this.controllers.push(new controller());
      console.log(new controller());
      //   console.log(Object.getPrototypeOf(this.controllers[0]));
    });
  }
}

function init() {
  return new Module([MyController]);
}

// 模拟请求方法
const requestList = [
  {
    method: 'get',
    route: 'api/users',
    options: {},
  },
  {
    method: 'get',
    route: 'api/deleteUser',
    options: {},
  },
];

function main() {
  const m = init();
  const controllers = m.controllers;

  requestList.forEach((req) => {
    const { route, options } = req;
    // 处理所有控制器
    for (const controller of controllers) {
      //   console.log(Object.getPrototypeOf(controller));
      // 拼接路由
      controller.handlerGets?.forEach((handler) => {
        const fullRoute = `${controller.root}${handler.route}`;
        console.log(`请求的路由：${route}，控制器的路由：${fullRoute}`);

        if (fullRoute === route) {
          // 路由匹配成功
          console.log(`请求的路由：${route}`);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          controller[handler.method](options); // 调用对应的方法
        }
      });
    }
  });
}

main();
