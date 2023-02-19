import { Domain } from '../../domain/domain.entity';
import { DomainDTO } from '../dto/domain.dto';

/**
 * A Domain mapper object.
 */
export class DomainMapper {
    static fromDTOtoEntity(entityDTO: DomainDTO): Domain {
        if (!entityDTO) {
            return;
        }
        let entity = new Domain();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Domain): DomainDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new DomainDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
