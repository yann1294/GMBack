import { ResponseObject } from 'src/shared/types';
import { Guide } from './guide.entity';

export interface IGuideDAO {
  create(guide: Guide): Promise<ResponseObject>;
  delete(guide: Guide): Promise<ResponseObject>;
  update(guide: Guide): Promise<ResponseObject>;
  findById(guide: Guide): Promise<ResponseObject>;
  findAll(): Promise<ResponseObject>;
  // ✅ Partial update used by approve/reject:
  updatePartial(uid: string, patch: object): Promise<ResponseObject>;
}
