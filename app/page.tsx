import GridMasonry from "./components/gridMasonry";
import {
  getPhotoById,
  getCuRatedPhotos,
  searchPhoto,
} from "./services/getPhotoPexels";

export default async function Home() {
  const { photos } = (await getCuRatedPhotos(80)) ?? <div>Error 404</div>;
  console.log(photos);
  return (
    <main className="flex flex-1 w-full place-content-center-center  p-2 lg:p-8 m-auto bg-white dark:bg-black sm:items-start">
      <GridMasonry photos={photos} />
    </main>
  );
}
