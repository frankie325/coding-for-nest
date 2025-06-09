import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu) private readonly menusRepository: Repository<Menu>,
  ) {}
  create(createMenuDto: CreateMenuDto) {
    const role = this.menusRepository.create(createMenuDto);
    return this.menusRepository.save(role);
  }

  findAll() {
    return this.menusRepository.find();
  }

  findOne(id: number) {
    return this.menusRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const role = await this.findOne(id);
    if (!role) {
      throw new BadRequestException(`该菜单不存在，id: ${id}`);
    }
    const newMenu = this.menusRepository.merge(role, updateMenuDto);
    return await this.menusRepository.save(newMenu);
  }

  remove(id: number) {
    return this.menusRepository.delete(id);
  }
}
