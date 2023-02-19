import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { DomainDTO } from '../src/service/dto/domain.dto';
import { DomainService } from '../src/service/domain.service';

describe('Domain Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(DomainService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all domains ', async () => {
        const getEntities: DomainDTO[] = (await request(app.getHttpServer()).get('/api/domains').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET domains by id', async () => {
        const getEntity: DomainDTO = (
            await request(app.getHttpServer())
                .get('/api/domains/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create domains', async () => {
        const createdEntity: DomainDTO = (
            await request(app.getHttpServer()).post('/api/domains').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update domains', async () => {
        const updatedEntity: DomainDTO = (
            await request(app.getHttpServer()).put('/api/domains').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update domains from id', async () => {
        const updatedEntity: DomainDTO = (
            await request(app.getHttpServer())
                .put('/api/domains/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE domains', async () => {
        const deletedEntity: DomainDTO = (
            await request(app.getHttpServer())
                .delete('/api/domains/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
