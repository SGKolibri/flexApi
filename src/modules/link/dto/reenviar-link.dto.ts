import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CanalEnvio } from '../interfaces/link.interface';

export class ReenviarLinkDto {
  @ApiPropertyOptional({ enum: CanalEnvio })
  @IsOptional()
  @IsEnum(CanalEnvio)
  canal?: CanalEnvio;
}
