import { Photo, ResponsePhoto } from "./../types/photo.d";
import { getRequest } from "./config";

export async function getPhotoById(id: string): Promise<Photo> {
  const response = await fetch(
    `https://api.pexels.com/v1/photos/${id}`,
    getRequest,
  );
  const photo = await response.json();
  return photo;
}

export async function searchPhoto(
  query: string,
  page: number = 1,
): Promise<ResponsePhoto> {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=${page}`,
    getRequest,
  );
  const ResponsePhoto = await response.json();
  return ResponsePhoto;
}

export async function getCuRatedPhotos(
  page: number = 1,
): Promise<ResponsePhoto> {
  const response = await fetch(
    `https://api.pexels.com/v1/curated?per_page=${page}`,
    getRequest,
  );
  const CuratedPhoto = await response.json();
  return CuratedPhoto;
}
