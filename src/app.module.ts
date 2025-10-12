import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { FormModule } from './modules/form/form.module';

@Module({
  imports: [UserModule, FormModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
