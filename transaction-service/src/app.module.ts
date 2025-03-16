import { Module } from '@nestjs/common';
import { TransactionModule } from './antifraud/infraestructure/boostrap/TransactionModule';

@Module({
  imports: [
    TransactionModule,
  ],
})
export class AppModule {}
