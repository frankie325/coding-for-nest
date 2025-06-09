import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

// PartialType表示继承自CreateRoleDto的所有属性，并将其变为可选的
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
