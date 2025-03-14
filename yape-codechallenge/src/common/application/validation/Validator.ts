import { validationMessages } from './ValidationMessages';
import CustomException from '../exception/CustomException';
import { ERROR_VALIDAR_DATOS } from '../exception/ErrorConstants';
import { HttpStatus } from '@nestjs/common';

export const validate = async (schema, payload) => {

  if (payload == 'undefined' || payload === undefined) {
    throw new CustomException({
      code: ERROR_VALIDAR_DATOS.CODIGO,
      message: ERROR_VALIDAR_DATOS.MENSAJE,
      httpStatus: HttpStatus.BAD_REQUEST,
      details: [
        'Empty payload'
      ]
    });
  }

  const validation = schema.validate(payload, {
    allowUnknown: false,
    abortEarly: false,
    convert: false,
    errors: { language: 'spanish' },
    messages: validationMessages
  });
  if (validation.error) {
    const messagesError: string[] = [];
    validation.error.details.forEach((value) => {
      messagesError.push(value.message);
    });

    throw new CustomException({
      code: ERROR_VALIDAR_DATOS.CODIGO,
      message: ERROR_VALIDAR_DATOS.MENSAJE,
      httpStatus: HttpStatus.BAD_REQUEST,
      details: messagesError
    });
  }
};
