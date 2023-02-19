import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DomainDTO } from '../service/dto/domain.dto';
import { DomainMapper } from '../service/mapper/domain.mapper';
import { DomainRepository } from '../repository/domain.repository';

const relationshipNames = [];

@Injectable()
export class DomainService {
    logger = new Logger('DomainService');

    constructor(@InjectRepository(DomainRepository) private domainRepository: DomainRepository) {}

    async findById(id: number): Promise<DomainDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.domainRepository.findOne(id, options);
        return DomainMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<DomainDTO>): Promise<DomainDTO | undefined> {
        const result = await this.domainRepository.findOne(options);
        return DomainMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<DomainDTO>): Promise<[DomainDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.domainRepository.findAndCount(options);
        const domainDTO: DomainDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((domain) => domainDTO.push(DomainMapper.fromEntityToDTO(domain)));
            resultList[0] = domainDTO;
        }
        return resultList;
    }

    async save(domainDTO: DomainDTO, creator?: string): Promise<DomainDTO | undefined> {
        const entity = DomainMapper.fromDTOtoEntity(domainDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.domainRepository.save(entity);
        return DomainMapper.fromEntityToDTO(result);
    }

    async update(domainDTO: DomainDTO, updater?: string): Promise<DomainDTO | undefined> {
        const entity = DomainMapper.fromDTOtoEntity(domainDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.domainRepository.save(entity);
        return DomainMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.domainRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
