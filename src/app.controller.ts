import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Root-level controller for the application
// This is mainly a health-check / demo endpoint returning a simple string.
@Controller()
export class AppController {
  // Inject the AppService via constructor injection
  constructor(private readonly appService: AppService) {}

  // GET /
  // Simple endpoint to verify that the application is running.
  // In production, you can replace this with a health-check or version endpoint.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
