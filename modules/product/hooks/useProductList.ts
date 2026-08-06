// modules/product/hooks/useProductList.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types/product.types";


export type ProductWithStore = Product & {

  storeSlug:string;

  storeName:string;

  storeCity?:string;

  logoUrl?:string | null;

};




export function useProductList(){

  const [
    products,
    setProducts
  ] = useState<ProductWithStore[]>([]);



  const [
    loading,
    setLoading
  ] = useState(true);




  const fetchProducts =
    useCallback(async()=>{

      try{

        setLoading(true);



        const response =
          await fetch(
            "/api/product",
            {
              cache:"no-store",
            }
          );



        const json =
          await response.json();



        if(!response.ok){

          throw new Error(
            json.message ??
            "Gagal mengambil produk"
          );

        }




        const data =
          json.data ?? [];

          




        const result =
          data.map(
            (product:any)=>({


              id:
                product.id,



              storeId:
                product.store_id,



              categoryId:
                product.category_id ?? null,



              category:
                product.product_categories ?? null,



              name:
                product.name,



              slug:
                product.slug,



              description:
                product.description ?? null,



              thumbnailUrl:
                product.thumbnail_url ?? null,



              thumbnailPublicId:
                product.thumbnail_public_id ?? null,



              price:
                Number(product.price ?? 0),



              stock:
                Number(product.stock ?? 0),



              unit:
                product.unit ?? null,



              weight:
                product.weight
                  ? Number(product.weight)
                  : null,



              isFeatured:
                product.is_featured ?? false,



              isActive:
                product.is_active ?? false,



              createdAt:
                product.created_at,



              updatedAt:
                product.updated_at,



              images:
                (product.product_images ?? [])
                  .map((image:any)=>({

                    id:
                      image.id,

                    url:
                      image.image_url,

                    publicId:
                      image.image_public_id,

                  })),




              storeSlug:
                product.stores?.slug ?? "",



              storeName:
                product.stores?.name ?? "",



              storeCity:
                product.stores?.regency ?? "",



              logoUrl:
  product.stores?.logo_url ?? null,



            })

          );




        setProducts(result);



      }catch(error){

        console.error(
          "FETCH PRODUCT LIST ERROR:",
          error
        );


        setProducts([]);



      }finally{

        setLoading(false);

      }


    },[]);





  useEffect(()=>{

    fetchProducts();

  },[
    fetchProducts
  ]);





  return {

    products,

    loading,

    refresh:
      fetchProducts,

  };

}