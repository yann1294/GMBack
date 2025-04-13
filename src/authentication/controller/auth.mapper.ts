import { LocalAuthEntity } from '../dao/localauth.entity';
import { OAuthEntity } from '../dao/oauth.entity';
import { IRole } from '../types/role.types';

import { AuthResponseDTO } from './dto/auth.response.dto';

export class AuthMapper {
  static toResponse(
    authData: LocalAuthEntity | OAuthEntity | any,
  ): AuthResponseDTO {
    const isLocalAuth =
      authData instanceof LocalAuthEntity || 'emailAddress' in authData;
    const isOAuth = authData instanceof OAuthEntity || 'provider' in authData;

    // Get normalized role object
    const role = this.normalizeRole(authData.role);

    return {
      uid: authData.uid || authData.uId,
      emailAddress: isLocalAuth ? authData.emailAddress : authData.email,
      password: isLocalAuth ? authData.password : undefined,
      role: role,
      provider: isOAuth ? authData.provider : undefined,
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
    };
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

  private static mapRole(role: any): string {
    if (typeof role === 'string') return role;
    if (role?.name) return role.name;
    return 'tourist'; // default role
  }
}
