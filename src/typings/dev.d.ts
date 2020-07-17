/**
 * 开发模块
 */
declare namespace Dev {
  interface User {
    Name: string;

    Mobile?: string;

    DingId?: string;
  }

  interface Engine {
    Name: string;

    Code: string;
  }

  interface LoginConfig {
    GroupName: string;

    Users: User[];

    Engines: Engine[];
  }
}
