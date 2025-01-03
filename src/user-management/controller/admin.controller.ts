
import { Controller, Get, Post, Put, Delete, Param, Body, Inject } from '@nestjs/common';
import { IAdminService } from '../services/admin.service.interface';
import { ADMIN_SERVICE_TOKEN } from '../utils/token';
import { AdminVO } from '../vo/admin.vo';
import { ResponseObject } from 'src/shared/types';
import { AdminValidationPipe } from './admin.validation.pipe';
import { GuideValidationPipe } from './guide.validation.pipe';
import { GuideVO } from '../vo/guide.vo';

@Controller('admin')
export class AdminController {
constructor(@Inject(ADMIN_SERVICE_TOKEN) private readonly adminService: IAdminService){}

    // Admin related methods
    @Post()
    async addAdmin(@Body(new AdminValidationPipe()) adminVO: AdminVO): Promise<ResponseObject> {
        return this.adminService.addAdmin(adminVO);
    }

    @Delete(':uid')
    async deleteAdmin(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.deleteAdmin(uid);
    }

    @Put(':uid')
    async updateAdmin(@Param('uid') uid: string,
      @Body(new AdminValidationPipe('update')) adminVO: AdminVO): Promise<ResponseObject> {
        return this.adminService.updateAdmin(uid, adminVO);
    }

    // Guide related methods
    @Post(':uid')
    async approveGuide(@Body(new GuideValidationPipe()) guideVO: GuideVO): Promise<ResponseObject> {
        return this.adminService.approveGuide(guideVO);
    }

    @Delete(':uid')
    async deleteGuide(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.deleteGuide(uid);
    }

    @Put(':uid')
    async updateGuide(@Param('uid') uid: string, @Body(new GuideValidationPipe('update')) guideVO: GuideVO): Promise<ResponseObject> {
        return this.adminService.updateGuide(uid, guideVO);
    }

    @Get(':uid')
    async findGuide(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.findGuide(uid);
    }

    @Get()
    async getAllGuides(): Promise<ResponseObject> {
        return this.adminService.getAllGuides();
    }

    @Post()
    async assignGuideToTour(@Body(new GuideValidationPipe()) guideVO: GuideVO): Promise<ResponseObject> {
        return this.adminService.assignGuideToTour(guideVO);
    }

    @Post()
    async assignGuideToPackage(@Body(new GuideValidationPipe()) guideVO: GuideVO): Promise<ResponseObject> {
        return this.adminService.assignGuideToPackage(guideVO);
    }

    @Post()
    async deactivateGuideAccount(@Body(new GuideValidationPipe) guideVO: GuideVO): Promise<ResponseObject> {
        return this.adminService.deactivateGuideAccount(guideVO);
    }

    @Post()
    async deactivateTouristAccount(@Body(new GuideValidationPipe) guideVO: GuideVO): Promise<ResponseObject> {
        return this.adminService.deactivateTouristAccount(guideVO);
    }

    // Tourist related methods
    @Get(':uid')
    async findTourist(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.findTourist(uid);
    }

    @Delete(':uid')
    async deleteTourist(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.deleteTourist(uid);
    }

    @Get()
    async getAllTourists(): Promise<ResponseObject> {
        return this.adminService.getAllTourists();
    }

    // Booking related methods
    @Get(':uid')
    async readBooking(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.readBooking(uid);
    }

    @Get()
    async readBookings(): Promise<ResponseObject> {
        return this.adminService.readBookings();
    }

    @Get(':uid')
    async readBill(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.readBill(uid);
    }

    @Post()
    async sendBill(@Body() uid: string): Promise<ResponseObject> {
        return this.adminService.sendBill(uid);
    }

    @Get()
    async readComplaints(): Promise<ResponseObject> {
        return this.adminService.readComplaints();
    }

    @Post(':uid')
    async respondToComplaints(@Body() uid: string): Promise<ResponseObject> {
        return this.adminService.respondToComplaints(uid);
    }

    // Tour related methods
    @Get()
    async getTours(): Promise<ResponseObject> {
        return this.adminService.getTours();
    }

    @Get()
    async getPackages(): Promise<ResponseObject> {
        return this.adminService.getPackages();
    }
}
