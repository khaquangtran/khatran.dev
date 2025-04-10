import Rasberry from "../images/raspberry.webp";
import BuildPC from "../images/build_pc.webp";

const NAV_ITEMS = [
  {
    key: "about",
    link: "#about-me",
  },
  {
    key: "works",
    link: "#works",
  },
  {
    key: "projects",
    link: "#projects",
  },
  {
    key: "blog",
    link: "/blog",
  },
];

export default function Home() {
  return (
    <>
      <header className="mx-auto max-w-2xl py-6 flex flex-col items-center justify-center gap-2">
        <a href="/" className="font-satoshi text-center">
          <h1 className="text-lg font-bold tracking-tighter">Kha Quang Tran</h1>
          <h2 className="text-xs">Xin Chào</h2>
        </a>
        <nav className="flex items-center gap-4 text-xs font-medium tracking-tight">
          {NAV_ITEMS.map((item) => (
            <a key={item.key} className="capitalize link" href={item.link}>
              <span>{item.key}</span>
            </a>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-2xl py-10 flex flex-col gap-6">
        <section id="activities" className="px-2 sm:px-0">
          <div className="flex justify-between">
            <div className="flex flex-row items-center gap-2">
              <h1 className="title">activities</h1>
              <h2 className="subtitle">— Hoạt Động</h2>
            </div>
            <p className="text-sm">2023 — 2025</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <figure>
              <div className="w-full aspect-square relative overflow-hidden shadow bg-gray-200">
                <img
                  src={BuildPC}
                  className="absolute h-full w-full object-cover"
                  alt="Customized my Homelab"
                />
              </div>
              <figcaption className="mt-2 px-2">
                <div className="flex items-center justify-between text-xs">
                  <h1 className="font-bold text-center">
                    Customized my Homelab
                  </h1>
                  <h2>Feb. 2025</h2>
                </div>
              </figcaption>
            </figure>
            <figure>
              <div className="w-full aspect-square relative overflow-hidden shadow bg-gray-200">
                <img
                  src={Rasberry}
                  className="absolute h-full w-full object-cover"
                  alt="Played with my Rasberry"
                />
              </div>
              <figcaption className="mt-2 px-2">
                <div className="flex items-center justify-between text-xs">
                  <h1 className="font-bold text-center">
                    Played with Rasberry
                  </h1>
                  <h2>Feb. 2025</h2>
                </div>
              </figcaption>
            </figure>
          </div>
        </section>
        <section id="about-me" className="px-2 sm:px-0">
          <div className="flex flex-row items-center gap-2">
            <h1 className="title">introduction</h1>
            <h2 className="subtitle">— Xin Tự Giới Thiệu</h2>
          </div>
          <div className="mt-2 grid grid-rows-0 grid-cols-1 sm:grid-rows-2 sm:grid-cols-2 gap-x-2 gap-y-4 sm:gap-y-6">
            <div>
              <h1 className="text-sm tracking-tighter">
                1. About Me — Về Bản Thân Tôi
              </h1>
              <span className="mt-2 text-xs">
                Howdy, I'm a Software Engineer with a passion for building a
                full-scale product. With almost 3 yoe, I'm confident with my
                ability to produce the best outcome not only for the company but
                for the team.
              </span>
            </div>
            <div>
              <h1 className="text-sm tracking-tighter">
                2. Expertise — Chuyên Về
              </h1>
              <span className="mt-2 text-xs">
                I have a strong passion for backend and of course it's not the
                only thing in development but I do believe backend is the
                backbone for all of the projects nowaday. And of course, a
                mindset of a product owner.
              </span>
            </div>
            <div>
              <h1 className="text-sm tracking-tighter">
                3. Free Time — Lúc Rãnh Rỗi
              </h1>
              <div className="mt-2 text-xs">
                I like to read Tech books && blogs. I'm able to read the doc for
                hours just for researching. Recently, I took a liking to
                Homelab, servers and networks in order to expand my knowledge.
              </div>
            </div>
            <div>
              <h1 className="text-sm tracking-tighter">
                4. Contact Me — Hãy Liên Hệ Tôi
              </h1>
              <div className="mt-2 text-xs">
                I'm currently available at any time, please reach me at ◝(ᵔᗜᵔ)◜{" "}
                <a
                  href="mailto:khatran.swe.persona@gmail.com"
                  className="mt-2 link font-bold"
                >
                  khatran.swe.persona@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>
        <section id="experience" className="px-2 sm:px-0">
          <div className="flex flex-row items-center gap-2">
            <h1 className="title">education</h1>
            <h2 className="subtitle">— Học Vấn</h2>
          </div>
          <div className="mt-2 grid grid-rows-2 gap-y-4 text-xs">
            <div className="grid grid-cols-3 gap-x-2">
              <div>July. 2018 — 2022</div>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-satoshi font-bold tracking-tighter">
                  National University of IT (UIT)
                </h1>
                <h2 className="text-xs">Computer Science</h2>
                <p className="block sm:hidden mt-2 italic">
                  Studied Information Security, but switched back to Software
                  Engineering.
                </p>
              </div>
              <p className="hidden sm:block text-xs">
                Studied Information Security, but switched back to Software
                Engineering.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <div>???? — ????</div>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-satoshi font-bold tracking-tighter">
                  National University of Science
                </h1>
                <h2 className="text-xs italic">Master of ???</h2>
                <p className="block sm:hidden text-xs mt-2">
                  I'm considering whether I should start studying Master in
                  advance.
                </p>
              </div>
              <p className="hidden sm:block text-xs">
                I'm considering whether I should start studying Master in
                advance.
              </p>
            </div>
          </div>
        </section>
        <section id="works" className="px-2 sm:px-0">
          <div className="flex flex-row items-center gap-2">
            <h1 className="title">works</h1>
            <h2 className="subtitle">— Công Việc</h2>
          </div>
          <div className="mt-2 grid grid-rows-3 gap-y-4 text-xs">
            <div className="grid grid-cols-3 gap-x-2">
              <div>May. 2024 — Feb. 2025</div>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-satoshi font-bold tracking-tighter">
                  EATLAB.AI
                </h1>
                <h2 className="text-xs italic">Software Engineer II</h2>
                <p className="block sm:hidden mt-2 text-xs">
                  Collaborated with AI team to provide the best AI product for
                  customers.
                </p>
              </div>
              <p className="hidden sm:block text-xs">
                Collaborated with AI team to provide the best AI product for
                customers.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <div>July. 2022 — Jan. 2024</div>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-satoshi font-bold tracking-tighter">
                  Peeba Wholesaler
                </h1>
                <h2 className="text-xs italic">Software Engineer I && II</h2>
                <p className="block sm:hidden text-xs mt-2">
                  Worked with many talent SWEs. I achieved a lot of skills from
                  this place.
                </p>
              </div>
              <p className="hidden sm:block text-xs">
                Worked with many talent SWEs. I achieved a lot of skills from
                this place.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <div>Jan. 2022 — March. 2022</div>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-satoshi font-bold tracking-tighter">
                  DXC Technology
                </h1>
                <h2 className="text-xs italic">Software Engineer Intern</h2>
                <p className="block sm:hidden text-xs mt-2">
                  Worked with extreme old legacy codebase, Java? No it's COBOL.
                </p>
              </div>
              <p className="hidden sm:block text-xs">
                Worked with extreme old legacy codebase, Java? No it's COBOL.
              </p>
            </div>
          </div>
        </section>
        <section id="projects" className="px-2 sm:px-0">
          <div className="flex flex-row items-center gap-2">
            <h1 className="title">projects</h1>
            <h2 className="subtitle">— Dự Án</h2>
          </div>
          <div className="flex flex-col gap-y-4 mt-2">
            <div>
              <div className="flex justify-between">
                <div>
                  <h1 className="font-satoshi font-bold tracking-tighter">
                    CQRS Bank API
                  </h1>
                  <h2 className="subtitle italic">
                    CQRS Paradigm in Banking Service
                  </h2>
                </div>
                <ul className="flex gap-2">
                  <li>
                    <a
                      href="https://github.com/khaquangtran/event-driven-tech-bank"
                      className="link"
                      target="_blank"
                    >
                      [code]
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 mt-2">
                <p className="text-xs">
                  CQRS (Command Query Responsibility Segregation) is a system
                  architecture pattern that separates read and write operations
                  into distinct services.
                </p>
                <p className="text-xs text-right italic">
                  Spring Boot, Maven, Postgres, MongoDB
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <div>
                  <h1 className="font-satoshi font-bold tracking-tighter">
                    Simple Manning API
                  </h1>
                  <h2 className="subtitle italic">Minial Manning Backend</h2>
                </div>
                <ul className="flex gap-2">
                  <li>
                    <a
                      href="https://github.com/khaquangtran/simple-manning-api"
                      className="link"
                      target="_blank"
                    >
                      [code]
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://ec2-3-27-248-71.ap-southeast-2.compute.amazonaws.com/books"
                      className="link"
                      target="_blank"
                    >
                      [server]
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 mt-2">
                <p className="text-xs">
                  Manning Publications is an American publisher specializing in
                  content relating to computers. I bought a lot of books from
                  Manning, and I'm fascinated how they could build a literally
                  simple product on their side.
                </p>
                <p className="text-xs text-right italic">
                  Github Actions, AWS, Docker, TypeScript, Express, Prisma,
                  Postgres
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="footer"
          className="border-t border-dashed border-t-gray-400"
        >
          <div className="mt-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2">
            <p className="text-xs">
              © 2025 Kha Quang Tran. All rights reserved
            </p>
            <ul className="flex items-center gap-2">
              <li>
                <a href="https://github.com/khaquangtran" className="link">
                  [Github]
                </a>
              </li>
              <li>
                <a href="mailto:khatran.swe.persona@gmail.com" className="link">
                  [Mail]
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
