import { Carousel, Button } from 'flowbite-react';

function Home() {
  return (
    <>
      <div className="my-10 px-4  text-center sm:my-16 ">
        <h1 className="mb-10 font-medium sm:text-2xl md:text-3xl">
          The best Mediterranean food.
          <br />
          <span className="font-semibold text-cyan-600">
            Fresh ingredients for a healthier lifestyle.
          </span>
        </h1>
      </div>
      <div className="h-56">
        <Carousel slideInterval={3000}>
          <img
            alt="restaurantInside"
            src="https://secretnyc.co/wp-content/uploads/2022/09/souvlaki-gr-1024x683.jpeg"
          />
          <img
            alt="restaurantOutside"
            src="https://secretmiami.com/wp-content/uploads/2023/04/meraki.jpg"
          />
        </Carousel>
        <div className="mt-10 px-4 text-center">
          <h2 className="mb-2 text-xl font-semibold">Contact Us</h2>
          <p className="text-gray-600">
            For issues regarding your order, feel free to reach out to us:
          </p>
          <p className="mt-2 font-semibold text-cyan-600">
            Email: xenios@taverna.com
          </p>
          <p className="text-gray-600">Phone: +40 (074) 444-4444</p>
          <p className="text-gray-600">
            Address: 123 Aleea Faleza Dunării, Galați
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
