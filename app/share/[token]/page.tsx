import { notFound } from 'next/navigation';
import { prisma } from '../../../src/lib/db';
import type { Resource, Annotation } from '@prisma/client';

type ResourceWithAnnotations = Resource & {
  annotations: Annotation[];
};

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const share = await prisma.shareLink.findUnique({
    where: { token },
    include: {
      workspace: {
        include: {
          resources: {
            include: {
              annotations: true
            }
          }
        }
      }
    }
  });

  if (!share || (share.expiresAt && new Date() > share.expiresAt)) {
    notFound();
  }

  const { workspace } = share;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{workspace.title} (Shared)</h1>
      <div className="space-y-4">
        {workspace.resources?.map((resource: ResourceWithAnnotations) => (
          <div key={resource.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{resource.title}</h2>
            {resource.url && (
              <a href={resource.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                {resource.url}
              </a>
            )}
            {resource.annotations.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Annotations:</h3>
                <ul className="list-disc list-inside">
                  {resource.annotations?.map((annotation: Annotation) => (
                    <li key={annotation.id} className="mt-1">
                      {annotation.body}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}