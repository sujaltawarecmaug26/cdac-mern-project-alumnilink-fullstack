import { Link } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { Chip } from "../../components/ui/Chip.tsx";
import { useFetch } from "../../hooks/useFetch.js";
import { alumniApi } from "../../api/alumni.js";

export default function Landing() {
  const { data: featured, loading } = useFetch(() => alumniApi.featured(), []);
  return (
    <PageContainer>
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-primary to-wine p-7 text-white sm:p-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              A stronger alumni network
            </p>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              Your next opportunity starts{" "}
              <span className="text-amber-300">with your community.</span>
            </h1>
            <p className="mt-4 max-w-lg text-white/85">
              AlumniLink connects students with verified alumni sharing real job
              opportunities, guidance and professional connections.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register?role=student">
                <Button variant="gold">Join as a student</Button>
              </Link>
              <Link to="/register?role=alumnus">
                <Button variant="white">Join as an alumnus</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <p className="font-display text-2xl">A simple path forward</p>
            <div className="mt-5 space-y-4">
              {[
                [
                  "01",
                  "Build your profile",
                  "Add your skills and one current PDF resume.",
                ],
                [
                  "02",
                  "Explore real opportunities",
                  "Browse jobs posted by verified alumni.",
                ],
                [
                  "03",
                  "Apply and connect",
                  "Track applications and connect after approval.",
                ],
              ].map(([n, t, d]) => (
                <div key={n} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 font-semibold">
                    {n}
                  </span>
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-white/75">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="how" className="mt-14">
        <h2 className="text-center font-display text-3xl text-cocoa">
          How AlumniLink works
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [
              "Create your profile",
              "Students and alumni create a profile. Alumni accounts are verified by an admin.",
            ],
            [
              "Share opportunities",
              "Verified alumni post jobs with role details and required skills.",
            ],
            [
              "Apply with confidence",
              "Students apply using their saved resume and track the decision.",
            ],
          ].map(([title, text], i) => (
            <Card key={title} className="p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Our alumni community</h2>
          <Link
            to="/register?role=alumnus"
            className="text-sm text-primary underline"
          >
            Become a member
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {loading ? (
            <p className="text-sm text-muted">Loading alumni...</p>
          ) : (
            (featured || []).map((a) => (
              <Chip key={a.id} tone="pink">
                {a.name} · {a.company}
              </Chip>
            ))
          )}
        </div>
      </section>
    </PageContainer>
  );
}
