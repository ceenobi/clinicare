import useMetaArgs from "@/hooks/useMeta";
import {
  clinicareStats,
  enterpriseFeatures,
  portalLogin,
} from "@/utils/constants";
import { Link } from "react-router";

export default function Home() {
  useMetaArgs({
    title: "Home, Clinicare",
    description: "Welcome to your clinicarte hjjdk",
    keywords: "Health, Cliinc, Hospital",
  });
  return (
    <>
      <div className="mt-20 py-5 px-4 max-w-[600px] mx-auto min-h-[450px] flex flex-col justify-end items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Welcome to <br />
          <span className="text-blue-500 text-6xl md:text-7xl">Clinicare</span>
        </h1>
        <p className="mt-8 text-zinc-800 text-center">
          Manage your hospital operations, patient records, and more with our
          powerful hospital management system.
        </p>
        <div className="mt-8 flex gap-4 items-center">
          <button className="btn bg-zinc-800 text-white">
            <Link to="/account/signup">New Patient</Link>
          </button>
          <button className="btn btn-outline">
            <Link to="/account/signin">Login to Clinicare</Link>
          </button>
        </div>
      </div>
      <div className="py-5 px-4 mt-10 md:h-[700px] w-[90%] mx-auto">
        <img
          src="/hospitalHero.jpg"
          alt="hospital-hero"
          className="h-full w-full shadow-lg rounded-xl"
        />
      </div>
      <div className="my-10 container mx-auto py-5 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Dedicated Portals for Every User
        </h1>
        <div className="mt-8 grid grid-cols-12 gap-4 lg:gap-8">
          {portalLogin.map((portal) => (
            <div
              key={portal.id}
              className="col-span-12 md:col-span-6 bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center border-[0.2px] border-gray-500 h-[250px] text-center"
            >
              <portal.Icon
                className={`text-2xl mb-4 p-3 rounded-full ${portal.color}`}
                size={50}
              />
              <h2 className="text-xl font-bold mb-2">{portal.title}</h2>
              <p className="text-zinc-800 mb-4">{portal.info}</p>
              <Link
                to="/account/signin"
                className="btn border-[0.2px] border-gray-500"
              >
                {portal.title.split(" ")[0] + " Login"}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="my-14 container mx-auto py-5 px-4" id="features">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Enterprise-Grade Features
        </h1>
        <div className="mt-8 grid grid-cols-12 gap-4 lg:gap-8">
          {enterpriseFeatures.map((feature) => (
            <div
              key={feature.id}
              className="col-span-12 md:col-span-4 bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center border-[0.2px] border-gray-500 h-[250px] text-center"
            >
              <feature.Icon
                className="text-2xl mb-4 p-3 rounded-full bg-blue-100 text-blue-400"
                size={50}
              />
              <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
              <p className="text-zinc-800 mb-4">{feature.info}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="py-5 px-4 mt-10 md:h-[700px] w-[90%] mx-auto">
        <img
          src="/clinicare-dashboard.png"
          alt="clinicare"
          className="h-full w-full shadow-lg rounded-xl border-[0.2px] border-gray-500"
        />
      </div>
      <div className="my-20 py-5 px-4 bg-blue-500">
        <div className="container mx-auto grid grid-cols-12 gap-4 lg:gap-8">
          {clinicareStats.map((stat) => (
            <div
              key={stat.id}
              className="col-span-12 md:col-span-3 text-white p-4 flex flex-col items-center justify-center h-[100px] md:h-[200px] text-center"
            >
              <h1 className="text-4xl font-bold mb-2">{stat.title}</h1>
              <p>{stat.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20 py-5 px-4 container mx-auto">
        <div className="pb-10 flex flex-col justify-center items-center gap-4 text-center">
          <h1 className="text-3xl font-bold">
            Ready to Transform Your Hospital Experience?
          </h1>
          <p>
            Take advantage of our awesome services and enjoy rich healthcare
            experience at the comfort of your home.
          </p>
          <button className="btn bg-blue-500 hover:bg-blue-600 text-white">
            <Link to="account/signin">Get Started</Link>
          </button>
        </div>
      </div>
    </>
  );
}
