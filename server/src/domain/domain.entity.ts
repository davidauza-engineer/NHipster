/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Domain.
 */
@Entity('domain')
export class Domain extends BaseEntity {
    @Column({ name: 'name', nullable: true })
    name: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
