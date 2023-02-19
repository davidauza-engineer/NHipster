import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DomainDTO } from '../../service/dto/domain.dto';
import { DomainService } from '../../service/domain.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/domains')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('domains')
export class DomainController {
    logger = new Logger('DomainController');

    constructor(private readonly domainService: DomainService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: DomainDTO,
    })
    async getAll(@Req() req: Request): Promise<DomainDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.domainService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: DomainDTO,
    })
    async getOne(@Param('id') id: number): Promise<DomainDTO> {
        return await this.domainService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create domain' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: DomainDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() domainDTO: DomainDTO): Promise<DomainDTO> {
        const created = await this.domainService.save(domainDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Domain', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update domain' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: DomainDTO,
    })
    async put(@Req() req: Request, @Body() domainDTO: DomainDTO): Promise<DomainDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Domain', domainDTO.id);
        return await this.domainService.update(domainDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update domain with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: DomainDTO,
    })
    async putId(@Req() req: Request, @Body() domainDTO: DomainDTO): Promise<DomainDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Domain', domainDTO.id);
        return await this.domainService.update(domainDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete domain' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Domain', id);
        return await this.domainService.deleteById(id);
    }
}
