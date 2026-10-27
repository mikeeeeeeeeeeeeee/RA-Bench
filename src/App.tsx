import { Nav } from '@/components/ui/Nav';
import { Hero } from '@/sections/Hero';
import { Film } from '@/sections/Film';
import { Test } from '@/sections/Test';
import { Benchmark } from '@/sections/Benchmark';
import { Findings } from '@/sections/Findings';
import { Cite, Footer, Outlook, Team } from '@/sections/Outro';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Film />
        <Test />
        <Benchmark />
        <Findings />
        <Outlook />
        <Team />
        <Cite />
      </main>
      <Footer />
    </>
  );
}
