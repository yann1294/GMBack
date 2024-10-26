import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FileService } from 'src/shared/services/file.service';
import { FastifyRequest } from 'fastify';
import { DataServiceResponse, FileServiceResponse } from 'src/types';
import { MultipartFile } from '@fastify/multipart';
import { log } from 'console';

@Controller('tours')
export class TourController {
  // inject firebase repository
  constructor(
    private readonly dataService: DataService,
    private readonly fileService: FileService,
  ) {}

  @Delete('image/delete')
  async deleteFile(): Promise<FileServiceResponse> {
    const result = this.fileService.deleteFile(
      'https://firebasestorage.googleapis.com/v0/b/gmback-206ae.appspot.com/o/tours%2Ffile.jpg?alt=media&token=b0d0c80e-9bab-4d0c-9945-ccf7e6301685',
    );

    return result;
  }

  @Post('upload')
  async uploadFile(@Req() req: FastifyRequest): Promise<FileServiceResponse> {
    // get file from request
    const file: MultipartFile | undefined = await req.file();

    const result = this.fileService.uploadFile(
      await file.toBuffer(),
      file.mimetype,
      'tours/images/file.jpg',
    );

    return result;
  }

  @Post('create')
  async createTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.createDocs(
      [{ name: 'Test repo' }, { name: 'Test repo' }, { name: 'Test repo' }],
      'tours',
    );
    return result;
  }

  @Get('read')
  async getTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.readDoc(
      'tours',
      'srntBzfHL3sP4gzqKrOus',
    );
    return result;
  }

  @Delete('delete')
  async deleteTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.deleteDoc(
      'tours',
      'srntBzfHL3sP4gzqKrOus',
    );
    return result;
  }

  @Put('update')
  async updateTour(): Promise<DataServiceResponse> {
    // create dummy tour
    const result = await this.dataService.updateDoc(
      'tours',
      '10h7La8JE2FuKnWAVYu8',
      { name: 'New name' },
    );
    return result;
  }
}
