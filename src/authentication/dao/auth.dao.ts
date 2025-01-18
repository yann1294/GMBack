import { Injectable } from "@nestjs/common";
import IAuthDAO from "./auth.dao.interface";
import { DataService } from "src/shared/services/data.service";


@Injectable()
export class AuthDAO implements IAuthDAO {
  private readonly collectionName = 'authentication';

  constructor(private readonly dataService: DataService) { }

}
