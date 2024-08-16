import { Controller, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of all notifications',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          message: { type: 'string', example: 'New notification' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-08-12T12:34:56.789Z',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a notification by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the notification',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The found notification',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '1' },
        message: { type: 'string', example: 'New notification' },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-08-12T12:34:56.789Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }
}
