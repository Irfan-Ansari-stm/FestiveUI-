import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EditorService } from './editor.service';
import { SaveEditorDocumentDto, CreateVersionSnapshotDto, ExportCodeDto } from './dto/editor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Visual Animation Editor')
@Controller('editor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EditorController {
  constructor(private readonly editorService: EditorService) {}

  @Post('projects')
  @ApiOperation({ summary: 'Save new visual editor canvas project' })
  createOrSave(@CurrentUser('id') userId: string, @Body() dto: SaveEditorDocumentDto) {
    return this.editorService.createOrSave(userId, dto);
  }

  @Get('projects/:id')
  @ApiOperation({ summary: 'Load editor project document state with version history' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.editorService.findOne(userId, id);
  }

  @Patch('projects/:id')
  @ApiOperation({ summary: 'Autosave / update editor canvas state' })
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: Partial<SaveEditorDocumentDto>) {
    return this.editorService.update(userId, id, dto);
  }

  @Post('projects/:id/versions')
  @ApiOperation({ summary: 'Create a version snapshot of editor canvas' })
  createVersion(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateVersionSnapshotDto
  ) {
    return this.editorService.createVersion(userId, id, dto);
  }

  @Get('projects/:id/versions')
  @ApiOperation({ summary: 'List version history for editor project' })
  getVersions(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.editorService.getVersions(userId, id);
  }

  @Post('projects/:id/restore/:versionId')
  @ApiOperation({ summary: 'Restore editor project canvas to a previous version snapshot' })
  restoreVersion(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Param('versionId') versionId: string
  ) {
    return this.editorService.restoreVersion(userId, id, versionId);
  }

  @Post('projects/:id/export')
  @ApiOperation({ summary: 'Export real integration code for target framework (React, Next, Vue, Angular, Vanilla, WebComponent)' })
  exportCode(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ExportCodeDto
  ) {
    return this.editorService.exportCode(userId, id, dto.framework);
  }
}
