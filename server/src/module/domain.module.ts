import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainController } from '../web/rest/domain.controller';
import { DomainRepository } from '../repository/domain.repository';
import { DomainService } from '../service/domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([DomainRepository])],
    controllers: [DomainController],
    providers: [DomainService],
    exports: [DomainService],
})
export class DomainModule {}
