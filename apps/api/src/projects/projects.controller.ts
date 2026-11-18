import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, CreateApiKeyDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Developer Projects & API Keys')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects for the current developer' })
  findAll(@CurrentUser('id') userId: string) {
    return this.projectsService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new website project' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details, installations, and domains' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.projectsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project settings' })
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete project' })
  delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.projectsService.delete(userId, id);
  }

  @Get(':id/api-keys')
  @ApiOperation({ summary: 'List API keys for project' })
  listApiKeys(@CurrentUser('id') userId: string, @Param('id') projectId: string) {
    return this.projectsService.listApiKeys(userId, projectId);
  }

  @Post(':id/api-keys')
  @ApiOperation({ summary: 'Generate a new API key for project' })
  createApiKey(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
    @Body() dto: CreateApiKeyDto
  ) {
    return this.projectsService.createApiKey(userId, projectId, dto);
  }

  @Delete(':id/api-keys/:keyId')
  @ApiOperation({ summary: 'Revoke an existing API key' })
  revokeApiKey(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
    @Param('keyId') keyId: string
  ) {
    return this.projectsService.revokeApiKey(userId, projectId, keyId);
  }

  @Post(':id/api-keys/:keyId/rotate')
  @ApiOperation({ summary: 'Rotate API key (revokes old and issues new)' })
  rotateApiKey(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
    @Param('keyId') keyId: string
  ) {
    return this.projectsService.rotateApiKey(userId, projectId, keyId);
  }
}
