import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './models/role.model';
import { RolePermission } from './models/role-permission.model';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [SequelizeModule.forFeature([Role, RolePermission])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
