import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Project | Ecosyz`,
    description: 'View and manage your project details, tasks, and team collaboration.',
  };
}