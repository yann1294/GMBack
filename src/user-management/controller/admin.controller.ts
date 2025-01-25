
import { Controller, Get, Post, Put, Delete, Param, Body, Inject, Patch } from '@nestjs/common';
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
        console.log(adminVO);
        return this.adminService.addAdmin(adminVO);
    }

    @Delete(':uid')
    async deleteAdmin(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.deleteAdmin(uid);
    }

    @Patch(':uid')
    async updateAdmin(@Param('uid') uid: string,
      @Body(new AdminValidationPipe('update')) adminVO: AdminVO): Promise<ResponseObject> {
        return this.adminService.updateAdmin(uid, adminVO);
    }

    // Guide related methods
    @Patch('guides/approve/:uid')
    async approveGuide(@Param('uid') uid: string): Promise<ResponseObject> {
        console.log("API Entry: PATCH /admin/guides/approve/:uid", { uid });
        return this.adminService.approveGuide(uid);
    }

    // @Delete('guides/:uid')
    // async deleteGuide(@Param('uid') uid: string): Promise<ResponseObject> {
    //     return this.adminService.deleteGuide(uid);
    // }

    // @Patch('guides/:uid')
    // async updateGuide(@Param('uid') uid: string, @Body(new GuideValidationPipe('update')) guideVO: GuideVO): Promise<ResponseObject> {
    //     return this.adminService.updateGuide(uid, guideVO);
    // }

    // @Get('guides/:uid')
    // async findGuide(@Param('uid') uid: string): Promise<ResponseObject> {
    //     return this.adminService.findGuide(uid);
    // }

    @Get('guides')
    async getAllGuides(): Promise<ResponseObject> {
        return this.adminService.getAllGuides();
    }

    // @Post('tours/:tourId/guides/:guideId')
    // async assignGuideToTour(@Param('tourId') tourId: string, @Param('guideId') guideId: string): Promise<ResponseObject> {
    //     return this.adminService.assignGuideToTour(tourId, guideId);
    // }

    // @Patch('packages/:packageId/guides/:guideId')
    // async assignGuideToPackage(@Param('packageId') packageId: string, @Param('guideId') guideId: string): Promise<ResponseObject> {
    //     return this.adminService.assignGuideToPackage(packageId, guideId);
    // }

    @Patch('account/guides/:uid')
    async deactivateGuideAccount(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.deactivateGuideAccount(uid);
    }

    @Patch('account/tourists/:uid')
    async deactivateTouristAccount(@Body(new GuideValidationPipe) guideVO: GuideVO): Promise<ResponseObject> {
        return this.adminService.deactivateTouristAccount(guideVO);
    }

    // // Tourist related methods
    // @Get('tourists/:uid')
    // async findTourist(@Param('uid') uid: string): Promise<ResponseObject> {
    //     return this.adminService.findTourist(uid);
    // }

    // @Delete('tourists/:uid')
    // async deleteTourist(@Param('uid') uid: string): Promise<ResponseObject> {
    //     return this.adminService.deleteTourist(uid);
    // }

    @Get('tourists')
    async getAllTourists(): Promise<ResponseObject> {
        return this.adminService.getAllTourists();
    }

    // Booking related methods
    @Get('bookings/:uid')
    async readBooking(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.readBooking(uid);
    }

    @Get('bookings')
    async readBookings(): Promise<ResponseObject> {
        return this.adminService.readBookings();
    }

    @Get('bills/:uid')
    async readBill(@Param('uid') uid: string): Promise<ResponseObject> {
        return this.adminService.readBill(uid);
    }

    @Post('bills')
    async sendBill(@Body() uid: string): Promise<ResponseObject> {
        return this.adminService.sendBill(uid);
    }

    @Get('complaints')
    async readComplaints(): Promise<ResponseObject> {
        return this.adminService.readComplaints();
    }

    @Post('complaints/:uid')
    async respondToComplaints(@Body() uid: string): Promise<ResponseObject> {
        return this.adminService.respondToComplaints(uid);
    }

    // Tour related methods
    @Get('tours')
    async getTours(): Promise<ResponseObject> {
        return this.adminService.getTours();
    }

    @Get('packages')
    async getPackages(): Promise<ResponseObject> {
        return this.adminService.getPackages();
    }
}
