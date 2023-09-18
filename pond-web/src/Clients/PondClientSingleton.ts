import { PondAuthClient } from "./PondAuthClient";
import { PondUserClient } from "./PondUserClient";

export default class PondClientSingleton {
  private static instance: PondClientSingleton;
  private pondAuthClient: PondAuthClient;
  private pondUserClient: PondUserClient;

  private constructor() {
    this.pondAuthClient = new PondAuthClient();
    this.pondUserClient = new PondUserClient();
  }

  public static getInstance(): PondClientSingleton {
    if (!PondClientSingleton.instance) {
      PondClientSingleton.instance = new PondClientSingleton();
    }
    return PondClientSingleton.instance;
  }

  public getPondAuthClient() {
      return this.pondAuthClient;
  }

  public getPondUserClient() {
      return this.pondUserClient;
  }
}
