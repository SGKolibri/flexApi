import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FormService } from '../service/form.service';
import { CreateFormDto } from '../dto/create-form.dto';
import { UpdateFormDto } from '../dto/update-form.dto';

@ApiTags('forms')
@Controller('forms')
export class FormController {
  constructor(private readonly service: FormService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new form' })
  @ApiResponse({ status: 201, description: 'Form created successfully.' })
  create(@Body() dto: CreateFormDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all forms' })
  @ApiResponse({ status: 200, description: 'Array of forms returned.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Form found.' })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a form by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Form updated successfully.' })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateFormDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a form by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Form removed successfully.' })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
