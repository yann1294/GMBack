import { Injectable } from '@nestjs/common';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';
import { CreateTourDTO } from '../controller/dto/tour.create.dto';
import { UpdateTourDTO } from '../controller/dto/tour.update.dto';

@Injectable()
export class CoreService {
  constructor(private readonly coreDAO: CoreDAOInterface) {}

  findAllTours() {
    return this.coreDAO.findAll();
  }

  findTourById(id: string) {
    return this.coreDAO.findById(id);
  }

  createTour(createTourDTO: CreateTourDTO) {
    return this.coreDAO.create(createTourDTO);
  }

  updateTour(id: string, updateTourDTO: UpdateTourDTO) {
    return this.coreDAO.update(id, updateTourDTO);
  }

  deleteTour(id: string) {
    return this.coreDAO.delete(id);
  }
}
