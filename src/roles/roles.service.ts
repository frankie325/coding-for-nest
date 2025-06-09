import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  // 创建角色
  async create(createRoleDto: CreateRoleDto) {
    const role = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(role);
  }

  // 查询所有角色
  findAll() {
    return this.rolesRepository.find();
  }

  // 查询单个角色
  findOne(id: number) {
    return this.rolesRepository.findOne({
      where: { id },
    });
  }

  // 更新角色
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) {
      throw new BadRequestException(`该角色不存在，id: ${id}`);
    }
    const newRole = this.rolesRepository.merge(role, updateRoleDto);
    return await this.rolesRepository.save(newRole);
  }

  // 删除角色
  remove(id: number) {
    return this.rolesRepository.delete(id);
  }
}
