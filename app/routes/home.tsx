import Avatar from "../images/jesus_christ.webp";
import HomelabRaspberry from "../images/homelab_raspberry.webp";
import HomelabRaspberryMobile from "../images/homelab_raspberry_mobile.webp";
import HomelabPC from "../images/homelab_pc.webp";
import HomelabPCMobile from "../images/homelab_pc_mobile.webp";

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
      <header className="mx-auto max-w-2xl pt-4 py-4 flex flex-col items-center justify-center gap-2">
        <div className="w-[80px] h-[80px] rounded-full relative overflow-hidden bg-gray-400">
          <img src={Avatar} alt="in-the-name-of-jesus-christ" />
        </div>
        <a href="/" className="text-center">
          <h1 className="text-xl font-black font-serif uppercase">
            Kha Quang Trần
          </h1>
        </a>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              className="capitalize link font-serif"
              href={item.link}
            >
              <span>{item.key}</span>
            </a>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-2xl  pb-6 flex flex-col gap-6">
        <section id="activities" className="px-2 sm:px-0">
          <div className="flex justify-between">
            <div className="flex flex-row items-center gap-2">
              <h1 className="title">Activities</h1>
              <h2 className="subtitle">— Hoạt Động</h2>
            </div>
            <p className="text-sm">2023 — 2025</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <figure>
              <picture>
                <source media="(min-width: 450px)" srcSet={HomelabPC} />
                <source media="(min-width: 350px)" srcSet={HomelabPCMobile} />
                <img
                  src={HomelabPC}
                  alt="Customized my PC"
                  width="1000px"
                  height="1000px"
                />
              </picture>
              <figcaption className="mt-2 px-2">
                <div className="flex items-center justify-between text-sm">
                  <h1 className="font-bold text-center">
                    Customized my Homelab
                  </h1>
                  <h2>Feb. 2025</h2>
                </div>
              </figcaption>
            </figure>
            <figure>
              <picture>
                <source media="(min-width: 450px)" srcSet={HomelabRaspberry} />
                <source
                  media="(min-width: 350px)"
                  srcSet={HomelabRaspberryMobile}
                />
                <img
                  src={HomelabRaspberry}
                  alt="Played with my Raspberry"
                  width="1000px"
                  height="1000px"
                />
              </picture>
              <figcaption className="mt-2 px-2">
                <div className="flex items-center justify-between text-sm">
                  <h1 className="font-bold text-center">
                    Played with Raspberry
                  </h1>
                  <h2>Feb. 2025</h2>
                </div>
              </figcaption>
            </figure>
          </div>
        </section>
        <section id="about-me" className="px-2 sm:px-0">
          <div className="flex flex-row items-center gap-2">
            <h1 className="title">Introduction</h1>
            <h2 className="subtitle">— Xin Tự Giới Thiệu</h2>
          </div>
          <div className="mt-4 grid grid-rows-0 grid-cols-1 sm:grid-rows-2 sm:grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-6">
            <div>
              <h1 className="tracking-tighter">
                1. About Me — Về Bản Thân Tôi
              </h1>
              <span className="mt-2 description">
                Howdy, I'm a Software Engineer with a passion for building a
                full-scale product. With almost 3 yoe, I'm confident with my
                ability to produce the best outcome not only for the company but
                for the team.
              </span>
            </div>
            <div>
              <h1 className="tracking-tighter">2. Expertise — Chuyên Về</h1>
              <span className="mt-2 description">
                I have a strong passion for backend and of course it's not the
                only thing in development but I do believe backend is the
                backbone for all of the projects nowaday. And of course, a
                mindset of a product owner.
              </span>
            </div>
            <div>
              <h1 className="tracking-tighter">3. Free Time — Lúc Rãnh Rỗi</h1>
              <div className="mt-2 description">
                I like to read Tech books && blogs. I'm able to read the doc for
                hours just for researching. Recently, I took a liking to
                Homelab, servers and networks in order to expand my knowledge.
              </div>
            </div>
            <div>
              <h1 className="text-sm">4. Contact Me — Hãy Liên Hệ Tôi</h1>
              <div className="mt-2 description">
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
            <h1 className="title">Education</h1>
            <h2 className="subtitle">— Học Vấn</h2>
          </div>
          <div className="mt-2 grid grid-rows-2 gap-y-4 text-sm">
            <div className="grid grid-cols-3 gap-x-4">
              <p className="italic">July. 2018 — 2022</p>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-bold">National University of IT (UIT)</h1>
                <h2 className="text-xs font-serif">Computer Science</h2>
                <p className="block sm:hidden mt-2 description">
                  Studied Information Security, but switched back to Software
                  Engineering.
                </p>
              </div>
              <p className="hidden sm:block description">
                Studied Information Security, but switched back to Software
                Engineering.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <p className="italic">???? — ????</p>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-bold">National University of Science</h1>
                <h2 className="text-xs font-serif">Master of ???</h2>
                <p className="block sm:hidden description">
                  I'm considering whether I should start studying Master in
                  advance.
                </p>
              </div>
              <p className="hidden sm:block description">
                I'm considering whether I should start studying Master in
                advance.
              </p>
            </div>
          </div>
        </section>
        <section id="works" className="px-2 sm:px-0">
          <div className="flex flex-row items-center gap-2">
            <h1 className="title">Works</h1>
            <h2 className="subtitle">— Công Việc</h2>
          </div>
          <div className="mt-4 grid grid-rows-3 gap-y-4 text-sm">
            <div className="grid grid-cols-3 gap-x-4">
              <p className="italic">May. 2024 — Feb. 2025</p>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-bold">EATLAB.AI</h1>
                <h2 className="text-xs font-serif">Software Engineer II</h2>
                <p className="block sm:hidden mt-2 description">
                  Collaborated with AI team to provide the best AI product for
                  customers.
                </p>
              </div>
              <p className="hidden sm:block description">
                Collaborated with AI team to provide the best AI product for
                customers.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <div>July. 2022 — Jan. 2024</div>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-bold">Peeba Wholesaler</h1>
                <h2 className="text-xs font-serif">
                  Software Engineer I && II
                </h2>
                <p className="block sm:hidden mt-2 description">
                  Worked with many talent SWEs. I achieved a lot of skills from
                  this place.
                </p>
              </div>
              <p className="hidden sm:block description">
                Worked with many talent SWEs. I achieved a lot of skills from
                this place.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <div>Jan. 2022 — March. 2022</div>
              <div className="col-span-2 sm:col-span-1">
                <h1 className="font-bold">DXC Technology</h1>
                <h2 className="text-xs font-serif">Software Engineer Intern</h2>
                <p className="block sm:hidden mt-2 description">
                  Worked with extreme old legacy codebase, Java? No it's COBOL.
                </p>
              </div>
              <p className="hidden sm:block description">
                Worked with extreme old legacy codebase, Java? No it's COBOL.
              </p>
            </div>
          </div>
        </section>
        <section id="projects" className="px-2 sm:px-0">
          <div className="flex flex-row items-center gap-2">
            <h1 className="title">Projects</h1>
            <h2 className="subtitle">— Dự Án</h2>
          </div>
          <div className="flex flex-col gap-y-4 mt-2">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <h1 className="font-satoshi font-bold tracking-tighter">
                    CQRS Bank API
                  </h1>
                  <h2 className="text-xs font-serif">
                    CQRS Paradigm in Banking Service
                  </h2>
                </div>
                <p className="description">
                  CQRS (Command Query Responsibility Segregation) is a system
                  architecture pattern that separates read and write operations
                  into distinct services.
                </p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-2 text-sm">
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
                <p className="description italic">
                  Spring Boot, Maven, Postgres, MongoDB
                </p>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <h1 className="font-satoshi font-bold tracking-tighter">
                    Simple Manning API
                  </h1>
                  <h2 className="text-xs font-serif">Minial Manning Backend</h2>
                </div>
                <p className="description">
                  CQRS (Command Query Responsibility Segregation) is a system
                  architecture pattern that separates read and write operations
                  into distinct services.
                </p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center mt-2 text-sm">
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
                <p className="description italic">
                  Github Actions, AWS, Docker, TypeScript, Express, Prisma,
                  Postgres
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="footer"
          className="border-t border-dashed border-t-gray-400 mt-4"
        >
          <div className="mt-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 text-sm">
            <p className="text-sm font-serif">
              © 2025 Kha Quang Tran. All rights reserved
            </p>
            <ul className="flex items-center gap-4">
              <li>
                <a href="https://github.com/khaquangtran" className="link">
                  Github
                </a>
              </li>
              <li>
                <a href="mailto:khatran.swe.persona@gmail.com" className="link">
                  Mail
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
