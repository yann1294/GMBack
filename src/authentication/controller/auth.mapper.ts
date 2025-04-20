import { LocalAuthEntity } from '../dao/localauth.entity';
import { OAuthEntity } from '../dao/oauth.entity';
import { IRole } from '../types/role.types';

import { AuthResponseDTO } from './dto/auth.response.dto';

export class AuthMapper {
  static toResponse(authData: LocalAuthEntity | OAuthEntity): AuthResponseDTO {
    const isLocalAuth = authData instanceof LocalAuthEntity;
    const baseResponse = {
      uid: authData.uId,
      emailAddress: isLocalAuth
        ? authData.emailAddress
        : (authData as OAuthEntity).emailAddress,
      role: this.normalizeRole(authData.role),
      authType: isLocalAuth ? 'local' : 'oauth',
      metadata: {
        createdAt: authData.createdAt,
      },
      tokens: authData.tokens
        ? {
            accessToken: authData.tokens.accessToken,
            refreshToken: authData.tokens.refreshToken,
          }
        : undefined,
      provider: !isLocalAuth ? (authData as OAuthEntity).provider : undefined,
    };

    // Add provider only for OAuth
    if (!isLocalAuth) {
      (baseResponse as any).provider = (authData as OAuthEntity).provider;
    }

    return baseResponse as AuthResponseDTO;
  }

  private static normalizeRole(roleInput: string | IRole | undefined): IRole {
    const defaultRole: IRole = {
      name: 'tourist',
      permissions: [],
    };

    if (!roleInput) return defaultRole;

    if (typeof roleInput === 'string') {
      return {
        name: roleInput as 'admin' | 'tourist' | 'guide',
        permissions: [],
      };
    }

    return {
      name: roleInput.name,
      permissions: roleInput.permissions || [],
    };
  }
}
