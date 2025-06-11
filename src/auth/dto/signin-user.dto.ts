import { Length, IsString, IsNotEmpty } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, {
    // $value表示当前被验证的值
    // $property表示当前被验证的属性名
    // $target表示当前被验证的对象
    // $constraint1表示第一个约束条件
    // $constraint2表示第二个约束条件
    message: '用户名长度必须在$constraint1到$constraint2之间',
  })
  username: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 32)
  password: string;
}
