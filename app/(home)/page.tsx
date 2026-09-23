import CardsSections from "@/components/CardsSections";
import HeroSection8 from "@/components/hero-section-8";
import Hero from "./_ui/hero";

const footerNavigation = {
  main: [
    { name: 'Blogs', href: '/blogs' },
    { name: "FAQs", href: '/faqs' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
}

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="w-full bg-black relative">
        <div className="relative z-20">
          <CardsSections />
          <footer className="mt-16 sm:mt-32">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
              <nav aria-label="Footer" className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6">
                {footerNavigation.main.map((item) => (
                  <a key={item.name} href={item.href} className="text-gray-400 hover:text-white">
                    {item.name}
                  </a>
                ))}
              </nav>
              <p className="mt-10 text-center text-medium text-gray-200 underline">
                {new Date().getFullYear()} Dev/talles.
              </p>
            </div>
          </footer>
        </div>
        <div className="absolute inset-0 w-full h-full bg-black/5 z-10 backdrop-blur-2xl"></div>
        <video src="/img/b4.mp4" autoPlay muted loop className="absolute inset-0 w-full h-full object-cover z-0" />
      </div>
    </div>
  );
}
