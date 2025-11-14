import { Injectable } from '@nestjs/common';

// Simple application-level service used by AppController.
// For now it just returns a static string, but it can evolve into:
// - Health checks
// - Version information
// - Aggregated metrics or basic statistics
@Injectable()
export class AppService {
  // Returns a simple string; used by GET / in AppController
  getHello(): string {
    return 'Hello World!';
  }
}
