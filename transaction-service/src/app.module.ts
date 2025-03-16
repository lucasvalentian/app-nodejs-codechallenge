import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/infraestructure/boostrap/TransactionModule';

@Module({
  imports: [
    TransactionModule,
  ],
})
export class AppModule {}
