import { notFound } from 'next/navigation';
import ClientWorkspaceWrapper from './client-wrapper';

export async function generateStaticParams() {
  return [];
}

export default async function WorkspacePage({
  params
}: {
  params: { id: string }
}) {
  // For now, we just return the client component wrapper
  // In a real app, you would check authentication and perform server-side data fetching
  
  // Check if workspace exists (can be implemented with real database later)
  // if (!workspaceExists(params.id)) {
  //   notFound();
  // }
  
  return <ClientWorkspaceWrapper />;
}