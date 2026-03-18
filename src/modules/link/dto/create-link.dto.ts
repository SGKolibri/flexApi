import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'treinamentoTotalGteNumero', async: false })
class TreinamentoTotalGteNumero implements ValidatorConstraintInterface {
  validate(total: number, args: ValidationArguments) {
    const obj = args.object as CreateLinkDto;
    return total >= obj.treinamentoNumero;
  }
  defaultMessage() {
    return 'treinamentoTotal deve ser maior ou igual a treinamentoNumero';
  }
}

export class CreateLinkDto {
  @ApiProperty({ example: 'cuid-do-cliente' })
  @IsNotEmpty()
  @IsString()
  clienteId: string;

  @ApiProperty({ example: 'cuid-da-ferramenta' })
  @IsNotEmpty()
  @IsString()
  ferramentaId: string;

  @ApiProperty({ example: 'uuid-do-tecnico' })
  @IsNotEmpty()
  @IsString()
  tecnicoId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  treinamentoNumero: number;

  @ApiProperty({ example: 3, minimum: 1 })
  @IsInt()
  @Min(1)
  @Validate(TreinamentoTotalGteNumero)
  treinamentoTotal: number;

  @ApiProperty({ example: 48, description: 'Validade em horas (ex.: 24, 48, 72)' })
  @IsInt()
  @Min(1)
  validadeHoras: number;
}
