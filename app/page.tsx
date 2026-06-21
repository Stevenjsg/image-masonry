import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* <!-- Column #1 --> */}
        <div className="grid gap-4">
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-01.jpg"
              width="232"
              height="290"
              alt="Image 01"
            />
          </div>
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-02.jpg"
              width="232"
              height="290"
              alt="Image 02"
            />
          </div>
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-03.jpg"
              width="232"
              height="174"
              alt="Image 03"
            />
          </div>
        </div>
        {/* <!-- Column #2 --> */}
        <div className="grid gap-4">
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-04.jpg"
              width="232"
              height="155"
              alt="Image 04"
            />
          </div>
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-05.jpg"
              width="232"
              height="349"
              alt="Image 05"
            />
          </div>
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-06.jpg"
              width="232"
              height="250"
              alt="Image 06"
            />
          </div>
        </div>
        {/* <!-- Column #3 --> */}
        <div className="grid gap-4">
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-07.jpg"
              width="232"
              height="349"
              alt="Image 07"
            />
          </div>
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-08.jpg"
              width="232"
              height="155"
              alt="Image 08"
            />
          </div>
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-09.jpg"
              width="232"
              height="250"
              alt="Image 09"
            />
          </div>
        </div>
        {/* <!-- Column #4 --> */}
        <div className="grid gap-4">
          <div>
            <Image
              className="w-full rounded-xl shadow"
              src="./masonry-10.jpg"
              width="232"
              height="290"
              alt="Image 10"
            />
          </div>
          <Image
            className="w-full rounded-xl shadow"
            src="./masonry-11.jpg"
            width="232"
            height="155"
            alt="Image 11"
          />
          <Image
            className="w-full rounded-xl shadow"
            src="./masonry-12.jpg"
            width="232"
            height="309"
            alt="Image 12"
          />
        </div>
      </div>
    </main>
  );
}
