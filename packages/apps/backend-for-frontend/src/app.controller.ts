import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async index(@Request() request) {
    return JSON.stringify(request, undefined, 2);
  }
}
