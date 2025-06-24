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
import { Activity } from 'src/tours/vo/helper.vo';

@Injectable()
export class ConvertToVoPipe
  implements
    PipeTransform<
      any,
      Promise<
        | BookingVO
        | PaymentVO
        | GuideVO
        | AdminVO
        | TouristVO
        | TourVO
        | PackageVO
      >
    >
{
  constructor(
    private readonly context: keyof typeof CONTEXT,
    private readonly hasBody: boolean = false,
    private readonly paramField: string = 'id',
    private readonly action: 'update' | 'others' = 'others',
  ) {}

  async transform(
    req: FastifyRequest,
    metadata: ArgumentMetadata,
  ): Promise<
    BookingVO | PaymentVO | GuideVO | AdminVO | TouristVO | TourVO | PackageVO
  > {
    try {
      // 1) Always pull the URL param (e.g. { id: '...' })
      let data: any = {};
      data[this.paramField] = req.params[this.paramField];
      // 2) If this route expects a body, merge it in.  Fastify usually has already parsed JSON for us.
      if (this.hasBody) {
        let bodyObj: any = {};

        if (typeof req.body === 'string') {
          // Body arrived as a raw JSON string → parse exactly once
          bodyObj = JSON.parse(req.body as string);
        } else {
          // Fastify already parsed JSON into an object
          bodyObj = req.body as object;
        }

        // Merge id + body fields
        Object.assign(data, bodyObj);
      }

      console.log('Data in convert', data);

      // checking whether update has only id field
      // 3) If this is an “update” action, ensure we have at least two keys (id + something else).
      if (this.action === 'update' && Object.keys(data).length === 1) {
        throw new BadRequestException(
          errorHandler({
            code: 503,
            message: 'Body must contain at least two attributes',
          }),
        );
      }

      // ─── 4) SPECIAL: if updating a Tour, convert data.activities into a Map<number,Activity> ──
      if (this.context === CONTEXT.tour && data.activities !== undefined) {
        let rawActsObj: Record<string, any>;

        if (typeof data.activities === 'string') {
          // Case A: client sent "activities" as a JSON‐string
          rawActsObj = JSON.parse(data.activities);
        } else if (typeof data.activities === 'object') {
          // Case B: client sent an actual JS object for "activities"
          rawActsObj = data.activities as Record<string, any>;
        } else {
          throw new BadRequestException(
            errorHandler({
              code: 400,
              message: 'activities must be a JSON object or JSON string',
            }),
          );
        }

        // Convert each entry into an Activity instance, keyed by Number
        const activityMap = new Map<number, Activity>();
        for (const [k, obj] of Object.entries(rawActsObj)) {
          const numericKey = parseInt(k, 10);
          const actInstance = plainToInstance(Activity, obj, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true,
          });
          activityMap.set(numericKey, actInstance);
          console.log('PIPE → Map entry', numericKey, actInstance);
        }

        data.activities = activityMap;
        console.log('Converted activities:', data.activities);
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
      throw new BadRequestException(
        errorHandler({ message: JSON.stringify(errors), code: 500 }),
      );
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
      throw new BadRequestException(
        errorHandler({ message: JSON.stringify(errors), code: 500 }),
      );
    }
  }
}
