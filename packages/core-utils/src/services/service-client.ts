import { APIException } from "@/exceptions";
import { RegistryAddress, Service, ServiceIdentity } from "@/types";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export class ServiceClient {
  private registryAddress: RegistryAddress;
  private callerService: ServiceIdentity;

  constructor(
    registryAddress: RegistryAddress,
    callerService: ServiceIdentity
  ) {
    this.registryAddress = registryAddress;
    this.callerService = callerService;
  }

  private onerror(error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      // if (
      //   ["404", "400", "401", "403", "500"].includes(
      //     `${axiosError.response?.status}`
      //   )
      // ) {
      return new APIException(
        axiosError?.response?.status ?? axiosError?.status ?? 500,
        axiosError?.response?.data ?? axiosError?.message
      );
      // }
      // return new APIException(axiosError.status ?? 500, {
      //   detail: axiosError.message,
      // });
    }
    return new APIException(500, { detail: error.message });
  }

  async getService(serviceName: string, version?: string) {
    try {
      // Gateway version is used to match the registry version hence use of config version
      const response: AxiosResponse<Service> = await axios.post(
        `${this.registryAddress.url}/find`,
        { name: serviceName, version: version ?? this.callerService.version }
      );
      return response.data;
    } catch (error: any) {
      throw this.onerror(error);
    }
  }

  async getServices() {
    try {
      // Gateway version is used to match the registry version hence use of config version
      const response: AxiosResponse<{ results: Array<Service> }> =
        await axios.get(`${this.registryAddress.url}/services`);
      return response.data;
    } catch (error: any) {
      throw this.onerror(error);
    }
  }

  async callService<T>(
    serviceName: string,
    requestOptions: AxiosRequestConfig,
    version?: string
  ) {
    const { host, port } = await this.getService(serviceName, version);
    requestOptions.url = `http://${host}:${port}${requestOptions.url}`;
    try {
      const response: AxiosResponse<T> = await axios(requestOptions);
      return response.data;
    } catch (error: any) {
      throw this.onerror(error);
    }
  }

  async callServiceWithResponse(
    serviceName: string,
    requestOptions: AxiosRequestConfig,
    version?: string
  ) {
    const { host, port } = await this.getService(serviceName, version);
    requestOptions.url = `http://${host}:${port}${requestOptions.url}`;
    try {
      const response: AxiosResponse = await axios(requestOptions);
      return response;
    } catch (error: any) {
      throw this.onerror(error);
    }
  }
}
