import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function WhoWeAre() {
  const features = [
    {
      title: "Personalized Journey Planning",
      description:
        "No two travelers are the same. That's why every trip is built from scratch — just for you.",
    },
    {
      title: "Seamless Hotel & Transport Coordination",
      description:
        "Stay in comfort, travel in peace. We handle everything behind the scenes.",
    },
    {
      title: "Wide Range of Destinations",
      description:
        "200+ handpicked places across 5 continents and growing every year.",
    },
    {
      title: "Quick & Reliable Support",
      description:
        "Real people. Real answers. Anytime you need us, we're here.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-8">
          {/* Images Section */}

          {/* Content Section */}
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-blue-600 text-sm font-semibold mb-2">
                Who We Are
              </h2>
              <h3 className="text-2xl font-light text-gray-900 mb-4">
                Explore the world, your way with travel experiences that feel
                personal, flexible.
              </h3>

              <div className="relative h-[400px] flex items-center justify-center">
                <div className="absolute w-72 h-64 bg-gray-300 rounded-3xl top-0 left-1/2 transform -translate-x-1/2"></div>
                <div className="absolute w-48 h-56 bg-gray-300 rounded-3xl bottom-0 right-1/4 transform translate-x-1/2 border-4 border-white"></div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mt-4">
                We are a passionate team of explorers, planners, and dreamers
                dedicated to crafting journeys that match your unique style and
                pace. From remote mountain trails to vibrant coastal towns, we
                help you travel smarter — not harder.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-light text-gray-900 text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-xs mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-[1.5fr_2fr] gap-12 items-start justify-start">
          {/* Images Section */}
          <div className="relative h-[580px] flex items-center justify-center">
            <div className="absolute w-[440px] h-[500px] bg-gray-300 rounded-3xl top-0 left-0 overflow-hidden">
              <Image
                src="/l3.webp"
                alt="who-we-are"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute w-[270px] h-[270px] bg-gray-300 rounded-3xl bottom-0 right-0 border-4 border-white overflow-hidden">
              <Image
                src="/l2.webp"
                alt="who-we-are"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-8">
            <div className="">
              <h3 className="text-blue-600 text-xs font-semibold mb-2">
                Who We Are
              </h3>
              <h3 className="text-3xl font-light text-gray-900 mb-4">
                Explore the world, your way with travel experiences that feel
                personal, flexible.
              </h3>
              <p className="text-gray-600 text-[18px] leading-relaxed">
                We are a passionate team of explorers, planners, and dreamers
                dedicated to crafting journeys that match your unique style and
                pace. From remote mountain trails to vibrant coastal towns, we
                help you travel smarter — not harder.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {/* <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div> */}

                    <Image
                      src="/Icon_Who_We.svg"
                      alt="check"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h4 className="font-light text-gray-700 text-[21px]">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1 text-[16px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
