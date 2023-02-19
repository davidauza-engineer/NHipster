import { EntityRepository, Repository } from 'typeorm';
import { Domain } from '../domain/domain.entity';

@EntityRepository(Domain)
export class DomainRepository extends Repository<Domain> {}
