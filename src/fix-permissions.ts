import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Role } from './modules/roles/models/role.model';
import { Permission } from './modules/permissions/models/permission.model';
import { RolePermission } from './modules/roles/models/role-permission.model';

async function fixPermissions() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('🛠️ Starting Permission Sync...');

    const roleModel = app.get<typeof Role>('RoleRepository');
    const permissionModel = app.get<typeof Permission>('PermissionRepository');
    const rolePermissionModel = app.get<typeof RolePermission>('RolePermissionRepository');

    // 1. Get ADMIN role
    const adminRole = await roleModel.findOne({ where: { name: 'ADMIN' } });
    if (!adminRole) {
      console.error('❌ ADMIN role not found!');
      return;
    }
    console.log(`✅ Found ADMIN role (ID: ${adminRole.id})`);

    // 2. Get all permissions
    const allPermissions = await permissionModel.findAll();
    console.log(`✅ Found ${allPermissions.length} total permissions in system`);

    // 3. Link them
    let count = 0;
    for (const perm of allPermissions) {
      const exists = await rolePermissionModel.findOne({
        where: { roleId: adminRole.id, permissionId: perm.id }
      });

      if (!exists) {
        await rolePermissionModel.create({
          roleId: adminRole.id,
          permissionId: perm.id
        } as any);
        count++;
      }
    }

    console.log(`🚀 SYNC COMPLETE: Linked ${count} new permissions to ADMIN role.`);
    
    // 4. Verify
    const verifyRole = await roleModel.findByPk(adminRole.id, { include: [Permission] });
    console.log(`📊 ADMIN now has ${verifyRole?.permissions?.length || 0} permissions.`);

  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    await app.close();
  }
}

fixPermissions();
