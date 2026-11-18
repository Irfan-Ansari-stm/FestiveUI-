import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ControlCenterService } from './control-center.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Enterprise Control Center')
@Controller('control-center')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ControlCenterController {
  constructor(private readonly controlCenterService: ControlCenterService) {}

  // 1. Live Telemetry (Database, Redis, CDN, Worker ping)
  @Get('telemetry')
  @ApiOperation({ summary: 'Real-time infrastructure health and latency ping' })
  getTelemetry() {
    return this.controlCenterService.getTelemetry();
  }

  // 2. Control Center Overview KPIs & Charts
  @Get('overview')
  @ApiOperation({ summary: 'Control Center operational metrics, KPIs, and alerts' })
  getOverview() {
    return this.controlCenterService.getOverview();
  }

  // 3. Web Applications Management
  @Get('applications')
  @ApiOperation({ summary: 'List registered client web applications' })
  getApplications(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string
  ) {
    return this.controlCenterService.getApplications(
      Number(page) || 1,
      Number(limit) || 20,
      search
    );
  }

  @Post('applications')
  @ApiOperation({ summary: 'Connect and register new web application' })
  createApplication(
    @CurrentUser('id') userId: string,
    @Body() body: { name: string; websiteUrl: string; framework: string; environment?: string; domain: string }
  ) {
    return this.controlCenterService.createApplication(userId, body);
  }

  @Patch('applications/:id')
  @ApiOperation({ summary: 'Update web application configuration' })
  updateApplication(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.controlCenterService.updateApplication(id, userId, body);
  }

  @Delete('applications/:id')
  @ApiOperation({ summary: 'Delete or deactivate web application' })
  deleteApplication(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.controlCenterService.deleteApplication(id, userId);
  }

  // 4. Festival Campaign Management
  @Get('campaigns')
  @ApiOperation({ summary: 'List all festival campaigns and lifecycle states' })
  getCampaigns() {
    return this.controlCenterService.getCampaigns();
  }

  @Post('campaigns')
  @ApiOperation({ summary: 'Create or schedule a festival campaign' })
  createCampaign(
    @CurrentUser('id') userId: string,
    @Body() body: any
  ) {
    return this.controlCenterService.createCampaign(userId, body);
  }

  @Patch('campaigns/:id')
  @ApiOperation({ summary: 'Update campaign status (activate, pause, reschedule)' })
  updateCampaign(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.controlCenterService.updateCampaign(id, userId, body);
  }

  @Delete('campaigns/:id')
  @ApiOperation({ summary: 'Delete campaign' })
  deleteCampaign(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.controlCenterService.deleteCampaign(id, userId);
  }

  // 5. CDN Cache Purge
  @Post('cdn/purge')
  @ApiOperation({ summary: 'Execute global Edge CDN cache purge' })
  purgeCdn(
    @CurrentUser('id') userId: string,
    @Body('scope') scope?: string
  ) {
    return this.controlCenterService.purgeCdn(userId, scope);
  }

  // 6. System Alerts
  @Get('alerts')
  @ApiOperation({ summary: 'Get operational system alerts' })
  getAlerts() {
    return this.controlCenterService.getAlerts();
  }

  @Patch('alerts/:id/resolve')
  @ApiOperation({ summary: 'Mark system alert as resolved' })
  resolveAlert(@Param('id') id: string) {
    return this.controlCenterService.resolveAlert(id);
  }

  // 7. Platform Settings
  @Get('settings')
  @ApiOperation({ summary: 'List platform configuration settings' })
  getSettings() {
    return this.controlCenterService.getSettings();
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update platform setting' })
  updateSetting(
    @CurrentUser('id') userId: string,
    @Body('key') key: string,
    @Body('value') value: string
  ) {
    return this.controlCenterService.updateSetting(userId, key, value);
  }
}
