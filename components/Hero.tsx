interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <header className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-zinc-900">{title}</h1>
      <p className="text-zinc-500">{subtitle}</p>
    </header>
  );
}