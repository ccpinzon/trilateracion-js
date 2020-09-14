import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Satellite, TopSecretRequest } from './dto/top-secret.request';
import { TopSecretResponse } from './dto/top-secret.response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post('topsecret')
  async topSecret(@Body() topSecretRequest: TopSecretRequest): Promise<TopSecretResponse> {
    return await this.appService.topSecret(topSecretRequest);
  }

  @Post('topsecret_split')
  async topSecretSplit(@Body() satelliteRequest: Satellite): Promise<Boolean> {
    return await this.appService.topSecretSplit(satelliteRequest);
  }

  @Get('topsecret_split')
  async topSecretSplitGet(): Promise<TopSecretResponse> {
    return await this.appService.topSecretGet();
  }

  @Get('getlocation')
  getLocation(): number[] {
    return this.appService.getLocation(100,115,142.7);
  }

  @Get('getMessage')
  getMessage(): string {

    const hiddenMessage = [
      ['este',
        '',
        '',
        'mensaje',
        ''],
      [
        '',
        'es',
        '',
        '',
        'secreto',
      ],
      [
        'este',
        '',
        'un',
        '',
        '',
      ],
    ];

    return this.appService.getMessage(hiddenMessage);
  }
}
