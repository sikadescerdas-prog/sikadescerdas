// modules/home/services/home.service.ts

import type {
  HomeData,
  HomeResponse,
} from "@/modules/home/types/home.types";


export async function getHomeData()
:Promise<HomeData | null>{

  try{

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/home`,
      {
        next:{
          revalidate:60,
        },
      }
    );


    const json =
      await res.json() as HomeResponse;



    if(!json.success){
      return null;
    }


    return json.data;


  }catch(error){

    console.error(
      "HOME SERVICE ERROR",
      error
    );


    return null;

  }

}