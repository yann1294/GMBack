import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BookingVO } from 'src/booking/vo/booking.master.vo';
import { PaymentVO } from 'src/payment/vo/payment.master.vo';
import { PackageVO } from 'src/tours/vo/package.master.vo';
import { TourVO } from 'src/tours/vo/tour.master.vo';
import { AdminVO } from 'src/user-management/vo/admin.vo';
import { GuideVO } from 'src/user-management/vo/guide.vo';
import { TouristVO } from 'src/user-management/vo/tourist.vo';
import { FastifyRequest } from 'fastify';
import UpdateBookingDTO from 'src/booking/controller/dto/booking.update.dto';
import { UpdatePaymentDTO } from 'src/payment/controller/dto/payment.update.dto';
import { UpdateGuideDTO } from 'src/user-management/controller/dto/guide.update.dto';
import { UpdateAdminDTO } from 'src/user-management/controller/dto/admin.update.dto';
import { UpdateTouristDTO } from 'src/user-management/controller/dto/tourist.update.dto';
import { UpdatePackageDTO } from 'src/tours/controller/dto/package.update.dto';
import { CONTEXT } from '../utils/context';
import { errorHandler } from '../services/data.service';
import { UpdateTourDTO } from 'src/tours/controller/dto/tour.update.dto';

@Injectable()
export class ConvertToVoPipe
  implements PipeTransform<any, Promise<BookingVO | PaymentVO | GuideVO | AdminVO | TouristVO | TourVO | PackageVO>> {
  constructor(
    private readonly context: keyof typeof CONTEXT,
    private readonly hasBody: boolean = false,
    private readonly paramField: string = "id",
    private readonly action: "update" | "others" = "others",
  ) { }

  async transform(req: FastifyRequest, metadata: ArgumentMetadata): Promise<BookingVO | PaymentVO | GuideVO | AdminVO | TouristVO | TourVO | PackageVO> {
    try {
      let data: object = {};

      data[this.paramField] = req.params[this.paramField];

      if (this.hasBody) {
        // parse json data
        console.log("Body", req.body)
        let body = JSON.parse(req.body as string);
        data = { ...data, ...body }
      }

      console.log("Data in convert", data)

      // checking whether update has only id field
      if (this.action === "update" && Object.keys(data).length === 1) {
        throw new BadRequestException(errorHandler({ code: 503, message: "Body must contain at least two attributes" }));
      }

      const dto = await this.getDTO(data);
      await this.validateDTO(dto);
      const vo = await this.getVO(dto);
      await this.validateVO(vo);

      return vo;
    } catch (error) {
      // console.error(error)
      throw new BadRequestException(errorHandler(error));
    }
  }

  private async getDTO(data: object): Promise<any> {
    switch (this.context) {
      case CONTEXT.booking:
        return plainToInstance(UpdateBookingDTO, data);
      case CONTEXT.payment:
        return plainToInstance(UpdatePaymentDTO, data);
      case CONTEXT.guide:
        return plainToInstance(UpdateGuideDTO, data);
      case CONTEXT.admin:
        return plainToInstance(UpdateAdminDTO, data);
      case CONTEXT.tourist:
        return plainToInstance(UpdateTouristDTO, data);
      case CONTEXT.tour:
        return plainToInstance(UpdateTourDTO, data);
      case CONTEXT.package:
        return plainToInstance(UpdatePackageDTO, data);
      default:
        throw new BadRequestException(`Invalid context "${this.context}"`);
    }
  }

  private async validateDTO(dto: any): Promise<void> {
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errorHandler({ message: JSON.stringify(errors), code: 500 }));
    }
  }

  private getVO(dto: any): any {
    switch (this.context) {
      case CONTEXT.booking:
        return plainToInstance(BookingVO, dto);
      case CONTEXT.payment:
        return plainToInstance(PaymentVO, dto);
      case CONTEXT.guide:
        return plainToInstance(GuideVO, dto);
      case CONTEXT.admin:
        return plainToInstance(AdminVO, dto);
      case CONTEXT.tourist:
        return plainToInstance(TouristVO, dto);
      case CONTEXT.tour:
        return plainToInstance(TourVO, dto);
      case CONTEXT.package:
        return plainToInstance(PackageVO, dto);
      default:
        throw new BadRequestException('Invalid context');
    }
  }

  private async validateVO(vo: any): Promise<void> {
    const errors = await validate(vo);
    if (errors.length > 0) {
      throw new BadRequestException(errorHandler({ message: JSON.stringify(errors), code: 500 }));
    }
  }
}
