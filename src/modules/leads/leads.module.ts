import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { Lead } from './models/lead.model';

@Module({
  imports: [SequelizeModule.forFeature([Lead])],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
