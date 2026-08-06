// modules/village/services/village.service.ts

import type { VillageResponse } from "../types/village.types";

const API_URL = "/api/village";


interface ErrorResponse {
  message?: string;
}


class VillageService {

  async getVillage(): Promise<VillageResponse> {

    const response = await fetch(API_URL, {
      cache: "no-store",
    });


    if (!response.ok) {

      let message =
        "Gagal mengambil data desa.";


      try {

        const error =
          (await response.json()) as ErrorResponse;


        message =
          error.message ?? message;


      } catch {

        // response bukan JSON

      }


      throw new Error(message);

    }


    return (await response.json()) as VillageResponse;

  }

}


export const villageService =
  new VillageService();