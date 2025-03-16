import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty()
  code: string | number;

  @ApiProperty()
  message: string;

  data: T;
}
