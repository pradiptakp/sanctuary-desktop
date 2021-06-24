export type UserData = {
  access_token: string;
  token_type: "Bearer";
  scope: ["permanent"];
  keyrockToken: string;
  userData: {
    scope: [];
    id: string;
    username: string;
    email: string;
    date_password: string;
    enabled: boolean;
    admin: boolean;
  };
};

export type DeviceType = "Lamp" | "Lock" | "Temperature";

export type Room = {
  id: string;
  type: "Room";
  description: string;
  name: string;
  powerUsage: number;
  refHouse: string;
  temperature: number;
  totalDevice: number;
  devices: Device[];
};

export type Device = {
  id: string;
  type: DeviceType;
  TimeInstant: string;
  monthly_usage: string;
  off_info: string;
  off_status: string;
  on_info: string;
  on_status: string;
  power: string;
  refRoom: string;
  state: string;
  on: string;
  off: string;
  temperature: string;
};

export type User = {
  scope: any[];
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  gravatar: boolean;
  date_password: string;
  description: string;
  website: string | null;
};

export type DashboardData = {
  roomsTotal: number;
  devicesTotal: number;
  usersTotal: number;
};
